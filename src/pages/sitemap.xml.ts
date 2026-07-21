import type { APIRoute } from "astro";
import type { Locale } from "../i18n";
import {
  defaultLocale,
  legalPath,
  localeHreflang,
  locales,
  localizeUrl,
  privacyPath,
} from "../i18n";
import { blogPostPath, getBlogPosts } from "../lib/blog";

export const GET: APIRoute = async ({ site }) => {
  if (!site) return new Response("Site not configured", { status: 500 });
  const base = site.href.replace(/\/$/, "");

  // Non-production builds render noindex/nofollow (see SEO.astro), so their
  // pages must never be advertised for crawling/indexing via the sitemap
  // either — an empty urlset keeps the route valid without listing URLs.
  const indexable = import.meta.env.PUBLIC_ALLOW_INDEXING === "true";
  if (!indexable) {
    const empty = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
</urlset>`;
    return new Response(empty, {
      headers: { "Content-Type": "application/xml" },
    });
  }

  // Each group renders one <url> (canonical = default locale, which is first
  // in `locales`) with hreflang alternates for every locale.
  const groupFor = (pathFor: (locale: Locale) => string) =>
    locales.map((locale) => ({ locale, path: pathFor(locale) }));

  const posts = await getBlogPosts(defaultLocale);
  const pageGroups = [
    groupFor((locale) => localizeUrl("/", locale)),
    ...posts.map((post) => groupFor((locale) => blogPostPath(post, locale))),
    groupFor((locale) => `${legalPath(locale)}/`),
    groupFor((locale) => `${privacyPath(locale)}/`),
  ];

  const urlEntries = pageGroups
    .map((group) => {
      const canonical = `${base}${group[0].path}`;

      const alternates = group
        .map(
          ({ locale, path }) =>
            `    <xhtml:link rel="alternate" hreflang="${localeHreflang[locale]}" href="${base}${path}"/>`,
        )
        .join("\n");

      const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${canonical}"/>`;

      return `  <url>
    <loc>${canonical}</loc>
${alternates}
${xDefault}
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
