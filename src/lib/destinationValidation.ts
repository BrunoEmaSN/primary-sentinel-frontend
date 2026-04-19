import { DESTINATION_CONFIGS, type DestinationType } from '@/types/destinations';
import type { Dictionary } from '@/lib/i18n/messages';
import { destinationFieldLabel, destinationTypeCopy } from '@/lib/i18n/dashboardDestinations';

/** Ancho explícito: el índice `[number]` sobre configs `as const` colapsa mal el union de `type`. */
type DestinationFormField = {
  key: string;
  required?: boolean;
  type: 'text' | 'password' | 'url' | 'number' | 'checkbox' | 'select' | 'textarea';
};

function isValidHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function isNonEmptyString(v: unknown): boolean {
  if (v === undefined || v === null) return false;
  return String(v).trim().length > 0;
}

function requiredFieldError(
  metaLabel: string,
  fieldLabel: string,
  field: DestinationFormField,
  v: unknown,
  msg: Dictionary['dashboard']['destinations']['validation']
): string | null {
  if (!field.required) return null;
  switch (field.type) {
    case 'number':
      if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) {
        return msg.fieldRequired.replace('{meta}', metaLabel).replace('{field}', fieldLabel);
      }
      return null;
    case 'checkbox':
      if (v === undefined) {
        return msg.fieldRequired.replace('{meta}', metaLabel).replace('{field}', fieldLabel);
      }
      return null;
    case 'url':
      if (!isNonEmptyString(v)) {
        return msg.fieldRequired.replace('{meta}', metaLabel).replace('{field}', fieldLabel);
      }
      if (!isValidHttpUrl(String(v).trim())) {
        return msg.fieldUrl.replace('{meta}', metaLabel).replace('{field}', fieldLabel);
      }
      return null;
    default:
      if (!isNonEmptyString(v)) {
        return msg.fieldRequired.replace('{meta}', metaLabel).replace('{field}', fieldLabel);
      }
      return null;
  }
}

/**
 * Valida que el destino tenga todos los campos marcados como `required` en DESTINATION_CONFIGS.
 * Los textos visibles vienen de `dict.dashboard.destinations`.
 */
export function validateDestinationRequiredFields(
  type: DestinationType,
  config: unknown,
  dict: Dictionary
): string | null {
  const msg = dict.dashboard.destinations.validation;
  if (config === null || typeof config !== 'object' || Array.isArray(config)) {
    return msg.missingConfig;
  }
  const c = config as Record<string, unknown>;
  if (c.type !== type) {
    return msg.inconsistent;
  }
  const meta = DESTINATION_CONFIGS[type];
  const metaLabel = destinationTypeCopy(dict, type).label;
  for (const field of meta.fields) {
    const fieldLabel = destinationFieldLabel(dict, type, field.key);
    const err = requiredFieldError(
      metaLabel,
      fieldLabel,
      field as DestinationFormField,
      c[field.key],
      msg
    );
    if (err) return err;
  }
  return null;
}
