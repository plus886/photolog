declare namespace App {
  interface Locals {
    lastCommitHash: string;
    lastCommitTime: string;
  }
}

namespace NodeJS {
  interface ProcessEnv {
    MICROCMS_DOMAIN: string;
    MICROCMS_API_KEY: string;
  }
}

// Injected at build time via vite `define` in astro.config.mjs.
declare const __COMMIT_HASH__: string;
declare const __COMMIT_TIME__: string;

// @fontsource packages are CSS-only side-effect imports with no type declarations.
declare module "@fontsource/*";
