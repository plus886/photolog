import {
  getDaysByLocation,
  getLocation,
  type DayCard,
  type Location,
} from "./client";

export type LocationPageData = {
  location: Location;
  days: DayCard[];
};

/**
 * Loads a location archive (the place + every photo taken there).
 * Returns null for a missing or unknown place, and for one with no photos
 * so an empty archive can't be linked or indexed; the caller turns that
 * into a 404 Response (only a page can return one).
 */
export const loadLocationPage = async (
  id: string | undefined,
): Promise<LocationPageData | null> => {
  if (!id) return null;
  const location = await getLocation(id).catch(() => null);
  if (!location) return null;
  const days = await getDaysByLocation(id);
  if (days.length === 0) return null;
  return { location, days };
};
