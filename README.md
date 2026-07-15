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
| Production | `draestelamas` | `draestelamas.com` | Manual: Actions -> Deploy -> Run workflow |
| Staging | `draestelamas-staging` | `draestelamas.marctonimas.com` | Automatic on merge to `main` |
| Preview | preview version of staging | per-PR `*.workers.dev` URL | Every push to a PR (non-fork) |

Every deploy runs `scripts/smoke.mjs`, which verifies the deployed
`/health.json` commit matches the built commit (propagation check), that all
locales and a blog post return 200, and that security headers are present. A
failed smoke test fails the deploy.

### One-time setup

1. Enable a workers.dev subdomain for the Cloudflare account (dashboard) if not set.
2. Create a Cloudflare API token (Workers Scripts: Edit + Account: Read) and add
   repo secrets:
   ```bash
   gh secret set CLOUDFLARE_API_TOKEN        # paste the token
   gh secret set CLOUDFLARE_ACCOUNT_ID --body aecff6d6a8642c4ba3fc40a1cfbe2bed
   ```
3. Bootstrap the staging Worker once (previews require it to exist), and set the
   Resend secret on both environments (staging may use a separate test key so
   preview form submissions do not affect production email reputation):
   ```bash
   pnpm build
   wrangler deploy --env staging
   wrangler secret put RESEND_API_KEY                 # production
   wrangler secret put RESEND_API_KEY --env staging   # staging/preview
   ```
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
  `https://draestelamas.com/health.json`, alerting by email/webhook.
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
