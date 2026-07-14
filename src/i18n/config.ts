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

const legalPaths: Record<Locale, string> = {
  ca: "/avis-legal",
  es: "/aviso-legal",
  en: "/legal-notice",
};

const privacyPaths: Record<Locale, string> = {
  ca: "/politica-privacitat",
  es: "/politica-privacidad",
  en: "/privacy-policy",
};

export function legalPath(locale: Locale): string {
  return localizePath(legalPaths[locale], locale);
}

export function privacyPath(locale: Locale): string {
  return localizePath(privacyPaths[locale], locale);
}

const localeSpecificRoutes: Record<Locale, string>[] = [legalPaths, privacyPaths];

export function localizeUrl(pathname: string, targetLocale: Locale): string {
  for (const routeMap of localeSpecificRoutes) {
    for (const loc of locales) {
      const route = localizePath(routeMap[loc], loc);
      if (pathname === route || pathname === route + "/") {
        return localizePath(routeMap[targetLocale], targetLocale);
      }
    }
  }
  return localizePath(stripLocalePrefix(pathname), targetLocale);
}
