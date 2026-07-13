export type Locale = "ca" | "es" | "en";

export const LOCALES: readonly Locale[] = ["ca", "es", "en"] as const;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getLocaleFromPath(path: string): Locale {
  const segment = path.split("/").filter(Boolean)[0];
  if (segment && isLocale(segment)) return segment;
  return "ca";
}

export function getLocalizedPath(locale: Locale, path: string): string {
  if (locale === "ca") return path;
  return `/${locale}${path}`;
}

export type TranslationContent = Record<string, unknown>;

const translations: Partial<Record<Locale, TranslationContent>> = {};

export function registerTranslations(locale: Locale, content: TranslationContent): void {
  translations[locale] = content;
}

export function useTranslations(locale: Locale): TranslationContent {
  if (!translations[locale]) {
    throw new Error(`Translations not registered for locale: ${locale}`);
  }
  return translations[locale];
}
