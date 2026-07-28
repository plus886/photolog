import type { Location } from "./client";
import type { Locale } from "i18n/utils";

/**
 * The place name to show for a locale — the specific area when one was
 * recorded, otherwise the city. Returns undefined when there's no location,
 * so callers can fall back to their previous output.
 */
export function locationName(
  location: Location | undefined,
  locale: Locale,
): string | undefined {
  if (!location) return undefined;
  const area = locale === "zh" ? location.nameZh : location.nameJa;
  const city = locale === "zh" ? location.cityZh : location.cityJa;
  return area || city || undefined;
}

/**
 * ISO 3166-1 alpha-2, for schema.org's addressCountry. microCMS holds the
 * code as a single-choice select, so read the first entry.
 */
export function locationCountry(
  location: Location | undefined,
): string | undefined {
  return location?.country?.[0] || undefined;
}

/** schema.org Place for an ImageObject's contentLocation. */
export function locationPlace(location: Location | undefined, locale: Locale) {
  const name = locationName(location, locale);
  if (!location || !name) return undefined;
  const city = locale === "zh" ? location.cityZh : location.cityJa;
  const country = locationCountry(location);
  return {
    "@type": "Place",
    name,
    address: {
      "@type": "PostalAddress",
      // Omitted when the name already *is* the city — repeating it as both
      // the place and its locality says nothing.
      ...(city && city !== name ? { addressLocality: city } : {}),
      ...(country ? { addressCountry: country } : {}),
    },
  };
}
