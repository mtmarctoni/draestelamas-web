/// <reference types="astro/client" />

interface CloudflareEnv {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY?: string;
}

type Runtime = import("@astrojs/cloudflare").Runtime<CloudflareEnv>;

declare namespace App {
  interface Locals extends Runtime {}
}
