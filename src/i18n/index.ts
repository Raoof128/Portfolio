export type Locale = "en" | "fa" | "ar" | "zh" | "es";

export interface LocaleConfig {
  label: string;
  dir: "ltr" | "rtl";
  fontFamily: string;
}

export const locales: Record<Locale, LocaleConfig> = {
  en: {
    label: "English",
    dir: "ltr",
    fontFamily:
      "var(--font-chakra-petch), var(--font-jetbrains-mono), ui-sans-serif, system-ui, sans-serif",
  },
  fa: {
    label: "فارسی",
    dir: "rtl",
    fontFamily: "Vazirmatn, Tahoma, Arial, sans-serif",
  },
  ar: {
    label: "العربية",
    dir: "rtl",
    fontFamily: "Vazirmatn, Tahoma, Arial, sans-serif",
  },
  zh: {
    label: "中文",
    dir: "ltr",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
  },
  es: {
    label: "Español",
    dir: "ltr",
    fontFamily:
      "var(--font-chakra-petch), var(--font-jetbrains-mono), ui-sans-serif, system-ui, sans-serif",
  },
};

export const defaultLocale: Locale = "en";

import type { Dictionary } from "./locales/en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./locales/en").then((module) => module.default),
  fa: () => import("./locales/fa").then((module) => module.default),
  ar: () => import("./locales/ar").then((module) => module.default),
  zh: () => import("./locales/zh").then((module) => module.default),
  es: () => import("./locales/es").then((module) => module.default),
};

/** Route parameters must name an authored locale, not an inherited property. */
export function isLocale(value: string): value is Locale {
  return Object.hasOwn(locales, value);
}

export function resolveLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export const getDictionary = async (locale: string) =>
  dictionaries[resolveLocale(locale)]();

export function getLocaleConfig(locale: string): LocaleConfig {
  return locales[resolveLocale(locale)];
}

export function isRTL(locale: string): boolean {
  return getLocaleConfig(locale).dir === "rtl";
}
