// @ts-check
import { execSync } from "node:child_process";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import Icons from "unplugin-icons/vite";
import cloudflare from "@astrojs/cloudflare";

/** @param {string} cmd */
const git = (cmd) => {
  try {
    return execSync(cmd).toString().trim();
  } catch {
    return "";
  }
};

const commitHash = git("git rev-parse HEAD");
const commitTime = git(
  `git show ${commitHash || "HEAD"} --no-patch --no-notes --pretty=%cd`,
);

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({ imageService: "passthrough" }),

  vite: {
    plugins: [tailwindcss(), Icons({ compiler: "svelte" })],
    define: {
      __COMMIT_HASH__: JSON.stringify(commitHash),
      __COMMIT_TIME__: JSON.stringify(commitTime),
    },
  },

  integrations: [svelte()],
  site: "https://photo.kokaiji.tw",
});
