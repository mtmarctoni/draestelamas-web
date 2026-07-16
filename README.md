# draestelamas-web

Personal website for [Dra. Estela Mas](https://draestelamas.marctonimas.com/), a nephrologist and renal health communicator in Barcelona.

Built in Catalan, Spanish, and English with a single codebase and URL-based language routing.

## What's on the site

- Home page with hero, about section, cardiorenal medicine content, digital health, image gallery, and collaborations
- Blog with a Markdown content collection
- Contact form that sends emails via Resend
- Legal notice and privacy policy (locale-specific slugs per language)
- Trilingual 404 and 500 error pages

## How it was built

**Stack:** Astro 6, TypeScript, Cloudflare Workers, Resend (email)

**Content:** Each language has its own dictionary file. Blog posts live in `src/content/blog/` with one folder per locale.

**Routing:** Catalan is the default (no prefix), Spanish uses `/es/`, English uses `/en/`. Language switching is handled by a shared helper that maps locale-specific slugs.

**Deployment:** Cloudflare Workers via `wrangler deploy`. A single command builds and ships the site to production.

## Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build for production (clears the Vite cache first) |
| `pnpm run deploy` | Build and deploy to Cloudflare |
| `pnpm test` | Run tests |
| `pnpm check` | Typecheck with `astro check` |
| `pnpm lint` | Lint and check formatting (Biome) |
| `pnpm lint:fix` | Apply safe lint/format fixes |
| `pnpm knip` | Find unused files, exports, and dependencies |
| `pnpm depcruise` | Validate module dependency rules |
| `pnpm clean` | Remove the Vite cache and `dist/` |

## Code quality and maintenance

- **Biome** (`biome.json`) — strict linting plus formatting for TS/JS/JSON and `.astro` frontmatter. A pre-commit hook (installed via `simple-git-hooks` on `pnpm install`) runs Biome on staged files.
- **Knip** (`knip.jsonc`) — detects unused files, exports, and dependencies, including imports inside `.astro` files.
- **dependency-cruiser** (`.dependency-cruiser.cjs`) — forbids circular dependencies, orphan modules, imports of test code or devDependencies from `src/`.
- **CI** (`.github/workflows/ci.yml`) — lint, typecheck, tests, Knip, dependency-cruiser, and build on every PR and push to `main`.
- **Lighthouse CI** (`.github/workflows/lighthouse.yml`, `.lighthouserc.json`) — audits the built site on every PR with mobile emulation and fails if accessibility/best-practices/SEO drop below 100 or performance below 95. The live site scores 100 across the board; keep it that way.
- **Dependabot** (`.github/dependabot.yml`) — weekly grouped updates for npm packages and GitHub Actions.

## Deployments

The site deploys to Cloudflare Workers across three environments. All CI/CD runs
on GitHub Actions (free for this public repo).

| Environment | Worker | URL | Trigger |
| --- | --- | --- | --- |
| Production | `draestelamas` | `draestelamas.com` (domain not in Cloudflare yet) | Manual: Actions -> Deploy -> Run workflow |
| Staging | `draestelamas-staging` | `draestelamas.marctonimas.com` | Automatic on merge to `main` |
| Preview | `draestelamas-preview` | `draestelamas-preview.mtmarctoni.workers.dev` | Every push to a PR (non-fork) |

The Astro Cloudflare adapter resolves the Wrangler environment at BUILD time:
CI sets `CLOUDFLARE_ENV=staging|preview` before `pnpm build`, and
`wrangler deploy` then uses the generated config (no `--env` flag at deploy
time). Each build also sets `BASE_URL` to its environment's URL so canonical
URLs, `og:url`, the sitemap and `robots.txt` never point at another
environment's domain.

Every deploy runs `scripts/smoke.mjs`, which verifies the deployed
`/api/health` commit matches the built commit, that all locales and a blog
post return 200, and that security headers are present on pages. A failed
smoke test fails the deploy.

`/api/health` is intentionally a runtime (non-prerendered) endpoint: Worker
script versions swap atomically on deploy, while prerendered files are served
through the Workers Assets edge cache, which can return the previous deploy's
body for a few minutes per location. For the same reason the smoke test only
warns (never fails) when page HTML still shows the previous build's
`build-commit` meta right after a deploy.

### One-time setup

1. Enable a workers.dev subdomain for the Cloudflare account (dashboard) if not set.
2. Create a Cloudflare API token (Workers Scripts: Edit + Account: Read) and add
   repo secrets:
   ```bash
   gh secret set CLOUDFLARE_API_TOKEN        # paste the token
   gh secret set CLOUDFLARE_ACCOUNT_ID --body aecff6d6a8642c4ba3fc40a1cfbe2bed
   ```
3. Add application secrets and variables as GitHub secrets/variables. Every
   deploy propagates them to Cloudflare — no workflow edits needed when adding
   or removing them.
   ```bash
   # Secrets: encrypted, reconciled onto the Worker at runtime via
   # `wrangler secret bulk` (scripts/sync-secrets.sh).
   gh secret set RESEND_API_KEY              # paste the key
   gh secret set RESEND_FROM --body "contact@marctonimas.com"
   gh secret set RESEND_TO   --body "info@marctonimas.com"

   # Variables: non-sensitive.
   #   non-PUBLIC_ -> Worker runtime `var` bindings via `wrangler deploy --var`
   #   PUBLIC_     -> build-time only, baked into the static output (import.meta.env)
   gh variable set SOME_FLAG --body "true"
   ```
   `RESEND_FROM`/`RESEND_TO` are read at runtime (`cloudflare:workers` env), so
   set them as **secrets** or non-`PUBLIC_` **variables** — not `PUBLIC_` ones,
   which never reach the Worker. They fall back to `contact@marctonimas.com` /
   `info@marctonimas.com` if unset. The `from` domain must be verified in Resend.

   Secrets and variables can be set at repo level or per environment
   (`staging`, `production`, `preview`); environment-level values override
   repo-level ones. Excluded everywhere: `CLOUDFLARE_*` (deploy creds) and
   `GITHUB_TOKEN` (GitHub's ephemeral token). Removing a value in GitHub removes
   it from Cloudflare on the next deploy: variables are reconciled by
   `wrangler deploy` (`keep_vars` is false), and secrets by the sync script —
   which has a safety valve that skips deletion if the GitHub side is entirely
   empty while the Worker still has secrets (a withheld context, e.g. a
   Dependabot-triggered run) rather than mass-deleting.
4. Enable free GitHub security features:
   ```bash
   gh api -X PUT repos/mtmarctoni/draestelamas-web/vulnerability-alerts
   gh api -X PUT repos/mtmarctoni/draestelamas-web/automated-security-fixes
   gh api -X PATCH repos/mtmarctoni/draestelamas-web \
     -f 'security_and_analysis[secret_scanning][status]=enabled' \
     -f 'security_and_analysis[secret_scanning_push_protection][status]=enabled'
   ```
5. Recommended: protect `main` to require the `quality` check before merge, so
   staging only ever deploys vetted code.

### Uptime and alerting

- Point a free UptimeRobot monitor (5-minute interval) at
  `https://draestelamas.marctonimas.com/api/health` (move to
  `https://draestelamas.com/api/health` once that domain is live), alerting by
  email/webhook. The endpoint runs on the Worker, so it verifies the Worker is
  actually serving, not just that a CDN cache answers.
- Enable Cloudflare's free SSL/TLS certificate-expiry notification in the dashboard.

There is deliberately no GitHub Actions cron health check: GitHub disables
scheduled workflows after 60 days of repo inactivity, and an external monitor is
the right tool for uptime.

### Rollback

Production deploys are versioned. To roll back:

```bash
wrangler rollback --name draestelamas
```

### Suppressing a vulnerability finding

osv-scanner fails CI on any known advisory. To silence an unfixable or
false-positive low-severity advisory, add an `osv-scanner.toml` ignore entry
with a dated justification comment.

## License

All rights reserved.
