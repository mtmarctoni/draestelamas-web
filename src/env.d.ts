/// <reference types="astro/client" />

/** Worker secrets — set via `wrangler secret put` in production, `.dev.vars` locally. */
interface CloudflareEnv {
  RESEND_API_KEY: string;
  RESEND_FROM?: string;
  RESEND_TO?: string;
  TURNSTILE_SECRET_KEY?: string;
}

declare module "cloudflare:workers" {
  export const env: CloudflareEnv;
}

interface ImportMetaEnv {
  /** Git SHA of the build, injected in CI; "dev" locally. */
  readonly PUBLIC_GIT_SHA?: string;
  /** ISO build timestamp, injected in CI; "dev" locally. */
  readonly PUBLIC_BUILD_TIME?: string;
}

type Runtime = import("@astrojs/cloudflare").Runtime;

declare namespace App {
  interface Locals extends Runtime {}
}
