import { getLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

export async function Lang({
  lang,
  children,
}: {
  lang: 'zh' | 'en';
  children: ReactNode;
}) {
  const locale = await getLocale();
  return locale === lang ? children : null;
}

