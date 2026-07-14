import type { Locale, TranslationContent } from "./types";
import ca from "./content/ca";
import es from "./content/es";
import en from "./content/en";

const dictionaries: Record<Locale, TranslationContent> = { ca, es, en };

export function getTranslations(locale: Locale): TranslationContent {
  return dictionaries[locale];
}

export * from "./config";
export type * from "./types";
