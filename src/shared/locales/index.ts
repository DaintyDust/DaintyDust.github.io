import { nl } from "./nl";
import { en } from "./en";
import type { LocaleWidget } from "@/shared/types/widget";

export interface LocaleContent {
  backgroundText: string;
  widgets: readonly LocaleWidget[];
}

export const locales = {
  nl,
  en,
} satisfies Record<string, LocaleContent>;

export default locales;
