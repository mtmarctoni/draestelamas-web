# 01 — Scaffold & Configuration (Tasks 1–4)

> Part of the [Astro Rebuild plan](00-overview.md). Global constraints from `00-overview.md` apply to every task. Work on branch `feat/astro-rebuild`, pnpm only.

---

### Task 1: Repository and project skeleton

**Files:**
- Create: `.nvmrc`, `.gitignore`, `package.json`, `tsconfig.json`, `src/pages/index.astro` (placeholder), `public/.gitkeep`

**Interfaces:**
- Produces: an installable Astro 6 workspace; `pnpm astro check` and `pnpm build` runnable from here on. Placeholder `src/pages/index.astro` is replaced in Task 13.

- [ ] **Step 1: Initialize git on a feature branch**

Run (from the repo root `draestelamas/`, which already contains `docs/plan/`):

```bash
git init -b main
git checkout -b feat/astro-rebuild
```

Expected: `Switched to a new branch 'feat/astro-rebuild'`. All commits in this plan land on this branch; `main` stays empty until the user approves a merge.

- [ ] **Step 2: Write `.nvmrc`**

```
22.12.0
```

- [ ] **Step 3: Write `.gitignore`**

```gitignore
node_modules/
dist/
.astro/
.wrangler/
.dev.vars
.DS_Store
```

- [ ] **Step 4: Write `package.json`**

```json
{
  "name": "draestelamas",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/cloudflare": "^13.0.0",
    "@astrojs/sitemap": "^3.4.0",
    "astro": "^6.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.8.0",
    "vitest": "^3.0.0",
    "wrangler": "^4.0.0"
  }
}
```

> **Compatibility note:** if `pnpm install` reports that a listed range does not resolve (registry moved on), run `pnpm add astro@latest @astrojs/cloudflare@latest @astrojs/sitemap@latest` and `pnpm add -D @astrojs/check@latest tailwindcss@latest @tailwindcss/vite@latest typescript@latest vitest@latest wrangler@latest` instead, then continue. Astro must be >= 6.

