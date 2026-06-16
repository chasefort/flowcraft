import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import {
  type ContentPlan,
  type FlowEvent,
  type PlanInput,
  type SourceDigest,
  PillarSchema,
  PostSchema,
  SourceDigestSchema,
  StrategySchema,
  ThemeSchema,
} from "./types";
import { scrapeUrl } from "./firecrawl";

/**
 * The agentic content-planning flow.
 *
 * Each stage (ingest, themes, pillars, drafts, review) calls the LLM with a
 * focused prompt and a zod schema for structured output. The flow is an async
 * generator that yields events so the UI can show progress live, then a final
 * `plan` event.
 *
 * This is fully live: it requires OPENAI_API_KEY (validated by the API route).
 * URL ingestion uses Firecrawl when FIRECRAWL_API_KEY is set.
 */

const MODEL_ID = process.env.OPENAI_MODEL || "gpt-4o";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function hasLiveKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function hasFirecrawlKey(): boolean {
  return Boolean(process.env.FIRECRAWL_API_KEY);
}

function sourceContext(input: PlanInput, scraped: string | null): string {
  const parts: string[] = [];
  if (input.companyContext) parts.push(`COMPANY CONTEXT:\n${input.companyContext}`);
  if (scraped) parts.push(`SCRAPED PAGE CONTENT (markdown):\n${scraped}`);
  else if (input.sourceText) parts.push(`PASTED SOURCE MATERIAL:\n${input.sourceText}`);
  if (input.sourceUrl) parts.push(`SOURCE URL: ${input.sourceUrl}`);
  return parts.join("\n\n") || "No source material provided.";
}

function briefBlock(input: PlanInput): string {
  return [
    `CAMPAIGN GOAL: ${input.campaignGoal}`,
    `TARGET AUDIENCE: ${input.audience}`,
    `BRAND VOICE: ${input.brandVoice}`,
    `CHANNELS: ${input.channels.join(", ")}`,
    `CADENCE / TIME HORIZON: ${input.cadence}`,
  ].join("\n");
}

export async function* runFlow(input: PlanInput): AsyncGenerator<FlowEvent> {
  yield { type: "meta", mode: "live", model: MODEL_ID };

  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const model = openai(MODEL_ID);

  // ---- Stage 1: ingest ----
  yield { type: "stage", stage: "ingest", status: "running" };

  let scraped: { markdown: string; title: string } | null = null;
  if (input.sourceUrl) {
    scraped = await scrapeUrl(input.sourceUrl);
    // A URL with no scrape AND no other source material can't be ingested.
    const hasOtherSource =
      input.sourceText.trim().length > 0 || input.companyContext.trim().length > 0;
    if (!scraped && !hasOtherSource) {
      throw new Error(
        hasFirecrawlKey()
          ? `Couldn't scrape ${input.sourceUrl}. Check the URL, or paste source text instead.`
          : "Scraping a URL requires FIRECRAWL_API_KEY. Add the key, or paste source text / company context instead.",
      );
    }
  }

  const ingest = await generateObject({
    model,
    schema: SourceDigestSchema,
    system:
      "You are a research analyst. Read the supplied material and produce a tight, factual digest. Do not invent facts that are not supported by the material or brief.",
    prompt: `Digest the source material for a content-planning workflow.\n\n${sourceContext(
      input,
      scraped?.markdown ?? null,
    )}\n\nSet sourceType to "url" if a URL was scraped, "pasted" if pasted text was used, otherwise "context-only".`,
  });
  const source: SourceDigest = ingest.object;
  yield {
    type: "stage",
    stage: "ingest",
    status: "done",
    note: scraped
      ? `Scraped ${input.sourceUrl}`
      : input.sourceUrl
        ? "URL not scraped — used provided context"
        : `Source type: ${source.sourceType}`,
  };

  // ---- Stage 2: themes + strategy ----
  yield { type: "stage", stage: "themes", status: "running" };
  const themesOut = await generateObject({
    model,
    schema: z.object({
      strategy: StrategySchema,
      themes: z.array(ThemeSchema).min(3).max(6),
    }),
    system:
      "You are a content strategist. Extract the recurring themes worth building content around, and a short overall strategy. Ground everything in the brief and source digest.",
    prompt: `BRIEF:\n${briefBlock(input)}\n\nSOURCE DIGEST:\n${JSON.stringify(
      source,
    )}\n\nProduce a strategy (overview + positioning) and 3–5 content themes. Use kebab-case ids.`,
  });
  yield {
    type: "stage",
    stage: "themes",
    status: "done",
    note: `${themesOut.object.themes.length} themes`,
  };

  // ---- Stage 3: pillars ----
  yield { type: "stage", stage: "pillars", status: "running" };
  const pillarsOut = await generateObject({
    model,
    schema: z.object({ pillars: z.array(PillarSchema).min(2).max(4) }),
    system:
      "You are a content strategist. Group the themes into 2–4 durable content pillars, each with a clear rationale tied to the campaign goal.",
    prompt: `BRIEF:\n${briefBlock(input)}\n\nTHEMES:\n${JSON.stringify(
      themesOut.object.themes,
    )}\n\nProduce content pillars. Use kebab-case ids.`,
  });
  yield {
    type: "stage",
    stage: "pillars",
    status: "done",
    note: `${pillarsOut.object.pillars.length} pillars`,
  };

  // ---- Stage 4: draft posts ----
  yield { type: "stage", stage: "draft", status: "running" };
  const postsPerChannel = input.cadence.includes("quarter")
    ? 3
    : input.cadence.includes("month")
      ? 2
      : 1;
  const postsOut = await generateObject({
    model,
    schema: z.object({ posts: z.array(PostSchema).min(1) }),
    system:
      "You are a senior copywriter. Write channel-appropriate draft posts in the brand voice. Each post needs draft copy, a one-line CTA, the reasoning for why it fits, hashtags (only where the channel uses them), and a suggested publishing slot. Never fabricate metrics or quotes.",
    prompt: `BRIEF:\n${briefBlock(input)}\n\nPILLARS:\n${JSON.stringify(
      pillarsOut.object.pillars,
    )}\n\nSOURCE DIGEST:\n${JSON.stringify(
      source,
    )}\n\nWrite about ${postsPerChannel} post(s) per channel for: ${input.channels.join(
      ", ",
    )}. Distribute across the pillars. suggestedSlot should be a human-friendly relative date within the ${input.cadence} window. Use kebab-case ids.`,
  });
  yield {
    type: "stage",
    stage: "draft",
    status: "done",
    note: `${postsOut.object.posts.length} drafts`,
  };

  // ---- Stage 5: review (assembly, no AI) ----
  yield { type: "stage", stage: "review", status: "running" };
  await delay(200);
  const plan: ContentPlan = {
    meta: { mode: "live", model: MODEL_ID, generatedAt: new Date().toISOString() },
    input,
    source,
    strategy: themesOut.object.strategy,
    themes: themesOut.object.themes,
    pillars: pillarsOut.object.pillars,
    posts: postsOut.object.posts,
  };
  yield { type: "stage", stage: "review", status: "done", note: "Ready for human review" };
  yield { type: "plan", plan };
}
