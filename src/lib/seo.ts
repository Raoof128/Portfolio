import type { Metadata } from "next";
import { SITE_URL } from "./constants";

// English is served at the clean root path (no `/en` prefix, per public/_redirects);
// every other locale lives under its own prefix.
export const LOCALE_PREFIX: Record<string, string> = {
  en: "",
  fa: "/fa",
  ar: "/ar",
  zh: "/zh",
  es: "/es",
};

// Default social-preview card (1200×630, public/og.png). Any generateMetadata
// that defines `openGraph` or `twitter` REPLACES the layout's version for that
// field, so every such page must re-attach these images or the preview is lost.
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Mohammad Raouf Abedini — AI Security Researcher",
};
export const OG_IMAGES = [OG_IMAGE];
export const TWITTER_IMAGE = ["/og.png"];

/** OpenGraph locale codes keyed by our locale slugs. */
export const OG_LOCALE: Record<string, string> = {
  en: "en_AU",
  fa: "fa_IR",
  ar: "ar_SA",
  zh: "zh_CN",
  es: "es_ES",
};

/**
 * Absolute, locale-aware self URL for a route — the value `og:url` must carry
 * so a localized page advertises ITS OWN URL, never the English apex. `path` is
 * the locale-agnostic route ("/about", or "" for home).
 */
export function ogUrl(path: string, locale: string): string {
  const prefix = LOCALE_PREFIX[locale] ?? "";
  return `${SITE_URL}${prefix}${path}` || SITE_URL;
}

/**
 * Serialize a JSON-LD object for inline injection. All inputs here are trusted
 * (hardcoded site data, no user input), but we still escape `<` → `<` so a
 * stray `</script>` in any string can never break out of the <script> element.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Build a schema.org BreadcrumbList node from an ordered trail of
 * {name, url} crumbs (Home › Section › Page). Google-supported rich result.
 */
export function breadcrumbList(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

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
      // Neutral selector for locale-agnostic crawlers → clean English.
      "x-default": path || "/",
    },
  };
}
