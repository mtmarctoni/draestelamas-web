# 08 — Cloudflare Deployment & Operations (Task 26)

> Part of the [Astro Rebuild plan](00-overview.md). This file is **operational**: most steps need dashboard access or credentials only the user has. The agent's job here is to prepare, verify, and hand a checklist to the user — **never push, merge, or deploy without the user's explicit approval.**

---

### Task 26: Deployment preparation and operations checklist

**Interfaces:**
- Consumes: the fully audited build from Task 25.
- Produces: a deployed production site at `https://www.draestelamas.com` (user-driven), with env secrets, bot protection, and search-console registration.

- [ ] **Step 1: Agent — confirm the branch is ready and STOP for approval**

```bash
git log --oneline feat/astro-rebuild | head -30
git status
```

Expected: one commit per task, clean tree. Present the summary to the user and ask how they want to proceed (push + PR, or local handoff). Do not push without a direct "yes".

- [ ] **Step 2: User/agent together — choose the deployment mode**

Two supported modes with `@astrojs/cloudflare` v13+ (Workers static assets):

1. **Git-connected (recommended):** Cloudflare dashboard → Workers & Pages → Create → connect the repository.
   - Build command: `pnpm build`
   - Deploy command: `npx wrangler deploy`
   - Node version: set `NODE_VERSION=22.12.0` (matches `.nvmrc`)
2. **CLI:** `pnpm build && pnpm wrangler deploy` from CI or locally (requires `wrangler login`).

- [ ] **Step 3: User — configure secrets (never commit values)**

- Production: Cloudflare dashboard → the Worker → Settings → Variables and Secrets → add `RESEND_API_KEY` (Secret), and `TURNSTILE_SECRET_KEY` only if Layer 3 gets enabled. Repeat for the Preview environment.
- CLI alternative: `pnpm wrangler secret put RESEND_API_KEY`
- Local dev: copy `.dev.vars.example` to `.dev.vars` and fill in.

- [ ] **Step 4: User — Resend setup (email delivery)**

1. Create/log into Resend, add domain `draestelamas.com`.
2. Add the DNS records Resend requests (SPF + DKIM; DNS is already on Cloudflare).
3. Wait for "Verified", then create an API key with send permission → this is `RESEND_API_KEY`.
4. Sender identity used by the action: `contact@draestelamas.com` → deliveries go to `info@draestelamas.com` with `reply_to` set to the visitor.

- [ ] **Step 5: User — LAYER 2: Bot Fight Mode**

1. Cloudflare dashboard → select the `draestelamas.com` zone.
2. Security → Bots → toggle **Bot Fight Mode** to On (blocks low-reputation crawlers at the edge, before the Worker).
3. Optional (paid): Super Bot Fight Mode — Definitely automated: block · Verified bots: allow · Likely automated: challenge.
4. Review Security analytics weekly for the first month; if form spam still appears, enable Turnstile (Layer 3) per the commented hooks in `src/actions/index.ts` and `src/components/ContactForm.astro`.

- [ ] **Step 6: User — DNS and domain routing**

- Custom domain `www.draestelamas.com` attached to the Worker.
- Apex `draestelamas.com` → 301 redirect to `https://www.draestelamas.com` (Cloudflare Redirect Rule), since `site` and all canonicals use `www`.

- [ ] **Step 7: Post-deploy verification (agent can run once live)**

```bash
# Locale routing + hreflang in production HTML
curl -s https://www.draestelamas.com/ | grep -c hreflang            # expect 4
curl -s https://www.draestelamas.com/es/ | grep -o '<html lang="es"'
curl -s https://www.draestelamas.com/en/ | grep -o '<html lang="en"'

# Security headers actually served
curl -sI https://www.draestelamas.com/ | grep -iE 'strict-transport|content-security-policy|x-frame-options'

# Sitemap reachable
curl -s -o /dev/null -w "%{http_code}\n" https://www.draestelamas.com/sitemap-index.xml   # expect 200

# Honeypot rejected in production (does not send email)
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://www.draestelamas.com/_actions/contact \
  -H "Origin: https://www.draestelamas.com" \
  -F name=Test -F email=test@example.com -F important_field=spam                          # expect 400
```

- [ ] **Step 8: User — real form test in Preview**

Submit the form on a preview deployment with real values; confirm the email arrives at `info@draestelamas.com` with a working Reply-To. Only then announce the production URL.

- [ ] **Step 9: User — search & sharing**

- Google Search Console: add property, submit `https://www.draestelamas.com/sitemap-index.xml`.
- Because URLs changed shape (`?lang=es` → `/es/`), the legacy-URL client redirect in `BaseLayout` covers shared links; no server redirects needed.
- Optionally validate OG rendering (any card debugger) — image is `/og-image.jpg` (1200x941).

## Launch checklist (final gate)

- [ ] Node 22.12 configured in the build environment (matches `.nvmrc`)
- [ ] `pnpm build` produces non-empty `dist/` with `_worker.js*`
- [ ] `RESEND_API_KEY` set in Production and Preview (as Secret)
- [ ] Resend domain verified; test email received end-to-end in Preview
- [ ] Bot Fight Mode ON
- [ ] `_headers` live (CSP includes Turnstile domains; `form-action 'self'`)
- [ ] `robots.txt` references the sitemap; sitemap returns 200
- [ ] hreflang verified on `/`, `/es/`, `/en/` in production
- [ ] Privacy policy shows Resend (not Formspree) in all 3 languages — done in the dictionaries, verify visually via the footer modal
- [ ] Apex → www redirect active
- [ ] Sitemap submitted to Google Search Console
- [ ] `astro check` and `pnpm test` green on the deployed commit
