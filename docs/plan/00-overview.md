# Dra. Estela Mas — Astro Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Execute plan files in numeric order: `01` → `08`. Tasks are numbered continuously (Task 1 … Task 26) across files.

**Goal:** Rebuild https://www.draestelamas.com/ as a trilingual (CA/ES/EN) Astro 6 static site deployed on Cloudflare, replacing client-side JS language switching with URL-based i18n routing (`/`, `/es/`, `/en/`) and Formspree with a Resend-backed Astro Action.

**Architecture:** Every page is prerendered (100% static HTML). The single dynamic capability — the contact form — POSTs to an Astro Action (server code running on a Cloudflare Worker) from a small client script, so no page ever needs `prerender = false`. Content lives in typed per-locale TypeScript dictionaries (`src/i18n/content/{ca,es,en}.ts`); blog posts live in a Markdown content collection rendered at build time. All copy was extracted verbatim from the live site on 2026-07-13 and is embedded in this plan and in `docs/plan/source-snapshot/`.

**Tech Stack:** Astro 6 (static output + Cloudflare adapter for Actions), `@astrojs/cloudflare` v13+, `@astrojs/sitemap`, Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first `@theme`), Astro Fonts API (local provider), Astro Actions + Zod (`astro/zod`), Resend API, Vitest.

## Global Constraints

Every task's requirements implicitly include this section.

- **Package manager: pnpm only.** Never use npm or yarn. (`pnpm add`, `pnpm run build`, `pnpm dlx` …)
- **Node >= 22.12.0** (`.nvmrc` pins `22.12.0`; Astro 6 requirement).
- **Git:** all work happens on branch `feat/astro-rebuild`. NEVER commit to `main`. NEVER push or merge without explicit user approval. Conventional commit messages (`feat:`, `chore:`, `test:` …).
- **Site URL:** `https://www.draestelamas.com` (must be set as `site` in `astro.config.mjs`).
- **Locales:** `ca` (default, served at root `/`), `es` (`/es/`), `en` (`/en/`). `prefixDefaultLocale: false`. hreflang values are the plain codes `ca` / `es` / `en` (+ `x-default` → root), matching the live site.
- **All routes prerendered.** Never set `export const prerender = false` on any page. The only server code is `src/actions/`.
- **CSP-clean output:** no third-party runtime requests (no CDNs, no Google Fonts), no inline `<script>` except the JSON-LD data block (`is:inline`, non-executable, not affected by `script-src`). Astro `<script>` tags are bundled into external files — never use `is:inline` on executable scripts.
- **Copy is law:** all visible text comes verbatim from the dictionaries in `02-i18n-content.md`. Never rewrite, re-translate, or "fix" it (source typos like ES "El riñón florito" are preserved deliberately — flagged for the client, not for you). Exception already applied in the dictionaries: privacy policy §6 (Formspree → Resend) and §8 (cookies wording) were updated per GDPR requirement.
- **Zod comes from `astro/zod`.** Env vars are read via `ctx.locals.runtime.env` (Cloudflare), never `process.env`.
- **No emojis** anywhere in code, copy, or commits (the `✓` and `◆` glyphs in the source copy are not emojis and stay).
- **TypeScript strict** (`astro/tsconfigs/strict`). `pnpm astro check` must pass with zero errors before every commit.
- **Verify before claiming done:** each task ends with an executable verification step (test run, build grep, or curl) whose expected output is stated. Run it; do not assert success without evidence.

