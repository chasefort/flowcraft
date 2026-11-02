import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p>
            <span className="font-medium text-[var(--foreground)]">Flowcraft</span> — an
            AI content-planning workflow for marketing teams.
          </p>
          <a href="https://www.frontierresearch.xyz/" className="mt-1 inline-flex min-h-11 items-center text-xs text-[var(--foreground)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">
            By Chase Fort, founder of Frontier Research
          </a>
        </div>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/#how-it-works" className="hover:text-[var(--foreground)]">
            How it works
          </Link>
          <Link href="/plan" className="inline-flex min-h-11 items-center gap-2 hover:text-[var(--foreground)]">
            Open the planner
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </p>
      </div>
    </footer>
  );
}
