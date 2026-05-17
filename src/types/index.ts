import type { GetDays, Day } from "libs/client";

export type { GetDays, Day };

export type DayProps = {
  item: Day;
  nextPost: Day | null;
  prevPost: Day | null;
};

export type GridGalleryProps = {
  totalItemsLength: number;
  totalPages: number;
};
