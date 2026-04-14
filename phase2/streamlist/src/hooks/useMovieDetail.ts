import { useCallback, useEffect, useState } from 'react';
import type { NormalizedError } from '../api/client';
import {
  fetchMovieCredits,
  fetchMovieDetail,
  fetchMovieVideos,
  fetchSimilarMovies,
} from '../api/movies';
import type {
  ApiMovieDetail,
  ApiMovieListItem,
  CreditsResponse,
} from '../api/types';
import { pickYoutubeTrailerKey } from '../utils/trailer';
import type { UseQueryResult } from './types';

export interface MovieVideosData {
  trailerYoutubeKey: string | null;
}

interface MovieDetailBundle {
  details: UseQueryResult<ApiMovieDetail>;
  credits: UseQueryResult<CreditsResponse>;
  similar: UseQueryResult<{ results: ApiMovieListItem[] }>;
  videos: UseQueryResult<MovieVideosData>;
  /** Pull-to-refresh: soft reload without clearing existing content or toggling section spinners. */
  pullToRefresh: { refreshing: boolean; onRefresh: () => Promise<void> };
}

export function useMovieDetail(movieId: number): MovieDetailBundle {
  const [detailData, setDetailData] = useState<ApiMovieDetail | null>(null);
  const [creditsData, setCreditsData] = useState<CreditsResponse | null>(null);
  const [similarData, setSimilarData] = useState<ApiMovieListItem[] | null>(
    null,
  );
  const [videosData, setVideosData] = useState<MovieVideosData | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [detailErr, setDetailErr] = useState<string | null>(null);
  const [creditsErr, setCreditsErr] = useState<string | null>(null);
  const [similarErr, setSimilarErr] = useState<string | null>(null);
  const [videosErr, setVideosErr] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (soft = false) => {
    if (!soft) {
      setDetailLoading(true);
      setCreditsLoading(true);
      setSimilarLoading(true);
      setVideosLoading(true);
      setDetailErr(null);
      setCreditsErr(null);
      setSimilarErr(null);
      setVideosErr(null);
    }

    const results = await Promise.allSettled([
      fetchMovieDetail(movieId),
      fetchMovieCredits(movieId),
      fetchSimilarMovies(movieId, 1),
      fetchMovieVideos(movieId),
    ]);

    const [dRes, cRes, sRes, vRes] = results;

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

    if (vRes.status === 'fulfilled') {
      setVideosData({
        trailerYoutubeKey: pickYoutubeTrailerKey(vRes.value.results),
      });
      setVideosErr(null);
    } else {
      if (!soft) {
        setVideosData(null);
      }
      setVideosErr((vRes.reason as NormalizedError).message);
    }
    setVideosLoading(false);
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
    videos: {
      data: videosData,
      loading: videosLoading,
      error: videosErr,
      refetch: refetchHard,
    },
    pullToRefresh: { refreshing, onRefresh },
  };
}
