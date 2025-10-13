'use client';

import { useState, useEffect } from 'react';

const LOCALE_COOKIE = 'locale';

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[2]) : '';
}

export default function LangSwitcher() {
  const [locale, setLocale] = useState<'en' | 'el'>('en');

  useEffect(() => {
    const v = getCookie(LOCALE_COOKIE) as 'en' | 'el';
    if (v === 'en' || v === 'el') setLocale(v);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as 'en' | 'el';
    setLocale(val);
    const expires = new Date(Date.now() + 180 * 24 * 3600 * 1000).toUTCString();
    document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(val)}; expires=${expires}; path=/; SameSite=Lax`;
    location.reload();
  };

  return (
    <select
      value={locale}
      onChange={onChange}
      className="h-9 rounded-md bg-white/10 px-2 text-white text-sm border border-white/40 hover:bg-white/20 transition"
      aria-label="Language"
      title="Language"
    >
      <option value="en">EN</option>
      <option value="el">EL</option>
    </select>
  );
}
