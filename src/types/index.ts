import type { OptimizedDay } from "libs/client";
import type { ItemsByYear, Years } from "components/GridGallery";

export type { OptimizedDay };
export type HeaderProps = App.Locals & OptimizedDay;
export type GridGalleryProps = {
  items: ItemsByYear;
  years: Years;
};
export type DayProps = {
  item: OptimizedDay;
  nextPost: OptimizedDay | null;
  prevPost: OptimizedDay | null;
};
