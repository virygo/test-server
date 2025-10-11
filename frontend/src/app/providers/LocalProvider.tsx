'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type Locale = 'en' | 'el';

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const LocaleContext = createContext<Ctx | null>(null);

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within <LocaleProvider>');
  return ctx;
}

export default function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, _setLocale] = useState<Locale>(initialLocale);

  const setLocale = useCallback((l: Locale) => {
    _setLocale(l);
    document.cookie = `locale=${l}; path=/; max-age=${60 * 60 * 24 * 365}`;
    try {
      localStorage.setItem('locale', l);
    } catch {}
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
