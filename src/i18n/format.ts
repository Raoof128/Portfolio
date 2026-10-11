import type { Locale } from "./index";

const languageTags: Record<Locale, string> = {
  en: "en-AU",
  fa: "fa-IR",
  // Pin the numeral system because generic Arabic defaults vary by ICU version.
  ar: "ar-u-nu-arab",
  zh: "zh-CN",
  es: "es-ES",
};

/** UI counts use the selected script; technical measurements retain source text. */
export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(languageTags[locale], options).format(value);
}

/** UTC keeps date-only publication values consistent across visitor time zones. */
export function formatDate(
  value: string | number | Date,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return "—";
  return new Intl.DateTimeFormat(languageTags[locale], {
    timeZone: "UTC",
    ...options,
  }).format(date);
}
