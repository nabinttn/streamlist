import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'STREAMLIST_RECENT_SEARCHES';
const MAX = 5;

export function useRecentSearches() {
  const [items, setItems] = useState<string[]>([]);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        setItems(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addSearch = useCallback(
    async (term: string) => {
      const t = term.trim();
      if (!t) {
        return;
      }
      setItems(prev => {
        const next = [t, ...prev.filter(x => x.toLowerCase() !== t.toLowerCase())].slice(
          0,
          MAX,
        );
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    [],
  );

  const clearAll = useCallback(async () => {
    setItems([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return { items, addSearch, clearAll, reload: load };
}
