import { atom } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";

export type ThemeValue = "dark" | "light";

export const isDrawerOpen = atom(false);
export const theme = persistentAtom<ThemeValue>("theme", "light");
