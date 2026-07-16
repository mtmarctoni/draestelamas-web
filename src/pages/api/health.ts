import type { APIRoute } from "astro";

/**
 * Runtime health endpoint, NOT prerendered — and that must stay explicit:
 * in Astro's default `static` output every route is prerendered unless it
 * exports `prerender = false`, and a prerendered JSON file is served through
 * the Workers Assets edge cache, which can return the previous deploy's body
 * for minutes after `wrangler deploy` (observed: cf-cache-status HIT with a
 * stale commit SHA). Served by the Worker script instead, the response swaps
 * atomically with the deployed version and is never edge-cached.
 */
export const prerender = false;

/**
 * Build-stamped health payload. `commit`/`builtAt` are injected at build time
 * via PUBLIC_GIT_SHA / PUBLIC_BUILD_TIME and fall back to "dev" locally, so a
 * post-deploy check can confirm the deployed commit actually propagated.
 */
export function buildHealth(): { status: "ok"; commit: string; builtAt: string } {
  return {
    status: "ok",
    commit: import.meta.env.PUBLIC_GIT_SHA ?? "dev",
    builtAt: import.meta.env.PUBLIC_BUILD_TIME ?? "dev",
  };
}

export const GET: APIRoute = () =>
  Response.json(buildHealth(), {
    headers: {
      // Worker responses skip `public/_headers` (assets-only), so set what
      // matters here ourselves.
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
