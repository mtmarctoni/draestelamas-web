// @ts-check

import cloudflare from "@astrojs/cloudflare";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: process.env.BASE_URL || "https://draestelamas.com",
  // imageService "compile": builds images at build time with sharp so static
  // previews don't 404 (the default "cloudflare-binding" rewrites srcs to the
  // runtime /_image endpoint which only works on the live Worker).
  adapter: cloudflare({ imageService: "compile" }),
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self' https://challenges.cloudflare.com",
        "form-action 'self'",
        "frame-src https://challenges.cloudflare.com",
        "base-uri 'self'",
        "object-src 'none'",
        "upgrade-insecure-requests",
      ],
      scriptDirective: {
        resources: ["'self'", "https://challenges.cloudflare.com"],
      },
      styleDirective: {
        resources: ["'self'"],
      },
    },
  },
  i18n: {
    locales: ["ca", "es", "en"],
    defaultLocale: "ca",
    routing: { prefixDefaultLocale: false },
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
      subsets: ["latin"],
      display: "swap",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/cormorant-garamond-normal-300.woff2"],
            weight: 300,
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/cormorant-garamond-normal-400.woff2"],
            weight: 400,
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/cormorant-garamond-normal-600.woff2"],
            weight: 600,
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/cormorant-garamond-italic-300.woff2"],
            weight: 300,
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/cormorant-garamond-italic-400.woff2"],
            weight: 400,
            style: "italic",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-inter",
      fallbacks: ["system-ui", "sans-serif"],
      subsets: ["latin"],
      display: "swap",
      options: {
        variants: [
          { src: ["./src/assets/fonts/inter-normal-300.woff2"], weight: 300, style: "normal" },
          { src: ["./src/assets/fonts/inter-normal-400.woff2"], weight: 400, style: "normal" },
          { src: ["./src/assets/fonts/inter-normal-500.woff2"], weight: 500, style: "normal" },
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
