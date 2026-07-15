/// <reference types="astro/client" />

/** Worker secrets — set via `wrangler secret put` in production, `.dev.vars` locally. */
interface CloudflareEnv {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY?: string;
}

declare module "cloudflare:workers" {
  export const env: CloudflareEnv;
}

type Runtime = import("@astrojs/cloudflare").Runtime;

declare namespace App {
  interface Locals extends Runtime {}
}
