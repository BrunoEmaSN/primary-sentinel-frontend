import { DESTINATION_CONFIGS, type DestinationType } from '@/types/destinations';

/** Ancho explícito: el índice `[number]` sobre configs `as const` colapsa mal el union de `type`. */
type DestinationFormField = {
  key: string;
  label: string;
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
  field: DestinationFormField,
  v: unknown
): string | null {
  if (!field.required) return null;
  switch (field.type) {
    case 'number':
      if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) {
        return `${metaLabel}: «${field.label}» es obligatorio.`;
      }
      return null;
    case 'checkbox':
      if (v === undefined) {
        return `${metaLabel}: «${field.label}» es obligatorio.`;
      }
      return null;
    case 'url':
      if (!isNonEmptyString(v)) {
        return `${metaLabel}: «${field.label}» es obligatorio.`;
      }
      if (!isValidHttpUrl(String(v).trim())) {
        return `${metaLabel}: «${field.label}» debe ser una URL http(s) válida.`;
      }
      return null;
    default:
      if (!isNonEmptyString(v)) {
        return `${metaLabel}: «${field.label}» es obligatorio.`;
      }
      return null;
  }
}

/**
 * Valida que el destino tenga todos los campos marcados como `required` en DESTINATION_CONFIGS.
 */
export function validateDestinationRequiredFields(
  type: DestinationType,
  config: unknown
): string | null {
  if (config === null || typeof config !== 'object' || Array.isArray(config)) {
    return 'Falta la configuración de un destino.';
  }
  const c = config as Record<string, unknown>;
  if (c.type !== type) {
    return 'Configuración de destino inconsistente.';
  }
  const meta = DESTINATION_CONFIGS[type];
  for (const field of meta.fields) {
    const err = requiredFieldError(meta.label, field as DestinationFormField, c[field.key]);
    if (err) return err;
  }
  return null;
}
