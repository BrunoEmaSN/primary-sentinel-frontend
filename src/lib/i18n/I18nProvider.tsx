'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getNestedString } from '@/lib/i18n/getNested';
import type { Dictionary } from '@/lib/i18n/messages';
import { LOCALE_COOKIE, type Locale, isLocale } from '@/lib/i18n/types';

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
  dict: Dictionary;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  initialLocale,
  dictionary,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
  dictionary: Dictionary;
}) {
  const router = useRouter();

  const setLocale = useCallback(
    (next: Locale) => {
      if (!isLocale(next)) return;
      document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
      router.refresh();
    },
    [router]
  );

  const t = useCallback(
    (path: string) => {
      const s = getNestedString(dictionary, path);
      return s ?? path;
    },
    [dictionary]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale: initialLocale,
      setLocale,
      t,
      dict: dictionary,
    }),
    [initialLocale, setLocale, t, dictionary]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n debe usarse dentro de I18nProvider');
  }
  return ctx;
}

/** Para piezas que pueden montarse fuera del provider (p. ej. tests); no usar en producción sin provider. */
export function useI18nOptional(): I18nContextValue | null {
  return useContext(I18nContext);
}
