import { atom } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import type { GetDays } from "./client";

export type ThemeValue = "dark" | "light";
export type CachedDays = GetDays["contents"];

export const isDrawerOpen = atom(false);
export const theme = persistentAtom<ThemeValue>("theme", "light");
export const isDayImageLoading = atom(false);
export const cachedDays = atom<CachedDays>([]);
export const currentPage = atom(1);
export const totalPages = atom(1);
export const lastShowedDayId = atom("");
