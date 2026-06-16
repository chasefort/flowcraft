import { z } from "zod";

/**
 * Shared schemas for the content-planning flow.
 *
 * These zod schemas force the LLM to return *structured* output at each stage
 * of the flow, so the UI can render it reliably and a human can review it
 * before anything is published.
 */

export const CHANNELS = [
  "LinkedIn",
  "X / Twitter",
  "Instagram",
  "Newsletter",
  "Blog",
  "YouTube",
] as const;

export type Channel = (typeof CHANNELS)[number];

export const CADENCES = [
  "1 week sprint",
  "2 week sprint",
  "1 month",
  "1 quarter",
] as const;

// ---------- Input ----------

export const PlanInputSchema = z.object({
  companyContext: z.string().max(4000).optional().default(""),
  sourceUrl: z.string().max(2000).optional().default(""),
  sourceText: z.string().max(20000).optional().default(""),
  campaignGoal: z.string().min(1).max(1000),
  audience: z.string().min(1).max(1000),
  brandVoice: z.string().min(1).max(1000),
  channels: z.array(z.string()).min(1),
  cadence: z.string().min(1),
});

export type PlanInput = z.infer<typeof PlanInputSchema>;

// ---------- Stage outputs ----------

export const SourceDigestSchema = z.object({
  sourceType: z.enum(["url", "pasted", "context-only"]),
  title: z.string(),
  summary: z.string(),
  keyFacts: z.array(z.string()),
});
export type SourceDigest = z.infer<typeof SourceDigestSchema>;

export const ThemeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});
export type Theme = z.infer<typeof ThemeSchema>;

export const PillarSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  rationale: z.string(),
});
export type Pillar = z.infer<typeof PillarSchema>;

export const POST_STATUS = ["draft", "approved", "needs_edit"] as const;
export type PostStatus = (typeof POST_STATUS)[number];

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  channel: z.string(),
  pillar: z.string(),
  draftCopy: z.string(),
  reasoning: z.string(),
  cta: z.string(),
  hashtags: z.array(z.string()),
  suggestedSlot: z.string(),
});
export type Post = z.infer<typeof PostSchema>;

// Client-side review state is layered on top of the generated Post.
export type ReviewablePost = Post & { status: PostStatus };

export const StrategySchema = z.object({
  overview: z.string(),
  positioning: z.string(),
});
export type Strategy = z.infer<typeof StrategySchema>;

export const ContentPlanSchema = z.object({
  meta: z.object({
    mode: z.literal("live"),
    model: z.string(),
    generatedAt: z.string(),
  }),
  input: PlanInputSchema,
  source: SourceDigestSchema,
  strategy: StrategySchema,
  themes: z.array(ThemeSchema),
  pillars: z.array(PillarSchema),
  posts: z.array(PostSchema),
});
export type ContentPlan = z.infer<typeof ContentPlanSchema>;

// ---------- Streaming flow events ----------

export const FLOW_STAGES = [
  "ingest",
  "themes",
  "pillars",
  "draft",
  "review",
] as const;
export type FlowStage = (typeof FLOW_STAGES)[number];

export const STAGE_LABELS: Record<FlowStage, string> = {
  ingest: "Research & ingest context",
  themes: "Extract key themes",
  pillars: "Plan content pillars",
  draft: "Draft posts",
  review: "Prepare for review",
};

export const STAGE_DESCRIPTIONS: Record<FlowStage, string> = {
  ingest:
    "Read the source URL or pasted material and distil it into a summary plus key facts.",
  themes: "Find the recurring ideas worth building content around.",
  pillars: "Group themes into durable content pillars with a clear rationale.",
  draft: "Write channel-specific draft copy, a CTA, and the reasoning behind each post.",
  review: "Assemble everything into a review-ready plan — nothing is published automatically.",
};

export type FlowEvent =
  | { type: "meta"; mode: "live"; model: string }
  | { type: "stage"; stage: FlowStage; status: "running" }
  | { type: "stage"; stage: FlowStage; status: "done"; note?: string }
  | { type: "plan"; plan: ContentPlan }
  | { type: "error"; message: string };
