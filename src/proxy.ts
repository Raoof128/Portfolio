import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Locale, locales, defaultLocale } from "./i18n";

const PUBLIC_LOCALES: Locale[] = Object.keys(locales) as Locale[];
const OTHER_LOCALES = PUBLIC_LOCALES.filter((l) => l !== defaultLocale);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|api/).*)",
  ],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static asset extensions
  if (
    /\.(?:svg|png|jpe?g|pdf|txt|ico|webp|avif|gif|woff2?|mp4|webm|xml|json|wasm)$/i.test(
      pathname,
    )
  ) {
    return NextResponse.next();
  }

  // Redirect /en and /en/* back to clean English routes
  // In development, rewritten English routes can re-enter the proxy. Let the
  // App Router resolve them; the static host owns production /en redirects.
  if (
    process.env.NODE_ENV === "development" &&
    (pathname === "/en" || pathname.startsWith("/en/"))
  ) {
    return NextResponse.next();
  }
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    // Assign a path on the existing URL: reparsing //host as a relative URL
    // would turn an attacker-controlled path into an external authority.
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url);
  }

  // Pass through other locale prefixes (/fa, /ar, /zh, /es) unchanged
  const pathnameHasLocale = OTHER_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Rewrite clean English paths internally: / → /en, /projects → /en/projects
  const url = request.nextUrl.clone();
  // Avoid /en/ for the homepage: slash normalization redirects it to /en,
  // which redirects to / and otherwise creates a development redirect loop.
  url.pathname =
    pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
}
