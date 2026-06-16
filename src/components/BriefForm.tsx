"use client";

import { CHANNELS, CADENCES, type PlanInput } from "@/lib/types";
import { SAMPLES } from "@/lib/samples";
import { Link2, FileText, Sparkles, Loader2, RotateCcw } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]";

const labelClass = "block text-sm font-medium";
const hintClass = "mt-1 text-xs text-[var(--muted)]";

export function BriefForm({
  value,
  onChange,
  onSubmit,
  onReset,
  running,
}: {
  value: PlanInput;
  onChange: (v: PlanInput) => void;
  onSubmit: () => void;
  onReset: () => void;
  running: boolean;
}) {
  const set = <K extends keyof PlanInput>(key: K, v: PlanInput[K]) =>
    onChange({ ...value, [key]: v });

  const toggleChannel = (c: string) => {
    const has = value.channels.includes(c);
    const next = has
      ? value.channels.filter((x) => x !== c)
      : [...value.channels, c];
    set("channels", next.length ? next : value.channels);
  };

  const canSubmit =
    value.campaignGoal.trim() &&
    value.audience.trim() &&
    value.brandVoice.trim() &&
    value.channels.length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit && !running) onSubmit();
      }}
      className="flex flex-col gap-6"
    >
      {/* Samples */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Start from a sample
          </span>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            <RotateCcw size={12} /> Clear
          </button>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.input)}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-left transition-all hover:border-[var(--primary)] hover:shadow-[var(--shadow-sm)]"
            >
              <span className="block text-sm font-medium">{s.label}</span>
              <span className="mt-0.5 block text-xs leading-snug text-[var(--muted)]">
                {s.blurb}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-[var(--border)]" />

      {/* Source */}
      <div className="grid gap-4">
        <div>
          <label className={labelClass} htmlFor="sourceUrl">
            <span className="inline-flex items-center gap-1.5">
              <Link2 size={14} className="text-[var(--muted)]" /> Company / product URL
            </span>
          </label>
          <input
            id="sourceUrl"
            className={`${inputClass} mt-1.5`}
            placeholder="yourcompany.com/product"
            value={value.sourceUrl}
            onChange={(e) => set("sourceUrl", e.target.value)}
          />
          <p className={hintClass}>
            Scraped with Firecrawl when a key is set. Optional.
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="sourceText">
            <span className="inline-flex items-center gap-1.5">
              <FileText size={14} className="text-[var(--muted)]" /> …or paste source material
            </span>
          </label>
          <textarea
            id="sourceText"
            rows={3}
            className={`${inputClass} mt-1.5 resize-y`}
            placeholder="Paste product details, a landing page, notes, a press release…"
            value={value.sourceText}
            onChange={(e) => set("sourceText", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="companyContext">
            Company context
          </label>
          <textarea
            id="companyContext"
            rows={2}
            className={`${inputClass} mt-1.5 resize-y`}
            placeholder="What does the company do? Who is it for?"
            value={value.companyContext}
            onChange={(e) => set("companyContext", e.target.value)}
          />
        </div>
      </div>

      <div className="h-px bg-[var(--border)]" />

      {/* The brief */}
      <div className="grid gap-4">
        <div>
          <label className={labelClass} htmlFor="campaignGoal">
            Campaign goal <span className="text-[var(--danger)]">*</span>
          </label>
          <input
            id="campaignGoal"
            className={`${inputClass} mt-1.5`}
            placeholder="e.g. Drive sign-ups for the beta waitlist"
            value={value.campaignGoal}
            onChange={(e) => set("campaignGoal", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="audience">
            Target audience <span className="text-[var(--danger)]">*</span>
          </label>
          <input
            id="audience"
            className={`${inputClass} mt-1.5`}
            placeholder="e.g. Ops leads at small creative agencies"
            value={value.audience}
            onChange={(e) => set("audience", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="brandVoice">
            Brand voice <span className="text-[var(--danger)]">*</span>
          </label>
          <input
            id="brandVoice"
            className={`${inputClass} mt-1.5`}
            placeholder="e.g. Confident, practical, lightly witty. No hype."
            value={value.brandVoice}
            onChange={(e) => set("brandVoice", e.target.value)}
          />
        </div>

        <div>
          <span className={labelClass}>
            Channels <span className="text-[var(--danger)]">*</span>
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {CHANNELS.map((c) => {
              const active = value.channels.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleChannel(c)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                    active
                      ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                      : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--foreground)]"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="cadence">
            Time horizon / cadence
          </label>
          <select
            id="cadence"
            className={`${inputClass} mt-1.5`}
            value={value.cadence}
            onChange={(e) => set("cadence", e.target.value)}
          >
            {CADENCES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <p className={hintClass}>
            Longer windows generate more posts per channel.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmit || running}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-medium text-[var(--primary-foreground)] shadow-[var(--shadow-md)] transition-all hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {running ? (
          <>
            <Loader2 size={17} className="animate-spin" /> Running the workflow…
          </>
        ) : (
          <>
            <Sparkles size={17} /> Generate content plan
          </>
        )}
      </button>
      {!canSubmit && (
        <p className="-mt-3 text-center text-xs text-[var(--muted)]">
          Fill in goal, audience, voice, and at least one channel to run.
        </p>
      )}
    </form>
  );
}
