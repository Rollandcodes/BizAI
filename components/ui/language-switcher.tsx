'use client';

import type { Locale } from '@/lib/i18n';

type Props = {
  value: Locale;
  onChange: (next: Locale) => void;
};

export function LanguageSwitcher({ value, onChange }: Props) {
  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
      <span className="sr-only">Language</span>
      <select
        aria-label="Select language"
        value={value}
        onChange={(event) => onChange(event.target.value as Locale)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B66]"
      >
        <option value="en">English</option>
        <option value="tr">Türkçe</option>
        <option value="gr">Ελληνικά</option>
      </select>
    </label>
  );
}
