import type { APIRoute } from "astro";

export const prerender = true;

/**
 * Generated at build time so the sitemap URL follows the environment's
 * `site` (BASE_URL) instead of hardcoding the production domain — staging
 * and previews build with their own BASE_URL.
 */
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("`site` must be set in astro.config.mjs — robots.txt depends on it.");
  const sitemap = new URL("/sitemap.xml", site).href;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
