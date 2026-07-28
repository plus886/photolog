import {
  getDaysByLocation,
  getLocation,
  type DayCard,
  type Location,
} from "./client";
import { isPrivateLocation } from "./location";

export type LocationPageData = {
  location: Location;
  days: DayCard[];
};

/**
 * Loads a location archive (the place + every photo taken there).
 * Returns null for a missing, unknown or private place; the caller turns
 * that into a 404 Response (only a page can return one).
 */
export const loadLocationPage = async (
  id: string | undefined,
): Promise<LocationPageData | null> => {
  if (!id) return null;
  const location = await getLocation(id).catch(() => null);
  // Private places are 404 rather than redirect: the page never existed as
  // far as anything outside is concerned.
  if (!location || isPrivateLocation(location)) return null;
  const days = await getDaysByLocation(id);
  if (days.length === 0) return null;
  return { location, days };
};
