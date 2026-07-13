// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.draestelamas.com",
  // output: 'static' is the default. Pages are prerendered; only Actions run on the Worker.
  adapter: cloudflare(),
  i18n: {
    locales: ["ca", "es", "en"],
    defaultLocale: "ca",
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "ca",
        locales: { ca: "ca", es: "es", en: "en" },
      },
    }),
  ],
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
  vite: { plugins: [tailwindcss()] },
});
