import type { Metadata } from "next";

// English is served at the clean root path (no `/en` prefix, per public/_redirects);
// every other locale lives under its own prefix.
const LOCALE_PREFIX: Record<string, string> = {
  en: "",
  fa: "/fa",
  ar: "/ar",
  zh: "/zh",
  es: "/es",
};

/**
 * Per-page canonical + hreflang alternates so every URL declares ITSELF as
 * canonical (fixes Search Console "user-declared canonical: homepage" on
 * sub-pages). `path` is the locale-agnostic route, e.g. "/about" or "" for home.
 * Resolved against `metadataBase` (SITE_URL) set in the root layout.
 */
export function buildAlternates(
  path: string,
  locale: string,
): Metadata["alternates"] {
  const prefix = LOCALE_PREFIX[locale] ?? "";
  return {
    canonical: `${prefix}${path}` || "/",
    languages: {
      en: path || "/",
      fa: `/fa${path}`,
      ar: `/ar${path}`,
      zh: `/zh${path}`,
      es: `/es${path}`,
    },
  };
}
