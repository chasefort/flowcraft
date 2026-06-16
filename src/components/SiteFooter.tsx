import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-medium text-[var(--foreground)]">Flowcraft</span> — an
          AI content-planning workflow for marketing teams.
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/#how-it-works" className="hover:text-[var(--foreground)]">
            How it works
          </Link>
          <Link href="/plan" className="hover:text-[var(--foreground)]">
            Open the planner →
          </Link>
        </p>
      </div>
    </footer>
  );
}
