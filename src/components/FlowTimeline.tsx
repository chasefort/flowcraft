"use client";

import { Check, Loader2, Circle } from "lucide-react";
import {
  FLOW_STAGES,
  STAGE_LABELS,
  STAGE_DESCRIPTIONS,
  type FlowStage,
} from "@/lib/types";

export type StageState = "pending" | "running" | "done";

export function FlowTimeline({
  states,
  notes,
  mode,
}: {
  states: Record<FlowStage, StageState>;
  notes: Partial<Record<FlowStage, string>>;
  mode: "live" | null;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Workflow
        </h3>
        {mode === "live" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success-soft)] px-2.5 py-1 text-xs font-medium text-[var(--success)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
            Live AI
          </span>
        )}
      </div>

      <ol className="mt-4 flex flex-col">
        {FLOW_STAGES.map((stage, i) => {
          const state = states[stage];
          const isLast = i === FLOW_STAGES.length - 1;
          return (
            <li key={stage} className="relative flex gap-3 pb-5 last:pb-0">
              {/* connector */}
              {!isLast && (
                <span
                  className={`absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px ${
                    state === "done" ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                  }`}
                />
              )}
              <span
                className={`relative z-10 mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors ${
                  state === "done"
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : state === "running"
                      ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] pulse-ring"
                      : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--muted)]"
                }`}
              >
                {state === "done" ? (
                  <Check size={15} />
                ) : state === "running" ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Circle size={9} />
                )}
              </span>
              <div className="min-w-0 pt-0.5">
                <p
                  className={`text-sm font-medium ${
                    state === "pending" ? "text-[var(--muted)]" : "text-[var(--foreground)]"
                  }`}
                >
                  {STAGE_LABELS[stage]}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-[var(--muted)]">
                  {notes[stage] ?? STAGE_DESCRIPTIONS[stage]}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
