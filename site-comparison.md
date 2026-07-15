# Old vs New Website Comparison

**Old site:** https://www.draestelamas.com/
**New site:** https://draestelamas.marctonimas.com/

Audit date: July 2026

---

## Scorecard

| Metric | Old Site | New Site | Winner |
|--------|----------|----------|--------|
| **Lighthouse Accessibility (Desktop)** | 89 | 100 | New |
| **Lighthouse Accessibility (Mobile)** | 92 | 100 | New |
| **Lighthouse SEO (Desktop)** | 92 | 100 | New |
| **Lighthouse SEO (Mobile)** | 92 | 100 | New |
| **Lighthouse Best Practices** | 100 | 100 | Tie |
| **LCP (Desktop)** | 320 ms | 216 ms | New |
| **TTFB (Desktop)** | 119 ms | 35 ms | New |
| **CLS** | 0.00 | 0.00 | Tie |
| **Third-party scripts** | 1 (CDN) | 0 | New |
| **Security headers** | 0 | 9 | New |
| **CSP (Content Security Policy)** | No | Yes (dual-layer) | New |
| **Error pages (404/500)** | None | Trilingual | New |
| **Structured data** | Basic Physician | Physician + MedicalProcedure | New |

---

## 1. Performance

### What changed
- **3x faster TTFB** (35ms vs 119ms). The new site is fully prerendered static HTML served from Cloudflare's edge network. The old site requires server-side processing on every request.
- **33% faster LCP** (216ms vs 320ms). Hero image is preloaded, served in WebP with responsive srcset, and rendered with eager loading + fetchpriority="high".
- **Zero third-party JavaScript**. The old site loads `marked.min.js` from jsDelivr CDN on every page load. The new site has no external scripts whatsoever.
- **Optimized images everywhere**. Every image goes through Astro's `<Image>` component: WebP conversion, responsive srcset with multiple sizes, quality optimization, and lazy loading for below-fold content. The old site serves PNGs at full size with no srcset.

### Evidence
```
Network requests (old):  12 resources, includes cdn.jsdelivr.net dependency
Network requests (new):  23 resources, all self-hosted, WebP images
```

---

## 2. Accessibility

### Failing audits on the old site (all fixed in the new one)

| Issue | Old Site | New Site |
|-------|----------|----------|
| **Color contrast** | Failed (nav-logo-sub, lang switcher) | Passed |
| **Heading order** | Failed (jumps from h2 to h4) | Passed (proper h1 > h2 > h3 hierarchy) |
| **Landmark regions** | Failed (no `<main>` element) | Passed (`<main>` wraps all content) |
| **Canonical URL** | Failed (missing on all pages) | Passed (proper canonical on every page) |

### Other accessibility improvements
- All SVG icons have `aria-hidden="true"` (decorative)
- Hamburger menu has `aria-label="Menu"` and `aria-controls`
- Language switcher uses proper `<a>` links with `lang` attribute and `aria-current`
- Form has proper `<label>` elements, `autocomplete` attributes, and `required` markers
- Lightbox uses `<dialog>` element with keyboard navigation and ARIA labels
- `prefers-reduced-motion` respected (animations disabled)

---

## 3. SEO

### URL structure
- **Old:** Query-parameter i18n (`?lang=ca`, `?lang=es`, `?lang=en`). Search engines treat these as separate URLs with duplicate content risk.
- **New:** Path-based i18n (`/`, `/es/`, `/en/`). Clean, crawlable, canonical URLs with proper hreflang annotations.

### Structured data
- **Old:** Basic Physician schema
- **New:** Physician schema + `availableService` (MedicalProcedure for online consultations), plus proper `knowsLanguage`

### Meta tags
- **Old:** `og:title` and `og:description` were long (60+ chars title, 150+ chars description). Social previews get truncated.
- **New:** Titles ~50 chars, descriptions ~125 chars. Optimized for social media display.

### Sitemap
- **Old:** No sitemap
- **New:** Custom `sitemap.xml` with hreflang annotations for all pages (home, blog posts, legal pages per locale)

---

## 4. Security

