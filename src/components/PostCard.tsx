"use client";

import { useState } from "react";
import {
  Check,
  Pencil,
  Flag,
  RotateCcw,
  Copy,
  CalendarClock,
  Megaphone,
  Lightbulb,
} from "lucide-react";
import type { ReviewablePost, PostStatus } from "@/lib/types";

const channelColor: Record<string, string> = {
  LinkedIn: "bg-[#e8f0fb] text-[#1f5fb0]",
  "X / Twitter": "bg-[#e9eaec] text-[#1a1a1a]",
  Instagram: "bg-[#fdeaf2] text-[#c13584]",
  Newsletter: "bg-[var(--accent-soft)] text-[var(--accent)]",
  Blog: "bg-[var(--primary-soft)] text-[var(--primary)]",
  YouTube: "bg-[#fde8e8] text-[#c4302b]",
};

const statusMeta: Record<PostStatus, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-[var(--surface-muted)] text-[var(--muted)]" },
  approved: { label: "Approved", cls: "bg-[var(--success-soft)] text-[var(--success)]" },
  needs_edit: { label: "Needs edit", cls: "bg-[var(--warning-soft)] text-[var(--warning)]" },
};

export function PostCard({
  post,
  onChange,
}: {
  post: ReviewablePost;
  onChange: (next: ReviewablePost) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const setStatus = (status: PostStatus) => onChange({ ...post, status });

  const copy = async () => {
    const text = `${post.draftCopy}\n\n${post.cta}${
      post.hashtags.length ? "\n\n" + post.hashtags.join(" ") : ""
    }`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <article className="animate-in rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              channelColor[post.channel] ?? "bg-[var(--surface-muted)] text-[var(--muted)]"
            }`}
          >
            {post.channel}
          </span>
          <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--muted)]">
            {post.pillar}
          </span>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusMeta[post.status].cls}`}
        >
          {statusMeta[post.status].label}
        </span>
      </div>

      <h4 className="mt-3 font-semibold leading-snug">{post.title}</h4>

      {/* Draft copy */}
      {editing ? (
        <textarea
          autoFocus
          rows={6}
          className="mt-3 w-full resize-y rounded-lg border border-[var(--primary)] bg-[var(--background)] p-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
          value={post.draftCopy}
          onChange={(e) => onChange({ ...post, draftCopy: e.target.value })}
        />
      ) : (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]">
          {post.draftCopy}
        </p>
      )}

      {post.hashtags.length > 0 && (
        <p className="mt-2 text-sm text-[var(--primary)]">{post.hashtags.join(" ")}</p>
      )}

      {/* Meta rows */}
      <div className="mt-4 space-y-2.5 rounded-lg bg-[var(--surface-muted)] p-3 text-sm">
        <div className="flex gap-2">
          <Megaphone size={15} className="mt-0.5 shrink-0 text-[var(--accent)]" />
          <p>
            <span className="font-medium">CTA:</span>{" "}
            {editing ? (
              <input
                className="mt-1 w-full rounded border border-[var(--border-strong)] bg-[var(--surface)] px-2 py-1 text-sm outline-none focus:border-[var(--primary)]"
                value={post.cta}
                onChange={(e) => onChange({ ...post, cta: e.target.value })}
              />
            ) : (
              <span className="text-[var(--muted)]">{post.cta}</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Lightbulb size={15} className="mt-0.5 shrink-0 text-[var(--primary)]" />
          <p>
            <span className="font-medium">Why this fits:</span>{" "}
            <span className="text-[var(--muted)]">{post.reasoning}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <CalendarClock size={15} className="mt-0.5 shrink-0 text-[var(--muted)]" />
          <p>
            <span className="font-medium">Suggested slot:</span>{" "}
            <span className="text-[var(--muted)]">{post.suggestedSlot}</span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setStatus(post.status === "approved" ? "draft" : "approved")}
          aria-pressed={post.status === "approved"}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            post.status === "approved"
              ? "border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]"
              : "border-[var(--border-strong)] hover:bg-[var(--surface-muted)]"
          }`}
        >
          <Check size={13} /> {post.status === "approved" ? "Approved" : "Approve"}
        </button>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            editing
              ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
              : "border-[var(--border-strong)] hover:bg-[var(--surface-muted)]"
          }`}
        >
          <Pencil size={13} /> {editing ? "Done editing" : "Edit"}
        </button>
        <button
          type="button"
          onClick={() => setStatus(post.status === "needs_edit" ? "draft" : "needs_edit")}
          aria-pressed={post.status === "needs_edit"}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            post.status === "needs_edit"
              ? "border-[var(--warning)] bg-[var(--warning-soft)] text-[var(--warning)]"
              : "border-[var(--border-strong)] hover:bg-[var(--surface-muted)]"
          }`}
        >
          <Flag size={13} /> Flag
        </button>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--surface-muted)]"
        >
          <Copy size={13} /> {copied ? "Copied!" : "Copy"}
        </button>
        {post.status !== "draft" && (
          <button
            type="button"
            onClick={() => setStatus("draft")}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>
    </article>
  );
}
