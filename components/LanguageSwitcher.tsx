'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage, type Locale } from './LanguageProvider';

const LANGUAGES: Array<{ code: Locale; label: string; flag: string }> = [
  { code: 'en', label: 'English', flag: 'GB' },
  { code: 'tr', label: 'Turkce', flag: 'TR' },
  { code: 'ar', label: 'العربية', flag: 'SA' },
  { code: 'ru', label: 'Русский', flag: 'RU' },
  { code: 'el', label: 'Ελληνικά', flag: 'GR' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale } = useLanguage();

  const currentLang = LANGUAGES.find((language) => language.code === locale) ?? LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <span>{currentLang.flag}</span>
        <span className="hidden sm:block">{currentLang.label}</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  const basePath = pathname.replace(/^\/(en|tr|ar|ru|el)(?=\/|$)/, '');
                  const normalizedPath = basePath.startsWith('/') ? basePath : `/${basePath}`;
                  const nextPath = `/${language.code}${normalizedPath === '/' ? '' : normalizedPath}`;
                  setLocale(language.code);
                  router.push(nextPath);
                  setIsOpen(false);
                }}
                className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  locale === language.code
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-base">{language.flag}</span>
                <span>{language.label}</span>
                {locale === language.code ? <span className="ml-auto text-blue-600">✓</span> : null}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
