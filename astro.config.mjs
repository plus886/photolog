// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import Icons from "unplugin-icons/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), Icons({ compiler: "svelte" })],
  },
  integrations: [svelte()],
  site: "https://photo.kokaiji.tw",
});
