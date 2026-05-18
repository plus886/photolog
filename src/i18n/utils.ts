import { ui, defaultLocale, type Locale } from "./ui";

export type { Locale };

/** Astro.currentLocale -> a known Locale (defaults to `ja`). */
export function resolveLocale(current: string | undefined): Locale {
  return current === "zh" ? "zh" : defaultLocale;
}

/** Returns a bound `t()`; usable from .astro and .svelte alike. */
export function useTranslations(locale: Locale) {
  return (key: keyof (typeof ui)["ja"]): string =>
    ui[locale][key] ?? ui[defaultLocale][key];
}
