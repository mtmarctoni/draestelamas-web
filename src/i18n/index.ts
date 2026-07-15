import ca from "./content/ca";
import en from "./content/en";
import es from "./content/es";
import type { Locale, TranslationContent } from "./types";

const dictionaries: Record<Locale, TranslationContent> = { ca, es, en };

export function getTranslations(locale: Locale): TranslationContent {
  return dictionaries[locale];
}

export * from "./config";
export type * from "./types";