- [ ] **Step 5: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*", "tests/**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 6: Write the placeholder page `src/pages/index.astro`**

```astro
---
// Placeholder — replaced in Task 13 by the real Catalan home page.
---
<!doctype html>
<html lang="ca">
  <head><meta charset="utf-8" /><title>draestelamas — scaffold</title></head>
  <body><h1>scaffold ok</h1></body>
</html>
```

- [ ] **Step 7: Install and verify**

```bash
pnpm install
pnpm astro --version
```

Expected: install completes; version prints `astro  v6.x.x` (any 6.x). If it prints 5.x, fix `package.json` and reinstall before continuing.

- [ ] **Step 8: Verify the skeleton builds**

```bash
pnpm build
ls dist/index.html
```

Expected: build succeeds, `dist/index.html` exists.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro 6 workspace with pnpm, strict TS, and plan snapshot"
```

(This first commit also brings `docs/plan/**` including `source-snapshot/` into version control.)

---

### Task 2: Configuration — Astro, Cloudflare, Tailwind theme, env typing

**Files:**
- Create: `astro.config.mjs`, `wrangler.jsonc`, `src/env.d.ts`, `.dev.vars.example`, `src/styles/global.css`

**Interfaces:**
- Consumes: workspace from Task 1.
- Produces: `site`, i18n routing, sitemap, fonts config (CSS variables `--font-cormorant`, `--font-inter`), Tailwind theme tokens (`--color-navy`, `--color-sky`, `--color-burnt`, `--color-amber`, `--color-sand`, `--color-ivory`, `--color-ink`, `--color-muted`, `--font-display`, `--font-body`), shared CSS primitives (`.section-inner`, `.section-label`, `.section-title`, `.btn`, `.btn-primary`, `.btn-online`, `.btn-outline`, `.btn-online-lg`, `.fade-up`, `.l-geminada`), typed `ctx.locals.runtime.env.RESEND_API_KEY`.

- [ ] **Step 1: Write `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.draestelamas.com",
  // output: 'static' is the default. Pages are prerendered; only Actions run on the Worker.
  adapter: cloudflare(),
  i18n: {
    locales: ["ca", "es", "en"],
    defaultLocale: "ca",
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "ca",
        locales: { ca: "ca", es: "es", en: "en" },
      },
    }),
  ],
  fonts: [
    {
      provider: "local",
      name: "Cormorant Garamond",
      cssVariable: "--font-cormorant",
      fallbacks: ["Georgia", "serif"],
      variants: [
        { src: ["./src/assets/fonts/cormorant-garamond-normal-300.woff2"], weight: 300, style: "normal" },
        { src: ["./src/assets/fonts/cormorant-garamond-normal-300.woff2"], weight: 400, style: "normal" },
        { src: ["./src/assets/fonts/cormorant-garamond-normal-300.woff2"], weight: 600, style: "normal" },
        { src: ["./src/assets/fonts/cormorant-garamond-italic-300.woff2"], weight: 300, style: "italic" },
        { src: ["./src/assets/fonts/cormorant-garamond-italic-300.woff2"], weight: 400, style: "italic" },
      ],
    },
    {
      provider: "local",
      name: "Inter",
      cssVariable: "--font-inter",
      fallbacks: ["system-ui", "sans-serif"],
      variants: [
        { src: ["./src/assets/fonts/inter-normal-300.woff2"], weight: 300, style: "normal" },
        { src: ["./src/assets/fonts/inter-normal-300.woff2"], weight: 400, style: "normal" },
        { src: ["./src/assets/fonts/inter-normal-300.woff2"], weight: 500, style: "normal" },
      ],
    },
  ],
  vite: { plugins: [tailwindcss()] },
});
```

> **Weight aliasing is intentional** — the live site ships only the 300-weight files and maps heavier weights onto them (see `docs/plan/source-snapshot/assets/fonts/fonts.css`). Do not "fix" this by hunting for real 400/600 files.
>
> **Compatibility note (Fonts API):** the shape above is the stabilized Astro 6 config. If `astro check`/`astro dev` rejects the `fonts` key: (a) on Astro 5.x move the same array under `experimental: { fonts: [...] }`; (b) if the `variants`/`provider` shape errors, consult `pnpm astro docs` fonts reference; (c) last-resort fallback that always works: delete the `fonts` config, copy the three woff2 files to `public/assets/fonts/`, copy `docs/plan/source-snapshot/assets/fonts/fonts.css` to `public/assets/fonts/fonts.css`, and in `BaseLayout.astro` (Task 10) replace the two `<Font …/>` tags with `<link rel="preload" href="/assets/fonts/cormorant-garamond-normal-300.woff2" as="font" type="font/woff2" crossorigin /><link rel="preload" href="/assets/fonts/inter-normal-300.woff2" as="font" type="font/woff2" crossorigin /><link rel="stylesheet" href="/assets/fonts/fonts.css" />` — and set `--font-display: 'Cormorant Garamond', Georgia, serif; --font-body: 'Inter', system-ui, sans-serif;` in `global.css`.

- [ ] **Step 2: Write `wrangler.jsonc`**

```jsonc
{
  "name": "draestelamas",
  "main": "@astrojs/cloudflare/entrypoints/server",
  "compatibility_date": "2025-05-21",
  "assets": { "directory": "./dist", "binding": "ASSETS" },
  // Names declared here document the env contract. Real values NEVER go in this
  // file: locally they live in .dev.vars (gitignored); in production they are
  // set as Secrets in the Cloudflare dashboard (see 08-deploy.md).
  "vars": {
    "RESEND_API_KEY": "",
    "TURNSTILE_SECRET_KEY": ""
  }
}
```

- [ ] **Step 3: Write `.dev.vars.example`**

```
# Copy to .dev.vars (gitignored) and fill in for local development.
RESEND_API_KEY=
TURNSTILE_SECRET_KEY=
```

- [ ] **Step 4: Write `src/env.d.ts`**

```ts
/// <reference types="astro/client" />

interface CloudflareEnv {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY?: string;
}

type Runtime = import("@astrojs/cloudflare").Runtime<CloudflareEnv>;

declare namespace App {
  interface Locals extends Runtime {}
}
```

- [ ] **Step 5: Write `src/styles/global.css`**

Tailwind v4 CSS-first theme with the exact palette extracted from the live site, plus the shared primitives used by multiple components. Component-specific styles live scoped inside each `.astro` file.

```css
@import "tailwindcss";

@theme {
  --color-navy: #2b4a6a;
  --color-sky: #4a7b9b;
  --color-burnt: #b5622a;
  --color-amber: #d4943a;
  --color-sand: #eae2d4;
  --color-ivory: #f5f2ed;
  --color-ink: #252830;
  --color-muted: #6b7888;

  --font-display: var(--font-cormorant);
  --font-body: var(--font-inter);
}

:root {
  --nav-h: 72px;
  --max-w: 1100px;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background: var(--color-ivory);
  color: var(--color-ink);
  font-size: 16px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

img {
  max-width: 100%;
  display: block;
  height: auto;
}

a {
  color: inherit;
  text-decoration: none;
}

section {
  scroll-margin-top: var(--nav-h);
}

/* ── Shared section primitives ── */
.section-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 5rem 2rem;
}
.section-label {
  font-size: 0.66rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-burnt);
  font-weight: 500;
  margin-bottom: 1rem;
}
.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 3.5vw, 2.8rem);
  font-weight: 300;
  color: var(--color-navy);
  line-height: 1.15;
  margin-bottom: 1.5rem;
}
.section-title em {
  font-style: italic;
  color: var(--color-burnt);
}

