import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The route pulls in src/lib/blog.ts, which imports the astro:content virtual
// module — unavailable outside an Astro-powered Vite pipeline. We return one
// deterministic post so the blog `<lastmod>` path is exercised; the mock
// ignores the collection filter, which is fine for a single default-locale post.
vi.mock("astro:content", () => ({
  getCollection: async () => [
    { id: "ca/test-post", data: { date: new Date("2026-01-01T00:00:00.000Z") } },
  ],
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

  it("never lists legal or privacy pages (they are noindex)", async () => {
    vi.stubEnv("PUBLIC_ALLOW_INDEXING", "true");

    const res = await getSitemapResponse();
    const body = await res.text();

    for (const slug of [
      "avis-legal",
      "aviso-legal",
      "legal-notice",
      "politica-privacitat",
      "politica-privacidad",
      "privacy-policy",
    ]) {
      expect(body).not.toContain(slug);
    }
  });

  it("emits lastmod only for dated content, and no priority/changefreq", async () => {
    vi.stubEnv("PUBLIC_ALLOW_INDEXING", "true");

    const res = await getSitemapResponse();
    const body = await res.text();

    // The blog post carries its frontmatter date...
    expect(body).toContain("<lastmod>2026-01-01T00:00:00.000Z</lastmod>");
    // ...and nothing else does — the home page has no honest lastmod signal.
    expect(body.match(/<lastmod>/g)).toHaveLength(1);
    // Google ignores these, so we don't emit them.
    expect(body).not.toContain("<priority>");
    expect(body).not.toContain("<changefreq>");
  });
});
