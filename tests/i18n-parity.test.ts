import { describe, expect, it } from "vitest";
import ca from "../src/i18n/content/ca";
import es from "../src/i18n/content/es";
import en from "../src/i18n/content/en";

function getKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      keys.push(...getKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

describe("i18n dictionary parity", () => {
  it("ca, es, and en have identical key structures", () => {
    const caKeys = getKeys(ca as Record<string, unknown>);
    const esKeys = getKeys(es as Record<string, unknown>);
    const enKeys = getKeys(en as Record<string, unknown>);

    expect(esKeys).toEqual(caKeys);
    expect(enKeys).toEqual(caKeys);
  });
});
