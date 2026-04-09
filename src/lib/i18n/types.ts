export type Locale = 'es' | 'en';

export const LOCALE_COOKIE = 'sentinel_lang';

export const DEFAULT_LOCALE: Locale = 'es';

export const SUPPORTED_LOCALES: Locale[] = ['es', 'en'];

export function isLocale(v: string | undefined | null): v is Locale {
  return v === 'es' || v === 'en';
}
