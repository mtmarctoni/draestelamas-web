import type { APIRoute } from "astro";

export const prerender = true;

/**
 * Generated at build time. Crawling is always allowed so search engines
 * can read each page's robots meta tag (`noindex, nofollow` on staging /
 * preview, `index, follow` on production and the Lighthouse CI build).
 * Blocking crawl via `Disallow: /` would prevent Google from seeing the
 * `noindex` meta, leaving already-indexed staging/preview URLs stuck in
 * the index for months. Indexing is controlled by the per-page meta tag,
 * not by robots.txt — robots.txt only controls crawl access.
 */
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("`site` must be set in astro.config.mjs — robots.txt depends on it.");
  const sitemap = new URL("/sitemap.xml", site).href;
  const body = `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${sitemap}\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
