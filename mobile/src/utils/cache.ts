/** Small in-memory stale-while-revalidate cache for list responses. */
type Entry<T> = { value: T; updatedAt: number };
const entries = new Map<string, Entry<unknown>>();

export function getCached<T>(key: string, maxAgeMs = 60_000): T | undefined {
  const entry = entries.get(key) as Entry<T> | undefined;
  if (!entry) return undefined;
  if (Date.now() - entry.updatedAt > maxAgeMs) {
    entries.delete(key);
    return undefined;
  }
  return entry.value;
}

export function setCached<T>(key: string, value: T): void {
  entries.set(key, { value, updatedAt: Date.now() });
}

export function clearCache(key?: string): void {
  if (key) entries.delete(key);
  else entries.clear();
}
