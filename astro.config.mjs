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
    // Svelte 5's client runtime keeps module-level state (the hydration
    // cursor among it). Letting Vite pre-bundle it in dev hands the
    // components a different instance than the one hydration runs in, and
    // every island dies on `get_first_child(undefined)`. Serving it from
    // source keeps a single instance. Only affects dev — the production
    // build doesn't use the dep optimizer.
    optimizeDeps: { exclude: ["svelte", "@astrojs/svelte"] },
    // Astro's virtual modules only work once a Vite transform hook has
    // substituted their config into them. Pre-bundling one for SSR runs it
    // through esbuild instead, which skips that hook, so the module is
    // evaluated with the placeholders still in place and the render dies:
    //   Cannot read properties of undefined (reading 'i18n')
    //   __PREFETCH_PREFETCH_ALL__ is not defined
    // Which modules get pre-bundled depends on the order deps are
    // discovered in, so the symptom moves between routes from one run to
    // the next. Keep them out of the SSR optimizer entirely.
    ssr: {
      optimizeDeps: {
        exclude: [
          "astro/virtual-modules/i18n.js",
          "astro/virtual-modules/prefetch.js",
          "astro/virtual-modules/transitions.js",
          "astro/virtual-modules/transitions-router.js",
          "astro/virtual-modules/transitions-types.js",
          "astro/virtual-modules/transitions-events.js",
          "astro/virtual-modules/transitions-swap-functions.js",
        ],
      },
    },
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
