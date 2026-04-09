import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface WatchlistItem {
  id: number;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate: string;
  genreIds: number[];
  mediaType: 'movie' | 'tv';
}

interface WatchlistState {
  items: WatchlistItem[];
  hydrated: boolean;
  addItem: (item: WatchlistItem) => void;
  removeItem: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      addItem: item =>
        set(state => {
          if (state.items.some(i => i.id === item.id)) {
            return state;
          }
          return { items: [...state.items, item] };
        }),
      removeItem: id =>
        set(state => ({
          items: state.items.filter(i => i.id !== id),
        })),
      isInWatchlist: id => get().items.some(i => i.id === id),
    }),
    {
      name: 'streamlist-watchlist',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ items: state.items }),
    },
  ),
);

export function selectWatchlistCount(state: WatchlistState): number {
  return state.items.length;
}
