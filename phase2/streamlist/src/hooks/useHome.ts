import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NormalizedError } from '../api/client';
import {
  fetchDiscoverMovies,
  fetchDiscoverPopular,
  fetchMovieGenres,
  fetchTopRatedMovies,
  fetchTrendingMovies,
} from '../api/movies';
import type { ApiMovieListItem, Genre } from '../api/types';

/**
 * TMDB movie genre ids for home filter chips.
 * Do not resolve these via `/genre/movie/list` name matching — API locale/wording can break lookups.
 * @see https://developer.themoviedb.org/reference/genre-movie-list
 */
const HOME_FILTER_GENRES: readonly { label: string; id: number }[] = [
  { label: 'Action', id: 28 },
  { label: 'Drama', id: 18 },
  { label: 'Comedy', id: 35 },
  { label: 'Sci-Fi', id: 878 },
  { label: 'Horror', id: 27 },
  { label: 'Documentary', id: 99 },
];

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
  const [refreshing, setRefreshing] = useState(false);

  const [trending, setTrending] = useState<RowState>(emptyRow);
  const [topRated, setTopRated] = useState<RowState>(emptyRow);
  const [genreRow, setGenreRow] = useState<RowState>(emptyRow);

  /** Bumped when `selectedGenreId` changes or full refetch — stale responses must not apply. */
  const dataEpochRef = useRef(0);
  const selectedGenreIdRef = useRef<number | null>(null);
  selectedGenreIdRef.current = selectedGenreId;

  const orderedChips = useMemo((): { label: string; id: number | null }[] => {
    return [
      { label: 'All', id: null },
      ...HOME_FILTER_GENRES.map(g => ({ label: g.label, id: g.id })),
    ];
  }, []);

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

  const loadTrendingInitial = useCallback(
    async (epoch: number) => {
      setTrending(s => ({
        ...s,
        items: [],
        page: 0,
        totalPages: 1,
        loading: true,
        loadingMore: false,
        error: null,
      }));
      try {
        const data =
          selectedGenreId === null
            ? await fetchTrendingMovies(1)
            : await fetchDiscoverMovies({
                with_genres: selectedGenreId,
                sort_by: 'popularity.desc',
                page: 1,
              });
        if (epoch !== dataEpochRef.current) {
          return;
        }
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
        if (epoch !== dataEpochRef.current) {
          return;
        }
        setTrending(s => ({
          ...s,
          loading: false,
          error: (e as NormalizedError).message,
          initialLoaded: true,
        }));
      }
    },
    [selectedGenreId],
  );

  const loadTopRatedInitial = useCallback(
    async (epoch: number) => {
      setTopRated(s => ({
        ...s,
        items: [],
        page: 0,
        totalPages: 1,
        loading: true,
        loadingMore: false,
        error: null,
      }));
      try {
        const data =
          selectedGenreId === null
            ? await fetchTopRatedMovies(1)
            : await fetchDiscoverMovies({
                with_genres: selectedGenreId,
                sort_by: 'vote_average.desc',
                vote_count_gte: 200,
                page: 1,
              });
        if (epoch !== dataEpochRef.current) {
          return;
        }
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
        if (epoch !== dataEpochRef.current) {
          return;
        }
        setTopRated(s => ({
          ...s,
          loading: false,
          error: (e as NormalizedError).message,
          initialLoaded: true,
        }));
      }
    },
    [selectedGenreId],
  );

  const loadGenreRowInitial = useCallback(
    async (epoch: number) => {
      setGenreRow(s => ({
        ...s,
        items: [],
        page: 0,
        totalPages: 1,
        loading: true,
        loadingMore: false,
        error: null,
      }));
      try {
        const data =
          selectedGenreId === null
            ? await fetchDiscoverPopular(1)
            : await fetchDiscoverMovies({
                with_genres: selectedGenreId,
                sort_by: 'primary_release_date.desc',
                page: 1,
              });
        if (epoch !== dataEpochRef.current) {
          return;
        }
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
        if (epoch !== dataEpochRef.current) {
          return;
        }
        setGenreRow(s => ({
          ...s,
          loading: false,
          error: (e as NormalizedError).message,
          initialLoaded: true,
        }));
      }
    },
    [selectedGenreId],
  );

  useEffect(() => {
    const epoch = ++dataEpochRef.current;
    loadTrendingInitial(epoch).catch(() => {
      /* errors in row state */
    });
    loadTopRatedInitial(epoch).catch(() => {
      /* errors in row state */
    });
    loadGenreRowInitial(epoch).catch(() => {
      /* errors in row state */
    });
  }, [selectedGenreId, loadTrendingInitial, loadTopRatedInitial, loadGenreRowInitial]);

  const loadMoreTrending = useCallback(() => {
    const gid = selectedGenreId;
    setTrending(s => {
      if (s.loadingMore || s.page >= s.totalPages || s.page < 1) {
        return s;
      }
      const nextPage = s.page + 1;
      const req =
        gid === null
          ? fetchTrendingMovies(nextPage)
          : fetchDiscoverMovies({
              with_genres: gid,
              sort_by: 'popularity.desc',
              page: nextPage,
            });
      req
        .then(data => {
          if (selectedGenreIdRef.current !== gid) {
            return;
          }
          setTrending(prev => ({
            ...prev,
            items: [...prev.items, ...data.results],
            page: data.page,
            totalPages: data.total_pages,
            loadingMore: false,
          }));
        })
        .catch(e => {
          if (selectedGenreIdRef.current !== gid) {
            return;
          }
          setTrending(prev => ({
            ...prev,
            loadingMore: false,
            error: (e as NormalizedError).message,
          }));
        });
      return { ...s, loadingMore: true };
    });
  }, [selectedGenreId]);

  const loadMoreTopRated = useCallback(() => {
    const gid = selectedGenreId;
    setTopRated(s => {
      if (s.loadingMore || s.page >= s.totalPages || s.page < 1) {
        return s;
      }
      const nextPage = s.page + 1;
      const req =
        gid === null
          ? fetchTopRatedMovies(nextPage)
          : fetchDiscoverMovies({
              with_genres: gid,
              sort_by: 'vote_average.desc',
              vote_count_gte: 200,
              page: nextPage,
            });
      req
        .then(data => {
          if (selectedGenreIdRef.current !== gid) {
            return;
          }
          setTopRated(prev => ({
            ...prev,
            items: [...prev.items, ...data.results],
            page: data.page,
            totalPages: data.total_pages,
            loadingMore: false,
          }));
        })
        .catch(e => {
          if (selectedGenreIdRef.current !== gid) {
            return;
          }
          setTopRated(prev => ({
            ...prev,
            loadingMore: false,
            error: (e as NormalizedError).message,
          }));
        });
      return { ...s, loadingMore: true };
    });
  }, [selectedGenreId]);

  const loadMoreGenre = useCallback(() => {
    const gid = selectedGenreId;
    setGenreRow(s => {
      if (s.loadingMore || s.page >= s.totalPages || s.page < 1) {
        return s;
      }
      const nextPage = s.page + 1;
      const req =
        gid === null
          ? fetchDiscoverPopular(nextPage)
          : fetchDiscoverMovies({
              with_genres: gid,
              sort_by: 'primary_release_date.desc',
              page: nextPage,
            });
      req
        .then(data => {
          if (selectedGenreIdRef.current !== gid) {
            return;
          }
          setGenreRow(prev => ({
            ...prev,
            items: [...prev.items, ...data.results],
            page: data.page,
            totalPages: data.total_pages,
            loadingMore: false,
          }));
        })
        .catch(e => {
          if (selectedGenreIdRef.current !== gid) {
            return;
          }
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

  /** Third home row: global popular vs newest-in-genre (distinct from row 1 popularity). */
  const thirdRowTitle = useMemo(() => {
    return selectedGenreId === null ? 'Popular' : 'Latest';
  }, [selectedGenreId]);

  const refetchAllHomeRows = useCallback(() => {
    const epoch = ++dataEpochRef.current;
    loadTrendingInitial(epoch).catch(() => {
      /* errors in row state */
    });
    loadTopRatedInitial(epoch).catch(() => {
      /* errors in row state */
    });
    loadGenreRowInitial(epoch).catch(() => {
      /* errors in row state */
    });
  }, [loadTrendingInitial, loadTopRatedInitial, loadGenreRowInitial]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const epoch = ++dataEpochRef.current;
      await Promise.all([
        loadTrendingInitial(epoch),
        loadTopRatedInitial(epoch),
        loadGenreRowInitial(epoch),
        (async () => {
          try {
            const data = await fetchMovieGenres();
            setGenres(data.genres);
            setGenresError(null);
          } catch (e) {
            setGenresError((e as NormalizedError).message);
          }
        })(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [loadTrendingInitial, loadTopRatedInitial, loadGenreRowInitial]);

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
    thirdRowTitle,
    loadMoreTrending,
    loadMoreTopRated,
    loadMoreGenre,
    refetchAllHomeRows,
    refreshing,
    onRefresh,
  };
}
