'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { useLocale } from 'next-intl';

export function LocaleToggle() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale: Locale = locale === 'en' ? 'zh' : 'en';
    
    // Persist locale in cookie
    document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000`;
    
    // Refresh to apply the new locale
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="h-9 px-3 flex items-center justify-center rounded-md border bg-background hover:bg-accent transition-colors text-sm disabled:opacity-50"
      title={`Switch to ${localeNames[locale === 'en' ? 'zh' : 'en']}`}
    >
      {isPending ? '...' : localeFlags[locale]}
    </button>
  );
}

// Dropdown variant (optional)
export function LocaleDropdown() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const setLocale = (newLocale: Locale) => {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="relative group">
      <button
        className="w-9 h-9 flex items-center justify-center rounded-md border bg-background hover:bg-accent transition-colors text-lg"
        disabled={isPending}
      >
        {isPending ? '...' : localeFlags[locale]}
      </button>
      <div className="absolute right-0 top-full mt-1 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {locales.map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 ${
              l === locale ? 'bg-accent' : ''
            }`}
          >
            <span>{localeFlags[l]}</span>
            <span>{localeNames[l]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
