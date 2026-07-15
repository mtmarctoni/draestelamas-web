import { describe, expect, it } from "vitest";
import { buildHealth } from "../src/pages/health.json";

describe("buildHealth", () => {
  it("reports status ok", () => {
    expect(buildHealth().status).toBe("ok");
  });

  it("falls back to dev when build env is unset", () => {
    const health = buildHealth();
    expect(health.commit).toBe("dev");
    expect(health.builtAt).toBe("dev");
  });
});
