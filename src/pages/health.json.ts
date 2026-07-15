import type { APIRoute } from "astro";

export const prerender = true;

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

export const GET: APIRoute = () => Response.json(buildHealth());
