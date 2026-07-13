# 07 — Security Headers & Full Build Audit (Task 25)

> Part of the [Astro Rebuild plan](00-overview.md). Locks in the security posture (CSP with Astro Actions + Turnstile allowances) and runs the whole-site acceptance audit that gates the deployment file.

---

### Task 25: robots.txt, `_headers`, and the release audit

**Files:**
- Create: `public/robots.txt`, `public/_headers`

**Interfaces:**
- Consumes: everything built in Tasks 1–24.
- Produces: security headers served by Cloudflare for every route; the audit checklist that `08-deploy.md` assumes has passed.

- [ ] **Step 1: Write `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://www.draestelamas.com/sitemap-index.xml
```

- [ ] **Step 2: Write `public/_headers`**

```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.resend.com https://challenges.cloudflare.com; form-action 'self'; frame-src https://challenges.cloudflare.com; base-uri 'self'; object-src 'none'
  X-XSS-Protection: 1; mode=block

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

Notes (do not remove these allowances):
- `script-src 'self'` works because every executable script is bundled by Astro into same-origin files; the JSON-LD block is a non-executable data block.
- `https://challenges.cloudflare.com` in `script-src`/`frame-src`/`connect-src` keeps the Turnstile hooks (Layer 3) enableable without a CSP change.
- `form-action 'self'` is required for Astro Actions.
- `style-src 'unsafe-inline'` covers Astro's inlined stylesheets and the few `style=""` attributes (stagger delays).

- [ ] **Step 3: Full release audit**

Run each block; every expectation must hold before moving to `08-deploy.md`.

```bash
pnpm astro check && pnpm test && pnpm build
```

Expected: 0 type errors; all Vitest suites pass; build completes.

```bash
# Every page: exactly 4 hreflang links and a lang attribute matching its locale.
for f in dist/index.html dist/es/index.html dist/en/index.html \
         dist/blog/salud-renal-prevencion-enfermedad-renal/index.html \
         dist/es/blog/salud-renal-prevencion-enfermedad-renal/index.html \
         dist/en/blog/salud-renal-prevencion-enfermedad-renal/index.html; do
  printf '%s hreflang=%s lang=%s\n' "$f" "$(grep -o hreflang "$f" | wc -l | tr -d ' ')" "$(grep -o '<html lang="[a-z]*"' "$f")"
done
```

Expected: `hreflang=4` on all six pages; `lang="ca"` on root pages, `lang="es"` under `/es/`, `lang="en"` under `/en/`.

```bash
# No third-party runtime scripts; no leftover Formspree; sessionStorage gone.
grep -rE '<script[^>]+src="http' dist/ | wc -l        # expect 0
grep -ri formspree dist/ | wc -l                      # expect 0
grep -ri sessionstorage dist/ | wc -l                 # expect 0
grep -ri "marked.min.js" dist/ | wc -l                # expect 0
```

```bash
# Deployment artifacts all present.
ls dist/_headers dist/robots.txt dist/sitemap-index.xml dist/favicon.png dist/og-image.jpg
ls -d dist/_worker.js*                                 # server bundle for the contact action
```

```bash
# Optimized images actually emitted (hero, gallery, portrait, blog).
ls dist/_astro/ | grep -ci 'webp\|avif'
```

Expected: a non-zero count of optimized image files.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add robots.txt and security headers with actions-compatible CSP"
```
