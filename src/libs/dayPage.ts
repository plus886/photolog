import { getAdjacentDays, getDayDetail, type Day } from "./client";

export type DayPageData = {
  item: Day;
  nextPost: Day | null;
  prevPost: Day | null;
};

/**
 * Loads a day-detail page's data (the post + its adjacent days).
 * Returns null for a missing or non-existent id; the caller turns
 * that into a 404 Response (only a page can return one).
 */
export const loadDayPage = async (
  id: string | undefined,
): Promise<DayPageData | null> => {
  if (!id) return null;
  const item = await getDayDetail(id).catch(() => null);
  if (!item) return null;
  const { nextPost, prevPost } = await getAdjacentDays(
    item.publishedAt ?? item.createdAt,
  );
  return { item, nextPost, prevPost };
};
