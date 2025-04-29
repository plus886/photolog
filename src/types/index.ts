import type { OptimizedDay, GetAllDays, GetDays } from "libs/client";

export type { OptimizedDay, GetAllDays, GetDays };
export type HeaderProps = App.Locals & OptimizedDay;

export type DayProps = {
  item: OptimizedDay;
  nextPost: OptimizedDay | null;
  prevPost: OptimizedDay | null;
};
