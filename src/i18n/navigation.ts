import { Locale, locales, defaultLocale } from "./index";

/**
 * Returns the localized path for a given locale and current pathname.
 * Handles the "True Root English" logic where /en is redirected to /.
 */
export function getLocalizedPath(pathname: string, newLocale: Locale): string {
  // 1. Identify current locale and base path
  const segments = pathname.split("/");
  let currentLocale: Locale = defaultLocale;
  let basePath = pathname;

  const firstSegment = segments[1] as Locale;
  if (Object.keys(locales).includes(firstSegment)) {
    currentLocale = firstSegment;
    basePath = "/" + segments.slice(2).join("/");
  }

  if (newLocale === currentLocale) return pathname;

  // 2. Construct new path
  if (newLocale === defaultLocale) {
    // English is at root
    return basePath === "" ? "/" : basePath;
  } else {
    // Other locales have prefix
    const cleanBasePath = basePath === "/" ? "" : basePath;
    return `/${newLocale}${cleanBasePath}`;
  }
}

/**
 * Helper to get the locale from a pathname
 */
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split("/");
  const firstSegment = segments[1] as Locale;
  if (Object.keys(locales).includes(firstSegment)) {
    return firstSegment;
  }
  return defaultLocale;
}
