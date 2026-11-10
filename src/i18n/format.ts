import type { Locale } from "./index";

const languageTags: Record<Locale, string> = {
  en: "en-AU",
  fa: "fa-IR",
  // Pin the numeral system because generic Arabic defaults vary by ICU version.
  ar: "ar-u-nu-arab",
  zh: "zh-CN",
  es: "es-ES",
};

// Building an Intl formatter costs far more than formatting with one, and windows format
// dozens of counts and dates on every open. Formatters are immutable, so one per language and
// options is reused. The key is the options as written; the few call sites pass literals.
const numberFormats = new Map<string, Intl.NumberFormat>();
const dateFormats = new Map<string, Intl.DateTimeFormat>();

function cached<T>(
  cache: Map<string, T>,
  tag: string,
  options: object | undefined,
  create: () => T,
): T {
  const key = `${tag}|${options ? JSON.stringify(options) : ""}`;
  let formatter = cache.get(key);
  if (!formatter) {
    formatter = create();
    cache.set(key, formatter);
  }
  return formatter;
}

/** UI counts use the selected script; technical measurements retain source text. */
export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  if (!Number.isFinite(value)) return "—";
  const tag = languageTags[locale];
  return cached(
    numberFormats,
    tag,
    options,
    () => new Intl.NumberFormat(tag, options),
  ).format(value);
}

/** UTC keeps date-only publication values consistent across visitor time zones. */
export function formatDate(
  value: string | number | Date,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return "—";
  const tag = languageTags[locale];
  return cached(
    dateFormats,
    tag,
    options,
    () => new Intl.DateTimeFormat(tag, { timeZone: "UTC", ...options }),
  ).format(date);
}
