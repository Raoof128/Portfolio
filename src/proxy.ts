import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Locale, locales, defaultLocale } from './i18n';

const PUBLIC_LOCALES: Locale[] = Object.keys(locales) as Locale[];
const OTHER_LOCALES = PUBLIC_LOCALES.filter(l => l !== defaultLocale);

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|api/).*)',
  ],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static asset extensions
  if (/\.(svg|png|jpg|jpeg|pdf|txt|ico|webp|woff2?)$/.test(pathname)) {
    return NextResponse.next();
  }

  // Redirect /en and /en/* back to clean English routes
  if (pathname === '/en') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (pathname.startsWith('/en/')) {
    const cleanPath = pathname.replace(/^\/en/, '');
    return NextResponse.redirect(new URL(cleanPath || '/', request.url));
  }

  // Pass through other locale prefixes (/fa, /ar, /zh, /es) unchanged
  const pathnameHasLocale = OTHER_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Rewrite clean English paths internally: / → /en, /projects → /en/projects
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
}
