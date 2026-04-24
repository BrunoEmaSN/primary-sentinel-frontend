'use client';

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { LegalTermsBody } from '@/components/legal/LegalTermsBody';
import { LegalPrivacyBody } from '@/components/legal/LegalPrivacyBody';

export type LegalDocModalDoc = 'terms' | 'privacy';

type LegalDocModalProps = {
  open: boolean;
  doc: LegalDocModalDoc | null;
  onClose: () => void;
};

export default function LegalDocModal({ open, doc, onClose }: LegalDocModalProps) {
  const { t, dict } = useI18n();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open || !doc) return null;

  const title = doc === 'terms' ? dict.legal.terms.title : dict.legal.privacy.title;

  return (
    <div
      className="legal-doc-modal"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="legal-doc-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-doc-modal-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="legal-doc-modal__head">
          <span id="legal-doc-modal-title">{title}</span>
          <button
            type="button"
            className="legal-doc-modal__close"
            onClick={onClose}
            aria-label={t('auth.legalModalCloseAria')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="legal-doc-modal__scroll">
          <div className="legal-doc legal-doc--in-modal">
            {doc === 'terms' ? (
              <LegalTermsBody lt={dict.legal.terms} />
            ) : (
              <LegalPrivacyBody lp={dict.legal.privacy} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
