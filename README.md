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

## License

All rights reserved.
