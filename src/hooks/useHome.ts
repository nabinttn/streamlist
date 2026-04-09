import { useCallback, useEffect, useMemo, useState } from 'react';
import type { NormalizedError } from '../api/client';
import {
  discoverMoviesByGenre,
  fetchDiscoverPopular,
  fetchMovieGenres,
  fetchTopRatedMovies,
  fetchTrendingMovies,
} from '../api/movies';
import type { ApiMovieListItem, Genre } from '../api/types';

const CHIP_ORDER = [
  'All',
  'Action',
  'Drama',
  'Comedy',
  'Science Fiction',
  'Horror',
  'Documentary',
] as const;

interface RowState {
  items: ApiMovieListItem[];
  page: number;
  totalPages: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  initialLoaded: boolean;
}

function emptyRow(): RowState {
  return {
    items: [],
    page: 0,
    totalPages: 1,
    loading: true,
    loadingMore: false,
    error: null,
    initialLoaded: false,
  };
}

export function useHome() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genresError, setGenresError] = useState<string | null>(null);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);

  const [trending, setTrending] = useState<RowState>(emptyRow);
  const [topRated, setTopRated] = useState<RowState>(emptyRow);
  const [genreRow, setGenreRow] = useState<RowState>(emptyRow);

  const orderedChips = useMemo(() => {
    const byName = new Map(genres.map(g => [g.name.toLowerCase(), g]));
    const list: { label: string; id: number | null }[] = [{ label: 'All', id: null }];
    for (const name of CHIP_ORDER.slice(1)) {
      const g = byName.get(name.toLowerCase());
      if (g) {
        list.push({
          label: name === 'Science Fiction' ? 'Sci-Fi' : g.name,
          id: g.id,
        });
      }
    }
    return list;
  }, [genres]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchMovieGenres();
        if (!cancelled) {
          setGenres(data.genres);
        }
      } catch (e) {
        if (!cancelled) {
          setGenresError((e as NormalizedError).message);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadTrendingInitial = useCallback(async () => {
    setTrending(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetchTrendingMovies(1);
      setTrending({
        items: data.results,
        page: 1,
        totalPages: data.total_pages,
        loading: false,
        loadingMore: false,
        error: null,
        initialLoaded: true,
      });
    } catch (e) {
      setTrending(s => ({
        ...s,
        loading: false,
        error: (e as NormalizedError).message,
        initialLoaded: true,
      }));
    }
  }, []);

  const loadTopRatedInitial = useCallback(async () => {
    setTopRated(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetchTopRatedMovies(1);
      setTopRated({
        items: data.results,
        page: 1,
        totalPages: data.total_pages,
        loading: false,
        loadingMore: false,
        error: null,
        initialLoaded: true,
      });
    } catch (e) {
      setTopRated(s => ({
        ...s,
        loading: false,
        error: (e as NormalizedError).message,
        initialLoaded: true,
      }));
    }
  }, []);

  const loadGenreRowInitial = useCallback(async () => {
    setGenreRow(s => ({ ...s, loading: true, error: null }));
    try {
      const data =
        selectedGenreId === null
          ? await fetchDiscoverPopular(1)
          : await discoverMoviesByGenre(selectedGenreId, 1);
      setGenreRow({
        items: data.results,
        page: 1,
        totalPages: data.total_pages,
        loading: false,
        loadingMore: false,
        error: null,
        initialLoaded: true,
      });
    } catch (e) {
      setGenreRow(s => ({
        ...s,
        loading: false,
        error: (e as NormalizedError).message,
        initialLoaded: true,
      }));
    }
  }, [selectedGenreId]);

  useEffect(() => {
    loadTrendingInitial();
  }, [loadTrendingInitial]);

  useEffect(() => {
    loadTopRatedInitial();
  }, [loadTopRatedInitial]);

  useEffect(() => {
    loadGenreRowInitial();
  }, [loadGenreRowInitial]);

  const loadMoreTrending = useCallback(() => {
    setTrending(s => {
      if (s.loadingMore || s.page >= s.totalPages || s.page < 1) {
        return s;
      }
      const nextPage = s.page + 1;
      fetchTrendingMovies(nextPage)
        .then(data => {
          setTrending(prev => ({
            ...prev,
            items: [...prev.items, ...data.results],
            page: data.page,
            totalPages: data.total_pages,
            loadingMore: false,
          }));
        })
        .catch(e => {
          setTrending(prev => ({
            ...prev,
            loadingMore: false,
            error: (e as NormalizedError).message,
          }));
        });
      return { ...s, loadingMore: true };
    });
  }, []);

  const loadMoreTopRated = useCallback(() => {
    setTopRated(s => {
      if (s.loadingMore || s.page >= s.totalPages || s.page < 1) {
        return s;
      }
      const nextPage = s.page + 1;
      fetchTopRatedMovies(nextPage)
        .then(data => {
          setTopRated(prev => ({
            ...prev,
            items: [...prev.items, ...data.results],
            page: data.page,
            totalPages: data.total_pages,
            loadingMore: false,
          }));
        })
        .catch(e => {
          setTopRated(prev => ({
            ...prev,
            loadingMore: false,
            error: (e as NormalizedError).message,
          }));
        });
      return { ...s, loadingMore: true };
    });
  }, []);

  const loadMoreGenre = useCallback(() => {
    setGenreRow(s => {
      if (s.loadingMore || s.page >= s.totalPages || s.page < 1) {
        return s;
      }
      const nextPage = s.page + 1;
      const fetchPage =
        selectedGenreId === null
          ? fetchDiscoverPopular(nextPage)
          : discoverMoviesByGenre(selectedGenreId, nextPage);
      fetchPage
        .then(data => {
          setGenreRow(prev => ({
            ...prev,
            items: [...prev.items, ...data.results],
            page: data.page,
            totalPages: data.total_pages,
            loadingMore: false,
          }));
        })
        .catch(e => {
          setGenreRow(prev => ({
            ...prev,
            loadingMore: false,
            error: (e as NormalizedError).message,
          }));
        });
      return { ...s, loadingMore: true };
    });
  }, [selectedGenreId]);

  const hero = trending.items[0] ?? null;

  const genreRowTitle = useMemo(() => {
    if (selectedGenreId === null) {
      return 'Popular';
    }
    const g = genres.find(x => x.id === selectedGenreId);
    return g?.name ?? 'Movies';
  }, [selectedGenreId, genres]);

  const refetchTrending = loadTrendingInitial;
  const refetchTopRated = loadTopRatedInitial;
  const refetchGenreRow = loadGenreRowInitial;

  return {
    genres,
    genresError,
    orderedChips,
    selectedGenreId,
    setSelectedGenreId,
    hero,
    trending,
    topRated,
    genreRow,
    genreRowTitle,
    loadMoreTrending,
    loadMoreTopRated,
    loadMoreGenre,
    refetchTrending,
    refetchTopRated,
    refetchGenreRow,
  };
}
