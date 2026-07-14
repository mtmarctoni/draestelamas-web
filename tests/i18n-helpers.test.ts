import { describe, expect, it } from "vitest";
import { homePath, localizePath, stripLocalePrefix } from "../src/i18n/config";

describe("stripLocalePrefix", () => {
  it("returns / for the root of every locale", () => {
    expect(stripLocalePrefix("/")).toBe("/");
    expect(stripLocalePrefix("/es/")).toBe("/");
    expect(stripLocalePrefix("/en/")).toBe("/");
    expect(stripLocalePrefix("/es")).toBe("/");
  });

  it("strips the locale prefix from nested paths", () => {
    expect(stripLocalePrefix("/blog/salud-renal/")).toBe("/blog/salud-renal/");
    expect(stripLocalePrefix("/es/blog/salud-renal/")).toBe("/blog/salud-renal/");
    expect(stripLocalePrefix("/en/blog/salud-renal/")).toBe("/blog/salud-renal/");
  });

  it("does not strip lookalike segments", () => {
    expect(stripLocalePrefix("/essay/")).toBe("/essay/");
    expect(stripLocalePrefix("/enrol/")).toBe("/enrol/");
  });
});

describe("localizePath", () => {
  it("keeps the default locale unprefixed", () => {
    expect(localizePath("/", "ca")).toBe("/");
    expect(localizePath("/blog/salud-renal/", "ca")).toBe("/blog/salud-renal/");
  });

  it("prefixes non-default locales", () => {
    expect(localizePath("/", "es")).toBe("/es/");
    expect(localizePath("/", "en")).toBe("/en/");
    expect(localizePath("/blog/salud-renal/", "en")).toBe("/en/blog/salud-renal/");
  });
});

describe("homePath", () => {
  it("maps locales to home URLs", () => {
    expect(homePath("ca")).toBe("/");
    expect(homePath("es")).toBe("/es/");
    expect(homePath("en")).toBe("/en/");
  });
});
