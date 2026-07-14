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
| `pnpm build` | Build for production |
| `pnpm run deploy` | Build and deploy to Cloudflare |
| `pnpm test` | Run tests |

## License

All rights reserved.
