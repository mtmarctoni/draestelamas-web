import type { APIRoute } from "astro";
import { locales, defaultLocale, localizeUrl } from "../i18n";

export const GET: APIRoute = async ({ site }) => {
  if (!site) return new Response("Site not configured", { status: 500 });
  const base = site.href.replace(/\/$/, "");

  // Each page group: one <url> with hreflang alternates for all locales.
  const pageGroups = [
    { all: locales.map((l) => localizeUrl("/", l)) },
    { all: locales.map((l) => localizeUrl("/blog/salud-renal-prevencion-enfermedad-renal/", l)) },
    { all: ["/avis-legal/", "/es/aviso-legal/", "/en/legal-notice/"] },
    { all: ["/politica-privacitat/", "/es/politica-privacidad/", "/en/privacy-policy/"] },
  ];

  // Map URL path -> locale
  const localeForPath = (path: string): string => {
    if (path.startsWith("/es/")) return "es";
    if (path.startsWith("/en/")) return "en";
    return "ca";
  };

  const urlEntries = pageGroups
    .map((group) => {
      const canonical = group.all[0];
      const loc = `${base}${canonical}`;

      const alternates = group.all
        .map((altPath) => {
          const altLocale = localeForPath(altPath);
          return `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${base}${altPath}"/>`;
        })
        .join("\n");

      const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${base}${canonical}"/>`;

      return `  <url>
    <loc>${loc}</loc>
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
