'use client';

import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Languages } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';
import type { Locale } from '@/lib/i18n/types';

type Props = {
  /** Tamaño en barras densas vs cabecera landing */
  variant?: 'compact' | 'minimal';
};

export default function LanguageSwitcher({ variant = 'compact' }: Props) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const iconSize = variant === 'compact' ? 14 : 16;
  const fontSize = variant === 'compact' ? 10 : 11;
  const padY = variant === 'compact' ? 4 : 6;
  const padX = variant === 'compact' ? 8 : 10;

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  function select(next: Locale) {
    if (locale !== next) setLocale(next);
    setOpen(false);
  }

  const triggerBase: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: `${padY}px ${padX}px`,
    borderRadius: '6px',
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--muted)',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontSize: `${fontSize}px`,
    fontWeight: 600,
    letterSpacing: '0.02em',
  };

  const itemStyle = (active: boolean): CSSProperties => ({
    display: 'block',
    width: '100%',
    textAlign: 'left' as const,
    padding: '8px 12px',
    border: 'none',
    background: active ? 'rgba(200,245,80,.12)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--muted)',
    cursor: active ? 'default' : 'pointer',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: active ? 600 : 400,
  });

  const label = t('common.language');

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        style={triggerBase}
      >
        <Languages size={iconSize} strokeWidth={2} aria-hidden />
        <span>{locale.toUpperCase()}</span>
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={label}
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 4px)',
            minWidth: '140px',
            zIndex: 50,
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            boxShadow: '0 8px 24px rgba(0,0,0,.35)',
            overflow: 'hidden',
            padding: '4px 0',
          }}
        >
          {(
            [
              { value: 'es' as const, text: t('common.spanish') },
              { value: 'en' as const, text: t('common.english') },
            ] as const
          ).map(({ value, text }) => (
            <button
              key={value}
              type="button"
              role="option"
              aria-selected={locale === value}
              onClick={() => select(value)}
              style={itemStyle(locale === value)}
            >
              {text}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