## Key Decisions (deviations from the original brief, with rationale)

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Contact form stays on the main page; pages remain fully static; the form calls the Astro Action via `actions.contact(new FormData(form))` from a client script | Achieves the brief's "recommended" goal (100% static landing pages, max Lighthouse) *without* splitting UX onto a separate `/contact` route. Matches source behavior exactly (the live site already submits via JS `fetch` to Formspree; no-JS submission was never supported). |
| 2 | Blog rebuilt as an Astro content collection with real post pages (`/blog/[slug]/`, `/es/blog/[slug]/`, `/en/blog/[slug]/`) | The live site fetches `/content/blog-posts.json` and renders Markdown client-side with marked.js from jsdelivr — the brief's CSP (`script-src 'self'`) would block that CDN. Build-time rendering is mandatory, and real URLs are strictly better for SEO than the source's modal. |
| 3 | Privacy policy / legal notice remain modals (native `<dialog>`, tiny external script) | Source parity. `<dialog>` gives focus trapping + Escape for free. |
| 4 | `ui.ts` merged into the per-locale dictionaries; one `TranslationContent` object per locale | One typed object per locale is simpler and the TS compiler enforces parity across locales. |
| 5 | `Artwork` model extended to `{ id, title, medium, technique, description }` | The real site has *both* a grid caption medium and a lightbox technique line (they differ for artwork 1: "Acrílic i pastel sobre paper" vs "Acrílic sobre tela") plus a lightbox description. Preserved verbatim. |
| 6 | Fonts: only 3 real woff2 files exist (Cormorant Garamond normal-300, italic-300; Inter normal-300); heavier weights alias to the same files | That is exactly what the live site ships (`fonts.css` maps weights 300–600 to the -300 files). We reproduce it via the Fonts API with multiple variants pointing at the same files. |
| 7 | Form fields: `name` + `email` required; `surname` + `message` optional | Matches the live form (`apellidos` and `mensaje` have no `required` attribute) and the privacy policy's "optionally, a message". |
| 8 | Rich text (bold, line breaks, italics) stored as trusted HTML strings in dictionaries, rendered with `set:html` | Source copy contains `<strong>`, `<br/>`, `<em>`, and the Catalan `l-geminada` span. Content is first-party and static — no injection surface. |
| 9 | Legacy `?lang=es` / `?lang=en` URLs on `/` get a client-side redirect to `/es/` / `/en/` | The old site's hreflang used query params; shared links must keep working. |
| 10 | Success/error feedback rendered inline (`role="status"` / `role="alert"`) instead of `alert()` | Accessibility improvement; visual style matches source `.form-success`. |

## Source Snapshot

`docs/plan/source-snapshot/` was captured from the live site on 2026-07-13 and is the **only** asset source — no task downloads anything from the internet.

| Path | Contents |
|------|----------|
| `site.html` | Full original HTML (reference only) |
| `assets/img/` | `logo.png` (56 KB), `logo-gris.png` (7 KB, favicon), `hero-obra.png` (219 KB), `sobre-retrat.jpg` (56 KB), `galeria-01..05.jpg` (32–129 KB, grid thumbs), `obra-01..05.jpg` (75–603 KB, lightbox full-size; `obra-04.jpg` is also the OG image, 1200x941) |
| `assets/uploads/imageprimeraentradaweb.jpg` | Blog post image (72 KB) |
| `assets/fonts/` | `cormorant-garamond-normal-300.woff2`, `cormorant-garamond-italic-300.woff2`, `inter-normal-300.woff2`, original `fonts.css` |
| `content/blog-posts.json` | Original blog data (reference only) |
| `blog/{ca,es,en}/salud-renal-prevencion-enfermedad-renal.md` | Blog post pre-converted to Markdown with frontmatter — copied into the content collection by Task 17 |

## Design System (extracted from live CSS)

- **Colors:** navy `#2B4A6A`, sky `#4A7B9B`, burnt `#B5622A`, amber `#D4943A`, sand `#EAE2D4`, ivory `#F5F2ED` (page bg), ink `#252830` (text), muted `#6B7888`, white `#FFFFFF`.
- **Fonts:** display = Cormorant Garamond (300/400/600, + italic), body = Inter (300/400/500). Body: 16px, line-height 1.7, antialiased.
- **Layout:** max content width 1100px, fixed nav 72px, sections `padding: 5rem 2rem`, breakpoints 960px / 600px.
- **Signature details:** ECG heartbeat divider under the hero (repeating SVG background, horizontal position driven by scroll), `.fade-up` IntersectionObserver entrance animation (threshold .12, disabled under `prefers-reduced-motion`), organic gradient "blob" behind hero art, Catalan `l-geminada` typographic middle-dot correction.

## Final File Structure

