import { useCallback, useEffect, useState } from 'react';
import type { NormalizedError } from '../api/client';
import {
  fetchMovieCredits,
  fetchMovieDetail,
  fetchSimilarMovies,
} from '../api/movies';
import type {
  ApiMovieDetail,
  ApiMovieListItem,
  CreditsResponse,
} from '../api/types';
import type { UseQueryResult } from './types';

interface MovieDetailBundle {
  details: UseQueryResult<ApiMovieDetail>;
  credits: UseQueryResult<CreditsResponse>;
  similar: UseQueryResult<{ results: ApiMovieListItem[] }>;
  /** Pull-to-refresh: soft reload without clearing existing content or toggling section spinners. */
  pullToRefresh: { refreshing: boolean; onRefresh: () => Promise<void> };
}

export function useMovieDetail(movieId: number): MovieDetailBundle {
  const [detailData, setDetailData] = useState<ApiMovieDetail | null>(null);
  const [creditsData, setCreditsData] = useState<CreditsResponse | null>(null);
  const [similarData, setSimilarData] = useState<ApiMovieListItem[] | null>(
    null,
  );
  const [detailLoading, setDetailLoading] = useState(true);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [detailErr, setDetailErr] = useState<string | null>(null);
  const [creditsErr, setCreditsErr] = useState<string | null>(null);
  const [similarErr, setSimilarErr] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (soft = false) => {
    if (!soft) {
      setDetailLoading(true);
      setCreditsLoading(true);
      setSimilarLoading(true);
      setDetailErr(null);
      setCreditsErr(null);
      setSimilarErr(null);
    }

    const results = await Promise.allSettled([
      fetchMovieDetail(movieId),
      fetchMovieCredits(movieId),
      fetchSimilarMovies(movieId, 1),
    ]);

    const [dRes, cRes, sRes] = results;

    if (dRes.status === 'fulfilled') {
      setDetailData(dRes.value);
      setDetailErr(null);
    } else {
      if (!soft) {
        setDetailData(null);
      }
      setDetailErr((dRes.reason as NormalizedError).message);
    }
    setDetailLoading(false);

    if (cRes.status === 'fulfilled') {
      setCreditsData(cRes.value);
      setCreditsErr(null);
    } else {
      if (!soft) {
        setCreditsData(null);
      }
      setCreditsErr((cRes.reason as NormalizedError).message);
    }
    setCreditsLoading(false);

    if (sRes.status === 'fulfilled') {
      setSimilarData(sRes.value.results);
      setSimilarErr(null);
    } else {
      if (!soft) {
        setSimilarData(null);
      }
      setSimilarErr((sRes.reason as NormalizedError).message);
    }
    setSimilarLoading(false);
  }, [movieId]);

  useEffect(() => {
    load(false).catch(() => {
      /* errors surfaced via hook state */
    });
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load(true);
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const refetchHard = useCallback(() => load(false), [load]);

  return {
    details: {
      data: detailData,
      loading: detailLoading,
      error: detailErr,
      refetch: refetchHard,
    },
    credits: {
      data: creditsData,
      loading: creditsLoading,
      error: creditsErr,
      refetch: refetchHard,
    },
    similar: {
      data: similarData ? { results: similarData } : null,
      loading: similarLoading,
      error: similarErr,
      refetch: refetchHard,
    },
    pullToRefresh: { refreshing, onRefresh },
  };
}
