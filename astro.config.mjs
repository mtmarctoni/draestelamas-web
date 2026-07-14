// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: process.env.BASE_URL || "https://draestelamas.marctonimas.com",
  // output: 'static' is the default. Pages are prerendered; only Actions run on the Worker.
  adapter: cloudflare(),
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self' https://api.resend.com https://challenges.cloudflare.com",
        "form-action 'self'",
        "frame-src https://challenges.cloudflare.com",
        "base-uri 'self'",
        "object-src 'none'",
      ],
      scriptDirective: {
        resources: ["'self'", "https://challenges.cloudflare.com"],
      },
    },
  },
  i18n: {
    locales: ["ca", "es", "en"],
    defaultLocale: "ca",
    routing: { prefixDefaultLocale: false },
  },
  image: {
    quality: 65,
    format: ["webp"],
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Cormorant Garamond",
      cssVariable: "--font-cormorant",
      fallbacks: ["Georgia", "serif"],
      options: {
        variants: [
          { src: ["./src/assets/fonts/cormorant-garamond-normal-300.woff2"], weight: 300, style: "normal" },
          { src: ["./src/assets/fonts/cormorant-garamond-normal-300.woff2"], weight: 400, style: "normal" },
          { src: ["./src/assets/fonts/cormorant-garamond-normal-300.woff2"], weight: 600, style: "normal" },
          { src: ["./src/assets/fonts/cormorant-garamond-italic-300.woff2"], weight: 300, style: "italic" },
          { src: ["./src/assets/fonts/cormorant-garamond-italic-300.woff2"], weight: 400, style: "italic" },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-inter",
      fallbacks: ["system-ui", "sans-serif"],
      options: {
        variants: [
          { src: ["./src/assets/fonts/inter-normal-300.woff2"], weight: 300, style: "normal" },
          { src: ["./src/assets/fonts/inter-normal-300.woff2"], weight: 400, style: "normal" },
          { src: ["./src/assets/fonts/inter-normal-300.woff2"], weight: 500, style: "normal" },
        ],
      },
    },
  ],
  vite: {
    optimizeDeps: {
      exclude: ["@astrojs/cloudflare"],
    },
  },
});
