<p align="center">
  <img src="docs/banner.svg" alt="Flowcraft — AI content planning workflow" width="100%" />
</p>

# Flowcraft

**AI content planning workflow for marketing teams.** Flowcraft turns messy source material, company context, campaign goals, audience notes, brand voice, channels, and cadence into a structured strategy and review-ready draft posts.

The app is built as a staged, human-in-the-loop workflow: ingest context, extract themes, plan pillars, draft posts, and prepare the output for review. It does not auto-publish. Every post is something a person can approve, edit, flag, copy, or export.

## What It Does

1. **Ingests context** from a company/product URL through Firecrawl or from pasted source material.
2. **Extracts themes** worth building a campaign around.
3. **Plans content pillars** with rationale and positioning.
4. **Drafts channel-specific posts** with CTA, hashtags where useful, suggested slot, and rationale.
5. **Keeps review in the loop** through approve/edit/flag states and export controls.

## Business Applications

Flowcraft is a reference pattern for turning source material into review-ready campaign plans. The same workflow can support:

- **Content operations:** convert product notes, customer research, launch docs, and founder context into organized campaign drafts.
- **Agency delivery:** standardize how teams move from client inputs to campaign themes, channel plans, and editable draft assets.
- **Founder-led marketing:** help small teams turn raw ideas into a repeatable publishing plan without losing brand voice.
- **Sales and customer marketing:** transform objection notes, use cases, case-study material, or customer insights into channel-specific content.
- **Editorial QA:** keep a human approval step between generation and publishing so teams can flag, edit, and export only usable posts.

The core transferable idea is staged content generation: separate context ingestion, strategy, drafting, and review so AI output becomes part of an operating workflow instead of a one-off prompt result.

## Why It Matters

Most AI content tools jump straight from prompt to copy. Flowcraft treats content planning as an operating workflow: context first, structure second, generation third, review always. That makes the output easier to inspect, adapt, and hand off than a pile of disconnected drafts.

## Architecture

| Layer | Implementation |
| --- | --- |
| App | Next.js App Router, React, TypeScript |
| AI orchestration | Staged async generator in `src/lib/flow.ts` |
| Streaming | NDJSON events from `src/app/api/plan/route.ts` |
| Generation | OpenAI through the Vercel AI SDK |
| Structured output | Zod schemas in `src/lib/types.ts` |
| URL ingestion | Optional Firecrawl helper in `src/lib/firecrawl.ts` |
| Review surface | Editable post cards, status controls, copy/export actions |

The API route streams stage events as the workflow runs, so the UI can show progress without waiting for the whole plan to complete.

## Transferable Implementation Patterns

- **Staged async workflow:** `src/lib/flow.ts` breaks planning into narrow steps with structured handoffs.
- **Source-aware generation:** URL ingestion and pasted source material give the model context before it writes.
- **Schema-checked outputs:** Zod schemas define the plan structure so the UI receives predictable objects instead of loose text.
- **Review-first UX:** editable post cards, approval states, flags, copy controls, and exports make human review part of the product.
- **Streaming progress model:** NDJSON stage events make long-running AI work understandable and easier to debug.

## Run Locally

Requires Node 20+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>, click **Open the planner**, load a sample brief, and generate a plan.

Generation requires `OPENAI_API_KEY`. Without it, the app returns a clear error instead of falling back to fake output.

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes | Live AI generation |
| `OPENAI_MODEL` | No | Override the default model |
| `FIRECRAWL_API_KEY` | No | Scrape a URL during ingestion |

## Deploy

Flowcraft is Vercel-ready.

```bash
npm run build
npx vercel
```

Set `OPENAI_API_KEY` in Vercel project environment variables. Add `FIRECRAWL_API_KEY` if you want URL scraping enabled.

## Project Structure

```text
src/
  app/
    page.tsx              Homepage
    plan/page.tsx         Planner workspace
    api/plan/route.ts     Streaming workflow endpoint
  components/             Brief form, timeline, results, post cards
  lib/
    flow.ts               Staged AI workflow
    types.ts              Zod schemas and shared types
    firecrawl.ts          Optional URL ingestion
    samples.ts            Example briefs
```

## Engineering Notes

- **Staged generation beats one-shot prompting.** Each step has a narrow job and hands structured output to the next step.
- **Schema validation keeps the UI stable.** The app renders typed plan objects rather than free-form model text.
- **Streaming makes slow work legible.** The user can see research, themes, pillars, drafting, and review preparation as separate events.
- **Human review is part of the product.** Approval, editing, and export are first-class actions rather than afterthoughts.

## Known Limits

- Plans live in browser state; there is no persistence.
- There is no auth or multi-tenant workspace layer.
- URL ingestion is single-page, not a full crawl.
- Publishing integrations are intentionally left out; the app produces review-ready output, not automatic distribution.
