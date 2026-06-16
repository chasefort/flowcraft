/**
 * Optional web ingestion via Firecrawl.
 *
 * If FIRECRAWL_API_KEY is set and a URL is provided, we scrape the page to
 * markdown. Otherwise the caller falls back to pasted text / context only.
 * Failures are swallowed and reported as null so the flow never hard-crashes.
 */
export async function scrapeUrl(
  url: string,
): Promise<{ markdown: string; title: string } | null> {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key || !url) return null;

  const normalized = url.startsWith("http") ? url : `https://${url}`;
  try {
    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        url: normalized,
        formats: ["markdown"],
        onlyMainContent: true,
      }),
      // keep the request from hanging the whole flow
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const markdown: string = json?.data?.markdown ?? "";
    const title: string =
      json?.data?.metadata?.title ?? json?.data?.metadata?.ogTitle ?? normalized;
    if (!markdown) return null;
    return { markdown: markdown.slice(0, 12000), title };
  } catch {
    return null;
  }
}
