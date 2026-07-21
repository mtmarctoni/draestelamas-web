import { describe, expect, it } from "vitest";
import { robotsDirective } from "../src/lib/seo";

describe("robotsDirective", () => {
  it("blocks indexing entirely on non-indexable environments", () => {
    expect(robotsDirective(false, false)).toBe("noindex, nofollow");
    expect(robotsDirective(false, true)).toBe("noindex, nofollow");
    expect(robotsDirective(false, undefined)).toBe("noindex, nofollow");
  });

  it("indexes normal pages in production", () => {
    expect(robotsDirective(true, false)).toBe("index, follow");
    expect(robotsDirective(true, undefined)).toBe("index, follow");
  });

  it("keeps opted-out pages (legal/privacy/errors) out of the index but crawlable", () => {
    expect(robotsDirective(true, true)).toBe("noindex, follow");
  });
});
