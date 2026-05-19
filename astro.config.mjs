// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import Icons from "unplugin-icons/vite";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({ imageService: "passthrough" }),

  vite: {
    plugins: [tailwindcss(), Icons({ compiler: "svelte" })],
  },

  integrations: [svelte()],
  site: "https://photo.kokaiji.tw",

  // Hover-prefetch every internal link so opening a day page feels
  // instant (the view-transition morph then plays without a spinner).
  prefetch: { prefetchAll: true },

  i18n: {
    defaultLocale: "ja",
    locales: ["ja", "zh"],
    routing: { prefixDefaultLocale: false },
  },
});
