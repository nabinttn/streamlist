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

  const load = useCallback(async () => {
    setDetailLoading(true);
    setCreditsLoading(true);
    setSimilarLoading(true);
    setDetailErr(null);
    setCreditsErr(null);
    setSimilarErr(null);

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
      setDetailData(null);
      setDetailErr((dRes.reason as NormalizedError).message);
    }
    setDetailLoading(false);

    if (cRes.status === 'fulfilled') {
      setCreditsData(cRes.value);
      setCreditsErr(null);
    } else {
      setCreditsData(null);
      setCreditsErr((cRes.reason as NormalizedError).message);
    }
    setCreditsLoading(false);

    if (sRes.status === 'fulfilled') {
      setSimilarData(sRes.value.results);
      setSimilarErr(null);
    } else {
      setSimilarData(null);
      setSimilarErr((sRes.reason as NormalizedError).message);
    }
    setSimilarLoading(false);
  }, [movieId]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    details: {
      data: detailData,
      loading: detailLoading,
      error: detailErr,
      refetch: load,
    },
    credits: {
      data: creditsData,
      loading: creditsLoading,
      error: creditsErr,
      refetch: load,
    },
    similar: {
      data: similarData ? { results: similarData } : null,
      loading: similarLoading,
      error: similarErr,
      refetch: load,
    },
  };
}
