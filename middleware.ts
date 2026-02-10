import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from './i18n/config';

const LOCALE_COOKIE = 'NEXT_LOCALE';

export function middleware(request: NextRequest) {
  const rawPathname = request.nextUrl.pathname;
  const basePath = request.nextUrl.basePath || '';
  const pathname =
    basePath && rawPathname.startsWith(basePath)
      ? rawPathname.slice(basePath.length) || '/'
      : rawPathname;

  // Skip paths that should not be localized
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Detect locale prefix in the URL
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    // Persist locale in cookie and redirect to non-prefixed URL
    const response = NextResponse.redirect(
      new URL(pathname.replace(`/${pathnameLocale}`, '') || '/', request.url)
    );
    response.cookies.set(LOCALE_COOKIE, pathnameLocale, { path: '/' });
    return response;
  }

  // Read locale from cookie (fallback to default)
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;
  const locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;

  // Expose locale via header for server-side reading
  const response = NextResponse.next();
  response.headers.set('x-locale', locale);
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
