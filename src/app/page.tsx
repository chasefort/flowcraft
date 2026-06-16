import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Sparkles,
  ListTree,
  PenLine,
  ShieldCheck,
  Boxes,
  FileJson,
  Workflow,
  Eye,
  Download,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { STAGE_DESCRIPTIONS, STAGE_LABELS, FLOW_STAGES } from "@/lib/types";

const stageIcons = [Globe, Sparkles, ListTree, PenLine, Eye];

const techCards = [
  {
    icon: Workflow,
    title: "Agentic workflow",
    body: "Five sequential stages — research, themes, pillars, drafts, review — each a focused step with a single job, streaming its progress to the browser as it runs.",
  },
  {
    icon: Globe,
    title: "Web & source ingestion",
    body: "Pulls in a company URL (via Firecrawl) or pasted source material, then distils it into a summary and key facts the rest of the flow builds on.",
  },
  {
    icon: Sparkles,
    title: "LLM drafting",
    body: "OpenAI (via the Vercel AI SDK) turns the brief into themes, pillars, and channel-specific draft copy with reasoning and a CTA for every post.",
  },
  {
    icon: FileJson,
    title: "Structured outputs",
    body: "Every stage returns schema-validated JSON (zod), so the output is reliable to render and safe to review — no brittle string parsing.",
  },
  {
    icon: ShieldCheck,
    title: "Human review before publishing",
    body: "Nothing auto-publishes. Each post starts as a draft; you approve, edit, or flag it, then export only what you've approved.",
  },
  {
    icon: Download,
    title: "Export-ready output",
    body: "Approved posts and the full plan export as clean Markdown or JSON — ready to drop into your scheduler, CMS, or doc of choice.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-5 pt-16 pb-14 sm:pt-24 sm:pb-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
              <Boxes size={13} className="text-[var(--primary)]" />
              AI workflow tool for marketing teams
            </span>
            <h1 className="font-display mt-5 text-balance text-[2.6rem] font-medium leading-[1.03] sm:text-[4rem]">
              From messy inputs to a{" "}
              <span className="highlight-swipe">review-ready</span> content plan.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--muted)]">
              Flowcraft is an agentic content-planning workflow. Bring a URL or
              source material, a campaign goal, your audience, and your brand
              voice — and watch AI agents research, find themes, plan pillars,
              and draft posts you can edit and approve before anything ships.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/plan"
                className="group inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-medium text-[var(--primary-foreground)] shadow-[var(--shadow-md)] transition-all hover:bg-[var(--primary-hover)] hover:-translate-y-0.5"
              >
                Open the planner
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-3 font-medium transition-colors hover:bg-[var(--surface-muted)]"
              >
                See how it works
              </Link>
            </div>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Powered by{" "}
              <strong className="font-medium text-[var(--foreground)]">live AI generation</strong> —
              bring a URL or paste source material and the workflow does the rest.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-y border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <div className="max-w-2xl">
              <h2 className="font-display text-[2rem] font-medium leading-tight">The workflow</h2>
              <p className="mt-3 text-[var(--muted)]">
                One pass, five stages. Each step hands structured output to the
                next — exactly how the agentic flow runs under the hood.
              </p>
            </div>

            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {FLOW_STAGES.map((stage, i) => {
                const Icon = stageIcons[i];
                return (
                  <li
                    key={stage}
                    className="relative flex flex-col rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                        <Icon size={18} />
                      </span>
                      <span className="text-xs font-semibold text-[var(--muted)]">
                        Step {i + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 font-semibold leading-snug">{STAGE_LABELS[stage]}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {STAGE_DESCRIPTIONS[stage]}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Plain-English story */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <h2 className="font-display text-[2rem] font-medium leading-tight">What it actually does</h2>
              <div className="mt-5 space-y-4 text-[var(--muted)] leading-relaxed">
                <p>
                  Marketing teams rarely start with a tidy brief. They start with
                  a website, a half-formed goal, a sense of who they&apos;re
                  talking to, and a vibe for how the brand should sound.
                </p>
                <p>
                  Flowcraft takes those messy inputs and runs them through an{" "}
                  <strong className="font-medium text-[var(--foreground)]">AI workflow</strong>{" "}
                  that ingests the context, turns it into a strategy, and
                  generates draft posts and campaign ideas — each with the
                  reasoning for why it fits and a suggested call to action.
                </p>
                <p>
                  Crucially, a human stays in the loop. Everything lands as a{" "}
                  <strong className="font-medium text-[var(--foreground)]">draft</strong> you
                  review, edit, and approve. Nothing is published on autopilot.
                </p>
              </div>
            </div>
            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                The shape of it
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                {[
                  ["Inputs", "URL / source · goal · audience · voice · channels · cadence"],
                  ["Workflow", "research → themes → pillars → drafts → review"],
                  ["Output", "themes, pillars & draft posts with reasoning + CTA"],
                  ["Control", "approve / edit / flag · copy · export"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex gap-3 rounded-lg bg-[var(--surface-muted)] px-3 py-2.5"
                  >
                    <span className="w-20 shrink-0 font-medium text-[var(--foreground)]">{k}</span>
                    <span className="text-[var(--muted)]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tech */}
        <section id="tech" className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <div className="max-w-2xl">
              <h2 className="font-display text-[2rem] font-medium leading-tight">What&apos;s under the hood</h2>
              <p className="mt-3 text-[var(--muted)]">
                A focused, production-grade stack that turns an agentic workflow
                into a deployable web app.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {techCards.map((c) => (
                <div
                  key={c.title}
                  className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-5"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                    <c.icon size={18} />
                  </span>
                  <h3 className="mt-4 font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{c.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {[
                "Next.js (App Router)",
                "TypeScript",
                "Vercel AI SDK",
                "OpenAI",
                "zod structured output",
                "Firecrawl (optional)",
                "Tailwind CSS",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-sm text-[var(--muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="relative overflow-hidden rounded-[var(--radius)] bg-[var(--pine)] px-8 py-12 text-center text-[var(--background)] shadow-[var(--shadow-lg)] sm:py-16">
            {/* decorative contour motif */}
            <svg
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 opacity-[0.18]"
              viewBox="-80 -80 160 160"
            >
              {Array.from({ length: 7 }).map((_, i) => {
                const s = 0.5 + i * 0.2;
                return (
                  <path
                    key={i}
                    d="M0,-60 C40,-58 70,-30 66,4 C62,38 34,62 -4,60 C-42,58 -68,30 -64,-6 C-60,-40 -36,-62 0,-60 Z"
                    transform={`scale(${s}) rotate(${i * 7})`}
                    fill="none"
                    stroke="var(--highlight)"
                    strokeWidth={1 / s}
                  />
                );
              })}
            </svg>
            <h2 className="font-display relative text-[2rem] font-medium leading-tight sm:text-[2.5rem]">
              Try it in under a minute
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-[color-mix(in_srgb,var(--background)_75%,transparent)]">
              Load a sample brief or bring your own. Watch the workflow run, then
              review the plan it produces.
            </p>
            <Link
              href="/plan"
              className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 font-medium text-[var(--primary-foreground)] transition-all hover:bg-[var(--primary-hover)] hover:-translate-y-0.5"
            >
              Open the planner
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
