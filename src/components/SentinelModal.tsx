'use client';

import {
  useEffect,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { createPortal } from 'react-dom';

export type SentinelModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** id del elemento visible que titula el diálogo (aria-labelledby) */
  labelledBy?: string;
  /** Si no hay título visible con id, usar aria-label */
  ariaLabel?: string;
  /** Clases extra en el backdrop (p. ej. animación) */
  backdropClassName?: string;
};

/**
 * Overlay estándar: mismo centrado y stacking que el modal de Flujos.
 * El contenido (p. ej. `.sentinel-card`) va en `children`.
 */
export default function SentinelModal({
  open,
  onClose,
  children,
  labelledBy,
  ariaLabel,
  backdropClassName = '',
}: SentinelModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  function handleBackdropClick(e: ReactMouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return createPortal(
    <div
      role="presentation"
      className={`sentinel-modal-backdrop ${backdropClassName}`.trim()}
      onClick={handleBackdropClick}
    >
      <div
        className="sentinel-modal-dialog-root"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
