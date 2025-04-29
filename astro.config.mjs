// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import Icons from "unplugin-icons/vite";

import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), Icons({ compiler: "svelte" })],
  },

  integrations: [svelte(), sitemap()],
  site: "https://photo.kokaiji.tw",
  adapter: cloudflare(),
});