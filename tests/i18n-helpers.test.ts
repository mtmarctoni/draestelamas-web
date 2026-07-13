import { describe, expect, it } from "vitest";
import { isLocale, getLocaleFromPath, getLocalizedPath } from "../src/i18n/types";

describe("isLocale", () => {
  it("accepts valid locales", () => {
    expect(isLocale("ca")).toBe(true);
    expect(isLocale("es")).toBe(true);
    expect(isLocale("en")).toBe(true);
  });
  it("rejects invalid locales", () => {
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
    expect(isLocale("ca/")).toBe(false);
  });
});

describe("getLocaleFromPath", () => {
  it("extracts locale from prefixed path", () => {
    expect(getLocaleFromPath("/es/about")).toBe("es");
    expect(getLocaleFromPath("/en/contact")).toBe("en");
  });
  it("defaults to ca for root path", () => {
    expect(getLocaleFromPath("/")).toBe("ca");
    expect(getLocaleFromPath("/about")).toBe("ca");
  });
});

describe("getLocalizedPath", () => {
  it("returns root path for ca", () => {
    expect(getLocalizedPath("ca", "/about")).toBe("/about");
  });
  it("prefixes other locales", () => {
    expect(getLocalizedPath("es", "/about")).toBe("/es/about");
    expect(getLocalizedPath("en", "/contact")).toBe("/en/contact");
  });
});
