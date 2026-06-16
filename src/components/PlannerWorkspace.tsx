"use client";

import { useRef, useState } from "react";
import { AlertTriangle, ArrowDown, Wand2 } from "lucide-react";
import {
  FLOW_STAGES,
  type ContentPlan,
  type FlowEvent,
  type FlowStage,
  type PlanInput,
} from "@/lib/types";
import { EMPTY_INPUT } from "@/lib/samples";
import { BriefForm } from "./BriefForm";
import { FlowTimeline, type StageState } from "./FlowTimeline";
import { PlanResults } from "./PlanResults";

type Status = "idle" | "running" | "done" | "error";

const initialStates = (): Record<FlowStage, StageState> =>
  Object.fromEntries(FLOW_STAGES.map((s) => [s, "pending"])) as Record<
    FlowStage,
    StageState
  >;

export function PlannerWorkspace() {
  const [input, setInput] = useState<PlanInput>(EMPTY_INPUT);
  const [status, setStatus] = useState<Status>("idle");
  const [mode, setMode] = useState<"live" | null>(null);
  const [stageStates, setStageStates] = useState(initialStates);
  const [notes, setNotes] = useState<Partial<Record<FlowStage, string>>>({});
  const [plan, setPlan] = useState<ContentPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const run = async () => {
    setStatus("running");
    setError(null);
    setPlan(null);
    setMode(null);
    setStageStates(initialStates());
    setNotes({});

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const handle = (event: FlowEvent) => {
        switch (event.type) {
          case "meta":
            setMode(event.mode);
            break;
          case "stage":
            setStageStates((prev) => ({ ...prev, [event.stage]: event.status }));
            if (event.status === "done" && event.note) {
              setNotes((prev) => ({ ...prev, [event.stage]: event.note }));
            }
            break;
          case "plan":
            setPlan(event.plan);
            break;
          case "error":
            setError(event.message);
            break;
        }
      };

      // Read NDJSON stream line by line.
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            handle(JSON.parse(trimmed) as FlowEvent);
          } catch {
            /* ignore partial/non-JSON line */
          }
        }
      }
      if (buffer.trim()) {
        try {
          handle(JSON.parse(buffer.trim()) as FlowEvent);
        } catch {
          /* ignore */
        }
      }

      setStatus((prev) => (prev === "error" ? "error" : "done"));
      setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        120,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  };

  const reset = () => {
    setInput(EMPTY_INPUT);
    setStatus("idle");
    setPlan(null);
    setMode(null);
    setStageStates(initialStates());
    setNotes({});
    setError(null);
  };

  const showTimeline = status !== "idle";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* Left: form + timeline */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Campaign brief</h2>
              <p className="text-sm text-[var(--muted)]">
                Bring your inputs. The workflow does the rest.
              </p>
            </div>
            <BriefForm
              value={input}
              onChange={setInput}
              onSubmit={run}
              onReset={reset}
              running={status === "running"}
            />
          </div>

          {showTimeline && (
            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
              <FlowTimeline states={stageStates} notes={notes} mode={mode} />
            </div>
          )}
        </div>

        {/* Right: results */}
        <div ref={resultsRef} className="min-w-0">
          {error && (
            <div className="mb-6 flex items-start gap-2.5 rounded-[var(--radius)] border border-[var(--danger)] bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] p-4 text-sm">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[var(--danger)]" />
              <div>
                <p className="font-medium">The workflow hit a problem</p>
                <p className="mt-0.5 text-[var(--muted)]">{error}</p>
              </div>
            </div>
          )}

          {!plan && status !== "running" && !error && (
            <EmptyState />
          )}

          {status === "running" && !plan && <RunningState />}

          {plan && (
            <div className="animate-in">
              <PlanResults key={plan.meta.generatedAt} plan={plan} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-[var(--radius)] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] p-10 text-center">
      <div className="max-w-sm">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <Wand2 size={22} />
        </span>
        <h3 className="font-display mt-4 text-2xl font-medium">Your content plan appears here</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Load a sample or fill in the brief, then run the workflow. You&apos;ll
          watch it research, find themes, plan pillars, and draft posts you can
          review and approve.
        </p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] lg:hidden">
          <ArrowDown size={15} /> Scroll up to the brief
        </p>
      </div>
    </div>
  );
}

function RunningState() {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="shimmer rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5"
        >
          <div className="h-4 w-1/3 rounded bg-[var(--surface-muted)]" />
          <div className="mt-3 h-3 w-full rounded bg-[var(--surface-muted)]" />
          <div className="mt-2 h-3 w-5/6 rounded bg-[var(--surface-muted)]" />
          <div className="mt-2 h-3 w-2/3 rounded bg-[var(--surface-muted)]" />
        </div>
      ))}
    </div>
  );
}
