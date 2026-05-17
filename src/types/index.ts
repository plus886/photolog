import type { OptimizedDay, GetDays, Day } from "libs/client";

export type { OptimizedDay, GetDays, Day };
export type HeaderProps = App.Locals & OptimizedDay;

export type DayProps = {
  item: OptimizedDay;
  nextPost: OptimizedDay | null;
  prevPost: OptimizedDay | null;
};

export type GridGalleryProps = {
  totalItemsLength: number;
  totalPages: number;
};
