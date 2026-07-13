import type { Locale } from "./types";

export const locales: Locale[] = ["ca", "es", "en"];
export const defaultLocale: Locale = "ca";

/** hreflang values — plain language codes, matching the live site. */
export const localeHreflang: Record<Locale, string> = { ca: "ca", es: "es", en: "en" };

export const ogLocale: Record<Locale, string> = { ca: "ca_ES", es: "es_ES", en: "en_GB" };

/** BCP 47 tags for date formatting (blog post dates). */
export const dateLocale: Record<Locale, string> = { ca: "ca-ES", es: "es-ES", en: "en-GB" };

/** Identical across locales; used by About and Footer. */
export const socialLinks = {
  linkedin: { href: "https://www.linkedin.com/in/estelamasrodenas/", label: "LinkedIn" },
  twitter: { href: "https://twitter.com/EstelaNefro", label: "@EstelaNefro" },
} as const;

/** "/es/blog/x/" -> "/blog/x/"; "/en/" -> "/"; "/blog/x/" -> "/blog/x/" */
export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/(es|en)(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}

/** localizePath("/blog/x/", "en") -> "/en/blog/x/"; default locale stays unprefixed. */
export function localizePath(basePath: string, locale: Locale): string {
  if (locale === defaultLocale) return basePath;
  return basePath === "/" ? `/${locale}/` : `/${locale}${basePath}`;
}

export function homePath(locale: Locale): string {
  return localizePath("/", locale);
}
