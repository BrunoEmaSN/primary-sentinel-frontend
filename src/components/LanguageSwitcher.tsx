'use client';

import type { CSSProperties } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);

  const iconSize = variant === 'compact' ? 14 : 16;
  const fontSize = variant === 'compact' ? 10 : 11;
  const padY = variant === 'compact' ? 4 : 6;
  const padX = variant === 'compact' ? 8 : 10;

  const updateMenuPosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMenuPos({
      top: r.bottom + 4,
      right: typeof window !== 'undefined' ? window.innerWidth - r.right : 0,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuPos(null);
      return;
    }
    updateMenuPosition();
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      const node = e.target as Node;
      if (triggerRef.current?.contains(node)) return;
      if (menuRef.current?.contains(node)) return;
      setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function handleResizeOrScroll() {
      updateMenuPosition();
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
    };
  }, [open, updateMenuPosition]);

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

  const menu =
    open && menuPos && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-label={label}
            style={{
              position: 'fixed',
              top: menuPos.top,
              right: menuPos.right,
              minWidth: '140px',
              zIndex: 10000,
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
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <button
          ref={triggerRef}
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
      </div>
      {menu}
    </>
  );
}
