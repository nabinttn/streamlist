import { useCallback, useEffect, useState } from 'react';
import type { NormalizedError } from '../api/client';
import { fetchTrendingMovies } from '../api/movies';
import type { ApiMovieListItem } from '../api/types';
import type { UseQueryResult } from './types';

interface ExploreData {
  featured: ApiMovieListItem | null;
  grid: ApiMovieListItem[];
}

export function useSearchExplore(): UseQueryResult<ExploreData> {
  const [data, setData] = useState<ExploreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTrendingMovies(1);
      const [featured, ...rest] = res.results;
      setData({
        featured: featured ?? null,
        grid: rest.slice(0, 12),
      });
    } catch (e) {
      setError((e as NormalizedError).message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    error,
    refetch: load,
  };
}
