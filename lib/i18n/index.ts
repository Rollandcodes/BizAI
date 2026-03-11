import { en } from './en';
import { tr } from './tr';
import { gr } from './gr';

export type Dictionary = {
  [K in keyof typeof en]: string;
};

export const dictionaries = {
  en: en as Dictionary,
  tr: tr as Dictionary,
  gr: gr as Dictionary,
};

export type Locale = keyof typeof dictionaries;

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_STORAGE_KEY = 'bizai-locale';

export function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'tr' || value === 'gr';
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
