import Link from "next/link";
import { Workflow } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_82%,transparent)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-sm)]">
            <Workflow size={17} />
          </span>
          <span className="font-display text-[19px] font-medium tracking-tight">Flowcraft</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/#how-it-works"
            className="hidden rounded-lg px-3 py-2 text-[var(--muted)] transition-colors hover:text-[var(--foreground)] sm:block"
          >
            How it works
          </Link>
          <Link
            href="/#tech"
            className="hidden rounded-lg px-3 py-2 text-[var(--muted)] transition-colors hover:text-[var(--foreground)] sm:block"
          >
            Tech
          </Link>
          <Link
            href="/plan"
            className="rounded-lg bg-[var(--foreground)] px-3.5 py-2 font-medium text-[var(--background)] transition-transform hover:-translate-y-px"
          >
            Open the planner
          </Link>
        </nav>
      </div>
    </header>
  );
}
