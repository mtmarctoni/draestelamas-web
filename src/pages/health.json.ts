import type { APIRoute } from "astro";

/**
 * Build-stamped health payload. `commit`/`builtAt` are injected at build time
 * via PUBLIC_GIT_SHA / PUBLIC_BUILD_TIME and fall back to "dev" locally, so a
 * post-deploy check can confirm the deployed commit actually propagated.
 *
 * NOT prerendered — served at runtime so Cache-Control: no-store prevents
 * Cloudflare edge from caching stale health data across deploys.
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
    headers: { "Cache-Control": "no-store" },
  });
