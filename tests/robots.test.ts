import { describe, expect, it } from "vitest";

const SITE = new URL("https://example.com/");

async function getRobotsResponse() {
  const { GET } = await import("../src/pages/robots.txt");
  // biome-ignore lint/suspicious/noExplicitAny: only `site` is used by the handler
  return GET({ site: SITE } as any);
}

describe("robots.txt", () => {
  it("allows crawling but disallows the runtime API routes", async () => {
    const res = await getRobotsResponse();
    const body = await res.text();

    expect(body).toContain("Allow: /");
    expect(body).toContain("Disallow: /api/");
  });

  it("advertises the sitemap", async () => {
    const res = await getRobotsResponse();
    const body = await res.text();

    expect(body).toContain("Sitemap: https://example.com/sitemap.xml");
  });
});