| Header | Old Site | New Site |
|--------|----------|----------|
| Content-Security-Policy | None | Dual-layer (meta + header), whitelisted sources only |
| Strict-Transport-Security | None | max-age=31536000; includeSubDomains; preload |
| X-Frame-Options | None | DENY |
| X-Content-Type-Options | None | nosniff |
| X-XSS-Protection | None | 1; mode=block |
| Referrer-Policy | None | strict-origin-when-cross-origin |
| Permissions-Policy | None | camera=(), microphone=(), geolocation=() |
| Cross-Origin-Opener-Policy | None | same-origin |
| Cross-Origin-Resource-Policy | None | same-origin |

The old site sends zero security headers. The new site sends 9, including a Content Security Policy that whitelists only the domains the site actually uses.

A `security.txt` file is published at `/.well-known/security.txt` with contact information and supported languages.

---

## 5. Internationalization (i18n)

| Aspect | Old Site | New Site |
|--------|----------|----------|
| Language switching | JavaScript toggles `display:none` on `data-lang` elements | URL-based routing (`/`, `/es/`, `/en/`) |
| Content delivery | All 3 languages in every page HTML (hidden via CSS) | Only the selected language is rendered |
| URL sharing | Sharing a Catalan URL shows English if the visitor's browser prefers English | Each language has its own stable URL |
| Legal pages | Query params (`?lang=ca`) | Locale-specific slugs (`/avis-legal`, `/es/aviso-legal`, `/en/legal-notice`) |
| hreflang | Query-param based (`?lang=ca`) | Path-based (`/`, `/es/`, `/en/`) |

### Why this matters
The old site loads **all three languages** in the HTML and hides/shows them with CSS. This means:
- Every page is 3x heavier than it needs to be
- Search engines see duplicate content across language variants
- Sharing a link doesn't preserve the language context

The new site renders each language independently. A Catalan page only contains Catalan text. A Spanish URL always shows Spanish content.

---

## 6. Caching and CDN

| Aspect | Old Site | New Site |
|--------|----------|----------|
| CDN | Not visible (likely traditional hosting) | Cloudflare Workers (edge network, 300+ locations) |
| Static assets | Standard HTTP caching | Cloudflare edge caching with immutable headers |
| Cache purge | Manual / not available | API-driven purge (instant) |
| Protocol | HTTP/1.1 or HTTP/2 | HTTP/2+ with edge routing |

---

## 7. Developer Experience and Maintainability

| Aspect | Old Site | New Site |
|--------|----------|----------|
| Framework | Vanilla HTML/CSS/JS, single file | Astro 6 (component-based, TypeScript) |
| Content management | Inline HTML with `data-lang` toggles | Typed dictionaries per locale |
| Blog posts | JavaScript-loaded markdown via CDN | Astro Markdown content collection |
| Contact form | Client-side only (no server action) | Astro Actions + Resend email delivery |
| Testing | None | Vitest + Playwright |
| Type safety | None | Strict TypeScript throughout |
| Build process | None (edit HTML directly) | `pnpm build` validates, optimizes, and outputs static files |

---

## 8. User Experience

### Language preservation
- **Old:** Switching language loses context when navigating. The `?lang=` param can be dropped.
- **New:** Language is part of the URL path. Navigating between pages preserves the language. Sharing a link preserves the language.

### Error handling
- **Old:** No 404 or 500 pages. Broken links show a generic server error.
- **New:** Trilingual 404 page with a custom illustration and navigation back to the home page. Trilingual 500 page for server errors.

### Form experience
- **Old:** No visible form validation. No success/error feedback.
- **New:** Client-side validation, honeypot spam protection, success/error states with ARIA live regions, GDPR compliance text.

### Mobile experience
- **Old:** Responsive, but all content loaded (3x weight). No image optimization.
- **New:** Responsive, content-only loaded. Hero image hidden on mobile (saves bandwidth). Portrait image marked as LCP with eager loading.

---

## Summary

The new site is not a reskin. It is a ground-up rebuild with a different architecture:

- **Static by default, dynamic where it matters.** Every page is prerendered HTML. Only the contact form triggers server-side execution.
- **Secure by default.** Nine security headers, CSP, and security.txt out of the box.
- **Accessible by default.** 100/100 Lighthouse accessibility on both desktop and mobile. Proper landmarks, heading hierarchy, color contrast, and ARIA attributes.
- **Fast by default.** 35ms TTFB, 216ms LCP, zero third-party scripts, WebP images with responsive srcset.
- **Multilingual by architecture.** URL-based routing with proper hreflang, not CSS hacks.

The old site was a well-designed single-page application. The new site is a well-engineered multilingual platform.
