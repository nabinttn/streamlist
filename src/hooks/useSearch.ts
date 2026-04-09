import { useCallback, useEffect, useRef, useState } from 'react';
import type { NormalizedError } from '../api/client';
import { searchMovies } from '../api/movies';
import type { ApiMovieListItem } from '../api/types';
import type { UseQueryResult } from './types';

const DEBOUNCE_MS = 400;

interface SearchState {
  query: string;
  /** Trimmed query after debounce; drives API calls and result copy. */
  debouncedQuery: string;
  setQuery: (q: string) => void;
  result: UseQueryResult<{ results: ApiMovieListItem[]; totalResults: number }>;
}

export function useSearch(): SearchState {
  const [query, setQueryState] = useState('');
  const [debounced, setDebounced] = useState('');
  const [results, setResults] = useState<ApiMovieListItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setDebounced(query.trim());
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query]);

  const fetchResults = useCallback(async () => {
    if (!debounced) {
      setResults([]);
      setTotalResults(0);
      setError(null);
      setLoading(false);
      return;
    }
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);
    setError(null);
    try {
      const data = await searchMovies(debounced, 1, ac.signal);
      if (!ac.signal.aborted) {
        setResults(data.results);
        setTotalResults(data.total_results);
      }
    } catch (e) {
      if ((e as { name?: string }).name === 'CanceledError' || (e as Error).message === 'canceled') {
        return;
      }
      const err = e as NormalizedError;
      setError(err.message ?? 'Search failed');
      setResults([]);
      setTotalResults(0);
    } finally {
      if (!ac.signal.aborted) {
        setLoading(false);
      }
    }
  }, [debounced]);

  useEffect(() => {
    fetchResults();
  }, [debounced, fetchResults]);

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
  }, []);

  const refetch = useCallback(() => {
    fetchResults();
  }, [fetchResults]);

  return {
    query,
    debouncedQuery: debounced,
    setQuery,
    result: {
      data:
        debounced.length > 0
          ? { results, totalResults }
          : null,
      loading,
      error,
      refetch,
    },
  };
}
