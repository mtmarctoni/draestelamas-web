import { describe, expect, it } from "vitest";
import ca from "../src/i18n/content/ca";
import es from "../src/i18n/content/es";
import en from "../src/i18n/content/en";
import type { TranslationContent } from "../src/i18n/types";

/** Replace every leaf with its type name so structures can be compared across locales. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, shape(v)])
    );
  }
  return typeof value;
}

const all: [string, TranslationContent][] = [
  ["ca", ca],
  ["es", es],
  ["en", en],
];

describe("dictionary parity", () => {
  it("es and en mirror the structure of ca exactly", () => {
    expect(shape(es)).toEqual(shape(ca));
    expect(shape(en)).toEqual(shape(ca));
  });

  it.each(all)("%s has the exact source-site item counts", (_name, t) => {
    expect(t.about.tags).toHaveLength(4);
    expect(t.about.bioHtml).toHaveLength(5);
    expect(t.about.training).toHaveLength(9);
    expect(t.about.societies).toHaveLength(6);
    expect(t.digital.areas).toHaveLength(6);
    expect(t.gallery.artworks).toHaveLength(5);
    expect(t.collaborations.areas).toHaveLength(5);
    expect(t.collaborations.entities).toHaveLength(5);
    expect(t.privacy.sections).toHaveLength(8);
    expect(t.legal.sections).toHaveLength(6);
  });

  it("artwork ids are aligned across locales", () => {
    const ids = ca.gallery.artworks.map((a) => a.id);
    expect(es.gallery.artworks.map((a) => a.id)).toEqual(ids);
    expect(en.gallery.artworks.map((a) => a.id)).toEqual(ids);
  });

  it("privacy policy references Resend, not Formspree", () => {
    for (const [, t] of all) {
      const text = JSON.stringify(t.privacy.sections);
      expect(text).toContain("Resend");
      expect(text).not.toContain("Formspree");
    }
  });
});
