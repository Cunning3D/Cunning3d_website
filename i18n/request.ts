import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { locales, defaultLocale, type Locale } from './config';

const LOCALE_COOKIE = 'NEXT_LOCALE';

export default getRequestConfig(async () => {
  // 从 cookie 获取 locale
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value as Locale | undefined;
  
  // 从 header 获取 locale（middleware 设置的）
  const headerStore = await headers();
  const headerLocale = headerStore.get('x-locale') as Locale | undefined;

  // 优先使用 cookie，其次 header，最后默认
  let locale: Locale = defaultLocale;
  if (cookieLocale && locales.includes(cookieLocale)) {
    locale = cookieLocale;
  } else if (headerLocale && locales.includes(headerLocale)) {
    locale = headerLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
