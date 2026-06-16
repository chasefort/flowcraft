import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PlannerWorkspace } from "@/components/PlannerWorkspace";

export const metadata: Metadata = {
  title: "Planner — Flowcraft",
  description:
    "Run the agentic content-planning workflow: ingest context, extract themes, plan pillars, draft posts, and review.",
};

export default function PlanPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-5 py-8">
            <h1 className="font-display text-[1.9rem] font-medium leading-tight sm:text-[2.4rem]">
              Content planning workflow
            </h1>
            <p className="mt-2 max-w-2xl text-[var(--muted)]">
              Bring a URL or source material, a goal, audience, and brand voice.
              The workflow researches, finds themes, plans pillars, and drafts
              posts — all review-ready, nothing auto-published.
            </p>
          </div>
        </div>
        <PlannerWorkspace />
      </main>
      <SiteFooter />
    </>
  );
}
