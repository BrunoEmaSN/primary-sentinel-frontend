import type { Dictionary } from '@/lib/i18n/messages';
import type { DestinationType } from '@/types/destinations';

export function destinationTypeCopy(dict: Dictionary, type: DestinationType) {
  return dict.dashboard.destinations.types[type];
}

export function destinationFieldLabel(dict: Dictionary, type: DestinationType, fieldKey: string): string {
  const bucket = dict.dashboard.destinations.fields[type] as Record<string, string>;
  return bucket[fieldKey] ?? fieldKey;
}
