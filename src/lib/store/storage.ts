export const storage = {
  read<T>(key: string): T | null {
    try {
      if (typeof window === 'undefined') return null;
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  write(key: string, value: unknown): void {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove(key: string): void {
    try {
      if (typeof window !== 'undefined') window.localStorage.removeItem(key);
    } catch {}
  },
};
