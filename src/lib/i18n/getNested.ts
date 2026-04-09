/** Obtiene string por ruta tipo `auth.loginTitle` en objeto anidado. */
export function getNestedString(obj: unknown, path: string): string | undefined {
  const parts = path.split('.').filter(Boolean);
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur !== null && typeof cur === 'object' && p in cur) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return typeof cur === 'string' ? cur : undefined;
}
