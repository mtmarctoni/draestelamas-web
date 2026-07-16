import { describe, expect, it } from "vitest";
import { buildHealth, prerender } from "../src/pages/api/health";

describe("health endpoint", () => {
  it("reports status ok", () => {
    expect(buildHealth().status).toBe("ok");
  });

  it("falls back to dev when build env is unset", () => {
    const health = buildHealth();
    expect(health.commit).toBe("dev");
    expect(health.builtAt).toBe("dev");
  });

  it("is served at runtime, never prerendered", () => {
    // Regression guard: in `static` output a route is prerendered unless it
    // explicitly exports `prerender = false`. A prerendered health file gets
    // edge-cached and serves stale commit SHAs after deploys.
    expect(prerender).toBe(false);
  });
});
