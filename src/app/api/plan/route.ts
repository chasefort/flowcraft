import { NextRequest } from "next/server";
import { PlanInputSchema, type FlowEvent } from "@/lib/types";
import { runFlow, hasLiveKey } from "@/lib/flow";

// Live LLM calls can take a while; allow up to 60s on Vercel.
export const maxDuration = 60;
export const runtime = "nodejs";

/**
 * Streams the content-planning flow as newline-delimited JSON (NDJSON).
 * Each line is a FlowEvent the client renders in the workflow view.
 */
export async function POST(req: NextRequest) {
  if (!hasLiveKey()) {
    return new Response(
      JSON.stringify({
        error:
          "AI generation is not configured. Set OPENAI_API_KEY (and restart) to run the workflow.",
      }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }

  let parsed;
  try {
    const body = await req.json();
    parsed = PlanInputSchema.safeParse(body);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Invalid input", issues: parsed.error.issues }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const input = parsed.data;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: FlowEvent) =>
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      try {
        for await (const event of runFlow(input)) {
          send(event);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Flow failed";
        send({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-cache, no-transform",
    },
  });
}
