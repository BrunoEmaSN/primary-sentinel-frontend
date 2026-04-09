import type { Locale } from '@/lib/i18n/types';
import { es } from './es';
import { en } from './en';

/** Estructura idéntica en ambos idiomas; el tipo se toma del español. */
export type Dictionary = typeof es;

const byLocale: Record<Locale, Dictionary> = {
  es,
  en: en as unknown as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return byLocale[locale] ?? es;
}

export { es, en };
