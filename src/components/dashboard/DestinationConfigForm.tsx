'use client';

import React, { useState } from 'react';
import { DESTINATION_CONFIGS, type Destination, type DestinationType } from '@/types/destinations';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { destinationFieldLabel, destinationTypeCopy } from '@/lib/i18n/dashboardDestinations';

interface DestinationConfigFormProps {
  type: DestinationType;
  initialValue?: Partial<Destination>;
  onChange: (config: Destination) => void;
  onMultiAddClick?: () => void;
}

function stringifyHeaders(h: unknown): string {
  if (h == null) return '';
  if (typeof h === 'string') return h;
  if (typeof h === 'object' && !Array.isArray(h)) {
    try {
      return JSON.stringify(h, null, 2);
    } catch {
      return '';
    }
  }
  return '';
}

/**
 * Build API-ready destination.
 * If headers textarea is invalid JSON and `changedKey !== 'headers'`, headers are omitted so other fields still save.
 */
function buildDestination(
  values: Record<string, unknown>,
  type: DestinationType,
  changedKey: string
): Destination | null {
  const o = { ...values, type } as Record<string, unknown>;
  const ht = o.headers;
  if (typeof ht === 'string') {
    const t = ht.trim();
    if (!t) {
      delete o.headers;
    } else {
      try {
        const p = JSON.parse(t) as unknown;
        if (typeof p !== 'object' || p === null || Array.isArray(p)) {
          if (changedKey === 'headers') return null;
          delete o.headers;
        } else {
          o.headers = Object.fromEntries(
            Object.entries(p as Record<string, unknown>).map(([k, v]) => [k, String(v)])
          );
        }
      } catch {
        if (changedKey === 'headers') return null;
        delete o.headers;
      }
    }
  }
  return o as unknown as Destination;
}

export function DestinationConfigForm({ type, initialValue, onChange, onMultiAddClick }: DestinationConfigFormProps) {
  const { dict } = useI18n();
  const df = dict.dashboard.destinations;
  const ui = dict.dashboard.ui;
  const config = DESTINATION_CONFIGS[type];
  const typeCopy = destinationTypeCopy(dict, type);
  const [headerError, setHeaderError] = useState('');

  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const base: Record<string, unknown> = { type, ...initialValue };
    if (base.headers != null && typeof base.headers === 'object') {
      base.headers = stringifyHeaders(base.headers);
    }
    return base;
  });

  const handleChange = (key: string, value: unknown) => {
    const updated = { ...values, [key]: value };
    setValues(updated);

    if (key === 'headers') {
      const str = typeof value === 'string' ? value : '';
      if (str.trim() === '') {
        setHeaderError('');
        const built = buildDestination({ ...updated, headers: '' }, type, key);
        if (built) onChange(built);
        return;
      }
      const built = buildDestination(updated, type, key);
      if (!built) {
        setHeaderError(df.formInvalidHeadersJson);
        return;
      }
      setHeaderError('');
      onChange(built);
      return;
    }

    const built = buildDestination(updated, type, key);
    if (!built) {
      setHeaderError(df.formCheckHeadersJson);
      return;
    }
    setHeaderError('');
    onChange(built);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: '4px' }}>
        {config.icon} {typeCopy.label}
      </div>

      {config.fields.map((field) => {
        const value = values[field.key];
        const fieldLabel = destinationFieldLabel(dict, type, field.key);

        return (
          <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '1px', color: 'var(--muted)' }}>
              {fieldLabel}
              {field.required && ' *'}
            </label>

            {field.type === 'checkbox' && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(e) => handleChange(field.key, e.target.checked)}
                />
                <span>{ui.activated}</span>
              </label>
            )}

            {field.type === 'textarea' && (
              <>
                <textarea
                  className="sentinel-input"
                  placeholder={field.key === 'headers' ? df.headersPlaceholder : ''}
                  value={typeof value === 'string' ? value : ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  style={{ height: '80px', resize: 'vertical', fontFamily: 'monospace', fontSize: '11px' }}
                />
                {field.key === 'headers' && headerError && (
                  <div style={{ fontSize: '10px', color: 'var(--red)' }}>{headerError}</div>
                )}
              </>
            )}

            {field.type === 'select' && (
              <select
                className="sentinel-input"
                value={typeof value === 'string' ? value : ''}
                onChange={(e) => handleChange(field.key, e.target.value || undefined)}
              >
                <option value="">{ui.selectDefault}</option>
                {(field.options || []).map((opt) => (
                  <option key={opt} value={opt}>
                    {field.key === 'authType'
                      ? (ui.authTypes as Record<string, string>)[opt] ?? opt
                      : opt}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'number' && (
              <input
                type="number"
                className="sentinel-input"
                placeholder={field.key === 'timeoutMs' ? '5000' : ''}
                value={value === '' || value === undefined || value === null ? '' : String(value)}
                onChange={(e) => {
                  const v = e.target.value;
                  handleChange(field.key, v === '' ? undefined : parseInt(v, 10));
                }}
              />
            )}

            {['text', 'url', 'password'].includes(field.type) && (
              <>
                <input
                  type={field.type === 'password' ? 'password' : field.type === 'url' ? 'url' : 'text'}
                  className="sentinel-input"
                  placeholder={
                    field.key === 'url' && type === 'webhook'
                      ? df.placeholderWebhookUrl
                      : field.key === 'url'
                        ? df.placeholderGenericUrl
                        : ''
                  }
                  value={typeof value === 'string' ? value : ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
                {field.key === 'url' && (type === 'webhook' || type === 'http_api') && (
                  <div style={{ fontSize: '9px', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.45 }}>
                    {df.urlHintBefore}
                    <code style={{ fontSize: '9px' }}>{df.urlHintLocalhost}</code>
                    {df.urlHintMid}
                    <code style={{ fontSize: '9px' }}>{df.urlHintCannotPost}</code>
                    {df.urlHintAfter}
                  </div>
                )}
              </>
            )}

            {field.key === 'connectionString' && (
              <div style={{ fontSize: '9px', color: 'var(--muted)', marginTop: '-2px' }}>{df.encryptedServerNote}</div>
            )}
          </div>
        );
      })}

      {onMultiAddClick && (
        <button
          type="button"
          onClick={onMultiAddClick}
          style={{
            fontSize: '10px',
            padding: '8px 12px',
            background: 'rgba(34,197,94,.08)',
            border: '1px solid rgba(34,197,94,.2)',
            borderRadius: '6px',
            cursor: 'pointer',
            color: 'var(--accent)',
            fontWeight: 500,
            marginTop: '4px',
          }}
        >
          {df.multiAddButton}
        </button>
      )}
    </div>
  );
}
