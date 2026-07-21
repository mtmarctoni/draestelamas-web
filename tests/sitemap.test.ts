import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The route pulls in src/lib/blog.ts, which imports the astro:content virtual
// module — unavailable outside an Astro-powered Vite pipeline. Blog content
// itself is irrelevant to the indexing-gate behavior under test.
vi.mock("astro:content", () => ({
  getCollection: async () => [],
}));

const SITE = new URL("https://example.com/");

async function getSitemapResponse() {
  const { GET } = await import("../src/pages/sitemap.xml");
  // biome-ignore lint/suspicious/noExplicitAny: only `site` is used by the handler
  return GET({ site: SITE } as any);
}

describe("sitemap.xml", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("lists canonical URLs when indexing is allowed (production)", async () => {
    vi.stubEnv("PUBLIC_ALLOW_INDEXING", "true");

    const res = await getSitemapResponse();
    const body = await res.text();

    expect(body).toContain("<loc>https://example.com/</loc>");
  });

  it("omits every URL when indexing is disallowed (staging/preview)", async () => {
    vi.stubEnv("PUBLIC_ALLOW_INDEXING", "false");

    const res = await getSitemapResponse();
    const body = await res.text();

    expect(body).not.toContain("<url>");
    expect(body).not.toContain("<loc>");
    expect(res.headers.get("Content-Type")).toBe("application/xml");
  });

  it("omits every URL when the flag is unset", async () => {
    vi.stubEnv("PUBLIC_ALLOW_INDEXING", undefined);

    const res = await getSitemapResponse();
    const body = await res.text();

    expect(body).not.toContain("<url>");
  });
});
