import type { GetDays, Day, DayCard } from "libs/client";
import type { Locale } from "i18n/utils";

export type { GetDays, Day, DayCard };

export type DayProps = {
  item: Day;
  nextPost: Day | null;
  prevPost: Day | null;
  localePrefix: string;
  locale: Locale;
  passage?: string;
};

export type GridGalleryProps = {
  totalItemsLength: number;
  totalPages: number;
  localePrefix: string;
  locale: Locale;
};