```
draestelamas/
├── .nvmrc  .gitignore  .dev.vars.example  package.json  pnpm-lock.yaml
├── astro.config.mjs  wrangler.jsonc  tsconfig.json  vitest.config.ts
├── docs/plan/                     # this plan + source-snapshot (committed)
├── public/
│   ├── _headers  robots.txt  favicon.png  apple-touch-icon.png  og-image.jpg
├── src/
│   ├── env.d.ts
│   ├── actions/index.ts           # Astro Action (contact)
│   ├── actions/schema.ts          # Zod schema (unit-tested)
│   ├── assets/fonts/*.woff2       # 3 files
│   ├── assets/img/*.{png,jpg}     # logo, hero, portrait, galeria-01..05, obra-01..05
│   ├── assets/uploads/imageprimeraentradaweb.jpg
│   ├── components/
│   │   ├── SEO.astro  Header.astro  LanguageSwitcher.astro  Footer.astro
│   │   ├── HomePage.astro         # assembles all sections (shared by 3 locale pages)
│   │   ├── Hero.astro  EcgDivider.astro  About.astro  Cardiorenal.astro
│   │   ├── DigitalHealth.astro  Gallery.astro  Collaborations.astro
│   │   ├── ContactForm.astro  LegalModals.astro  BlogPostArticle.astro
│   ├── content.config.ts
│   ├── content/blog/{ca,es,en}/salud-renal-prevencion-enfermedad-renal.md
│   ├── i18n/
│   │   ├── types.ts  config.ts  index.ts
│   │   └── content/ca.ts  es.ts  en.ts
│   ├── layouts/BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro  blog/[slug].astro
│   │   ├── es/index.astro  es/blog/[slug].astro
│   │   └── en/index.astro  en/blog/[slug].astro
│   ├── scripts/main.ts            # nav state, fade-up, ECG, ?lang redirect
│   └── styles/global.css          # Tailwind v4 @theme + shared primitives
└── tests/
    ├── i18n-helpers.test.ts  i18n-parity.test.ts  contact-schema.test.ts
```

## Page Anatomy (all three locale home pages, in order)

`Header` (fixed nav + language switcher) → `Hero` (`#inicio`) → `EcgDivider` → `About` (`#sobre`) → `Cardiorenal` blog grid (`#cardiorenal`) → `DigitalHealth` (`#digital`) → `Gallery` + lightbox (`#galeria`) → `Collaborations` (`#colaboracions`) → `ContactForm` (`#contacto`) → `Footer` (+ privacy/legal `<dialog>` modals).

Nav anchors always point at `{localeHome}#section` so they also work from blog post pages.

## Task Index

| File | Tasks |
|------|-------|
| `01-scaffold.md` | 1 Repo + project skeleton · 2 Config files (astro/wrangler/env/tailwind theme) · 3 Assets migration · 4 Test tooling |
| `02-i18n-content.md` | 5 i18n types + helpers (TDD) · 6 Catalan dictionary · 7 Spanish dictionary · 8 English dictionary + parity test |
| `03-shell.md` | 9 SEO component · 10 BaseLayout + global script · 11 Header + LanguageSwitcher · 12 Footer + legal modals · 13 Locale pages + first build verification |
| `04-sections.md` | 14 Hero + ECG divider · 15 About · 16 Digital Health · 17 Gallery + lightbox · 18 Collaborations |
| `05-blog.md` | 19 Content collection + post files · 20 Cardiorenal blog section · 21 Blog post pages |
| `06-contact.md` | 22 Contact schema (TDD) · 23 Contact action · 24 ContactForm component + integration test |
| `07-hardening.md` | 25 robots.txt, `_headers`, full build audit |
| `08-deploy.md` | 26 Cloudflare deployment + operations checklist (manual, requires user) |

## Definition of Done

- `pnpm astro check` → 0 errors, 0 warnings.
- `pnpm test` → all Vitest suites pass.
- `pnpm build` → non-empty `dist/` containing `index.html`, `es/index.html`, `en/index.html`, `blog/salud-renal-prevencion-enfermedad-renal/index.html` (x3 locales), `sitemap-index.xml`, `_worker.js` (actions), `_headers`, `robots.txt`.
- Every `dist/**/index.html` contains exactly 4 hreflang links (`ca`, `es`, `en`, `x-default`) with correct absolute URLs, a matching canonical, and `<html lang>` equal to its locale.
- No `<script src="http` (no third-party scripts) anywhere in `dist/`.
- Contact action verified locally: honeypot-filled POST → 400; valid POST without API key → 500 "Email service not configured".
- Work sits on `feat/astro-rebuild`, one commit per task, nothing pushed/merged without user approval.
