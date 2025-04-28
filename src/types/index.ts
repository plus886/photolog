import type { OptimizedDay } from "libs/client";
import type { GetAllDays } from "libs/client";

export type { OptimizedDay };
export type HeaderProps = App.Locals & OptimizedDay;
export type GridGalleryProps = {
  response: GetAllDays;
};
export type DayProps = {
  item: OptimizedDay;
  nextPost: OptimizedDay | null;
  prevPost: OptimizedDay | null;
};
