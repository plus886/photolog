import type { Location } from "./client";
import type { Locale } from "i18n/utils";

// Places that name where the author lives rather than somewhere public.
// These roll up to their city everywhere they'd otherwise be shown: "自宅"
// carries no search value as a place name, and a page titled that way isn't
// something to publish. Promote this to a flag on the microCMS record if the
// list grows beyond a couple of entries.
const PRIVATE_LOCATION_IDS = new Set(["myhome"]);

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
  const city = locale === "zh" ? location.cityZh : location.cityJa;
  if (PRIVATE_LOCATION_IDS.has(location.id)) return city || undefined;
  const area = locale === "zh" ? location.nameZh : location.nameJa;
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

/**
 * schema.org Place for an ImageObject's contentLocation. Goes through
 * locationName, so a private location contributes its city and nothing more.
 */
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
