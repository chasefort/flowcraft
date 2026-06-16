"use client";

import { useMemo, useState } from "react";
import {
  Compass,
  FileText,
  Sparkles,
  ListTree,
  Download,
  Copy,
  CheckCircle2,
} from "lucide-react";
import type { ContentPlan, ReviewablePost } from "@/lib/types";
import { PostCard } from "./PostCard";

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
      <Icon size={15} className="text-[var(--primary)]" />
      {children}
    </h3>
  );
}

export function PlanResults({ plan }: { plan: ContentPlan }) {
  const [posts, setPosts] = useState<ReviewablePost[]>(() =>
    plan.posts.map((p) => ({ ...p, status: "draft" as const })),
  );
  const [copiedAll, setCopiedAll] = useState(false);

  const approved = useMemo(() => posts.filter((p) => p.status === "approved"), [posts]);

  const updatePost = (next: ReviewablePost) =>
    setPosts((prev) => prev.map((p) => (p.id === next.id ? next : p)));

  const exportJson = () => {
    const data = { ...plan, posts };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content-plan.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyApproved = async () => {
    const text = approved
      .map(
        (p) =>
          `## ${p.title} (${p.channel})\n\n${p.draftCopy}\n\n${p.cta}${
            p.hashtags.length ? "\n" + p.hashtags.join(" ") : ""
          }`,
      )
      .join("\n\n---\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Strategy */}
      <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
        <SectionTitle icon={Compass}>Strategy</SectionTitle>
        <p className="mt-3 text-lg leading-relaxed">{plan.strategy.overview}</p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          <span className="font-medium text-[var(--foreground)]">Positioning:</span>{" "}
          {plan.strategy.positioning}
        </p>
      </section>

      {/* Source digest */}
      <section>
        <SectionTitle icon={FileText}>Source digest</SectionTitle>
        <div className="mt-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{plan.source.title}</span>
            <span className="rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-xs text-[var(--muted)]">
              {plan.source.sourceType}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{plan.source.summary}</p>
          {plan.source.keyFacts.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {plan.source.keyFacts.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--muted)]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Themes & Pillars */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <SectionTitle icon={Sparkles}>Content themes</SectionTitle>
          <div className="mt-3 grid gap-2.5">
            {plan.themes.map((t) => (
              <div
                key={t.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <p className="font-medium">{t.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle icon={ListTree}>Content pillars</SectionTitle>
          <div className="mt-3 grid gap-2.5">
            {plan.pillars.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <p className="font-medium">{p.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{p.description}</p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                  <span className="font-medium text-[var(--foreground)]">Why:</span> {p.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionTitle icon={FileText}>
            Draft posts ({posts.length}) · {approved.length} approved
          </SectionTitle>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} onChange={updatePost} />
          ))}
        </div>
      </section>

      {/* Review actions */}
      <section className="sticky bottom-4 z-20 rounded-[var(--radius)] border border-[var(--border-strong)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] p-4 shadow-[var(--shadow-md)] backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <CheckCircle2 size={16} className="text-[var(--success)]" />
            <span>
              <strong className="text-[var(--foreground)]">{approved.length}</strong> of{" "}
              {posts.length} posts approved for export.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportJson}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--surface-muted)]"
            >
              <Download size={15} /> Export JSON
            </button>
            <button
              type="button"
              onClick={copyApproved}
              disabled={approved.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Copy size={15} /> {copiedAll ? "Copied!" : "Copy approved"}
            </button>
          </div>
        </div>
        {approved.length === 0 && (
          <p className="mt-2 text-xs text-[var(--muted)]">
            Approve at least one post to copy or export it.
          </p>
        )}
      </section>
    </div>
  );
}