/* ── Buttons ── */
.btn {
  display: inline-block;
  padding: 0.75rem 1.8rem;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: 0.25s;
  cursor: pointer;
  border: none;
}
.btn-primary {
  background: var(--color-navy);
  color: #fff;
  border: 2px solid var(--color-navy);
}
.btn-primary:hover {
  background: var(--color-burnt);
  border-color: var(--color-burnt);
}
.btn-online {
  background: var(--color-burnt);
  color: #fff;
  border: 2px solid var(--color-burnt);
}
.btn-online:hover {
  background: var(--color-amber);
  border-color: var(--color-amber);
}
.btn-outline {
  background: transparent;
  color: var(--color-navy);
  border: 2px solid var(--color-navy);
}
.btn-outline:hover {
  background: var(--color-navy);
  color: #fff;
}
.btn-online-lg {
  display: inline-block;
  background: var(--color-burnt);
  color: #fff;
  border: 2px solid var(--color-burnt);
  padding: 0.9rem 2.2rem;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: 0.25s;
}
.btn-online-lg:hover {
  background: var(--color-amber);
  border-color: var(--color-amber);
}

/* ── Entrance animation (driven by IntersectionObserver in main.ts) ── */
.fade-up {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .fade-up {
    opacity: 1;
    transform: none;
  }
}

/* ── Catalan ela geminada typographic correction ── */
.l-geminada {
  display: inline-block;
  transform: translateY(-0.05em);
  padding: 0 0.02em;
}
```

- [ ] **Step 6: Verify config parses**

```bash
pnpm astro check
```

Expected: completes with `0 errors`. (Fonts files do not exist yet — if the fonts config errors on missing files, that is expected until Task 3; in that case re-run this verification at the end of Task 3.)

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: configure Astro 6 (cloudflare, i18n, sitemap, fonts) and Tailwind v4 theme"
```

---

### Task 3: Asset migration from snapshot

**Files:**
- Create: `src/assets/fonts/*.woff2` (3), `src/assets/img/*` (12), `src/assets/uploads/imageprimeraentradaweb.jpg`, `public/favicon.png`, `public/apple-touch-icon.png`, `public/og-image.jpg`

**Interfaces:**
- Consumes: `docs/plan/source-snapshot/`.
- Produces: import paths used by later tasks — `../assets/img/logo.png`, `hero-obra.png`, `sobre-retrat.jpg`, `galeria-01.jpg`…`galeria-05.jpg`, `obra-01.jpg`…`obra-05.jpg`, `../assets/uploads/imageprimeraentradaweb.jpg`; public URLs `/favicon.png`, `/apple-touch-icon.png`, `/og-image.jpg`.

- [ ] **Step 1: Copy assets into place**

```bash
mkdir -p src/assets/fonts src/assets/img src/assets/uploads
cp docs/plan/source-snapshot/assets/fonts/*.woff2 src/assets/fonts/
cp docs/plan/source-snapshot/assets/img/logo.png \
   docs/plan/source-snapshot/assets/img/hero-obra.png \
   docs/plan/source-snapshot/assets/img/sobre-retrat.jpg \
   docs/plan/source-snapshot/assets/img/galeria-0*.jpg \
   docs/plan/source-snapshot/assets/img/obra-0*.jpg \
   src/assets/img/
cp docs/plan/source-snapshot/assets/uploads/imageprimeraentradaweb.jpg src/assets/uploads/
cp docs/plan/source-snapshot/assets/img/logo-gris.png public/favicon.png
cp docs/plan/source-snapshot/assets/img/logo.png public/apple-touch-icon.png
cp docs/plan/source-snapshot/assets/img/obra-04.jpg public/og-image.jpg
rm -f public/.gitkeep
```

- [ ] **Step 2: Verify counts**

```bash
ls src/assets/fonts | wc -l   # expect 3
ls src/assets/img | wc -l     # expect 12
ls public                      # expect apple-touch-icon.png favicon.png og-image.jpg
```

- [ ] **Step 3: Verify build with fonts present**

```bash
pnpm astro check && pnpm build
```

Expected: 0 errors; build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: migrate images and self-hosted fonts from source snapshot"
```

---

### Task 4: Test tooling (Vitest)

**Files:**
- Create: `vitest.config.ts`, `tests/smoke.test.ts`

**Interfaces:**
- Produces: `pnpm test` runs all `tests/**/*.test.ts`. Later tasks add `tests/i18n-helpers.test.ts`, `tests/i18n-parity.test.ts`, `tests/contact-schema.test.ts`.

- [ ] **Step 1: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
```

- [ ] **Step 2: Write `tests/smoke.test.ts`**

```ts
import { describe, expect, it } from "vitest";

describe("test tooling", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 3: Run it**

```bash
pnpm test
```

Expected: `1 passed`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "test: add vitest tooling with smoke test"
```
