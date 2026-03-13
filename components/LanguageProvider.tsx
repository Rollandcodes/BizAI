'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import ar from '@/messages/ar.json';
import ru from '@/messages/ru.json';
import el from '@/messages/el.json';

export type Locale = 'en' | 'tr' | 'ar' | 'ru' | 'el';

type Messages = typeof en;

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Messages;
  isRTL: boolean;
};

const dictionaries: Record<Locale, Messages> = { en, tr, ar, ru, el };

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  setLocale: () => undefined,
  messages: dictionaries.en,
  isRTL: false,
});

function getLocaleFromPath(pathname: string): Locale | null {
  const match = pathname.match(/^\/(en|tr|ar|ru|el)(\/|$)/);
  if (!match) return null;
  return match[1] as Locale;
}

function safeReadStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('cypai-locale');
  if (saved === 'en' || saved === 'tr' || saved === 'ar' || saved === 'ru' || saved === 'el') {
    return saved;
  }
  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const pathLocale = pathname ? getLocaleFromPath(pathname) : null;
    const resolvedLocale = pathLocale ?? safeReadStoredLocale();
    setLocaleState(resolvedLocale);
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    const rtl = locale === 'ar';

    root.lang = locale;
    root.dir = rtl ? 'rtl' : 'ltr';
    localStorage.setItem('cypai-locale', locale);
    document.cookie = `cypai-locale=${locale}; path=/; max-age=31536000; samesite=lax`;
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      messages: dictionaries[locale],
      isRTL: locale === 'ar',
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useUiTranslations() {
  const { messages } = useLanguage();

  return function t(path: string) {
    const parts = path.split('.');
    let value: unknown = messages;

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = (value as Record<string, unknown>)[part];
      } else {
        return path;
      }
    }

    return typeof value === 'string' ? value : path;
  };
}
