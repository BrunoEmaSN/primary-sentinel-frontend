import { diffJson } from 'diff';

/** Fragmento devuelto por `diffJson` (snapshot vs payload DLQ). */
export type JsonDiffPart = {
  value: string;
  added?: boolean;
  removed?: boolean;
};

/**
 * Diff semántico JSON: `left` = snapshot (referencia), `right` = payload actual en DLQ.
 * Claves ordenadas internamente por la librería para comparación estable.
 */
function asDiffInput(v: unknown): object | string {
  if (v !== null && typeof v === 'object') return v as object;
  return JSON.stringify(v);
}

export function jsonDiffSnapshotVsDlq(left: unknown, right: unknown): JsonDiffPart[] {
  return diffJson(asDiffInput(left), asDiffInput(right)) as JsonDiffPart[];
}
