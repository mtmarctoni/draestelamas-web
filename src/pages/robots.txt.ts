import type { APIRoute } from "astro";

export const prerender = true;

/**
 * Generated at build time. Staging / preview builds are not indexable
 * (`PUBLIC_ALLOW_INDEXING` unset or "false" → Disallow: /) so indexers
 * skip them entirely. Only production and the Lighthouse CI build
 * (which sets `PUBLIC_ALLOW_INDEXING=true`) emit `Allow: /` with a
 * sitemap reference.
 */
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("`site` must be set in astro.config.mjs — robots.txt depends on it.");
  const indexable = import.meta.env.PUBLIC_ALLOW_INDEXING === "true";
  if (!indexable) {
    const body = `User-agent: *\nDisallow: /\n`;
    return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  const sitemap = new URL("/sitemap.xml", site).href;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
