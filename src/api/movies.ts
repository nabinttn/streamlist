import { client } from './client';
import type {
  ApiMovieDetail,
  ApiMovieListItem,
  CreditsResponse,
  GenresListResponse,
  PaginatedMoviesResponse,
} from './types';

export async function fetchTrendingMovies(page = 1): Promise<PaginatedMoviesResponse> {
  const { data } = await client.get<PaginatedMoviesResponse>(
    '/trending/movie/week',
    { params: { page } },
  );
  return data;
}

export async function fetchTopRatedMovies(page = 1): Promise<PaginatedMoviesResponse> {
  const { data } = await client.get<PaginatedMoviesResponse>('/movie/top_rated', {
    params: { page },
  });
  return data;
}

export async function fetchMovieGenres(): Promise<GenresListResponse> {
  const { data } = await client.get<GenresListResponse>('/genre/movie/list');
  return data;
}

export async function discoverMoviesByGenre(
  genreId: number,
  page = 1,
): Promise<PaginatedMoviesResponse> {
  const { data } = await client.get<PaginatedMoviesResponse>('/discover/movie', {
    params: { with_genres: genreId, page },
  });
  return data;
}

/** "All" chip — popular movies without genre filter. */
export async function fetchDiscoverPopular(page = 1): Promise<PaginatedMoviesResponse> {
  const { data } = await client.get<PaginatedMoviesResponse>('/discover/movie', {
    params: { sort_by: 'popularity.desc', page },
  });
  return data;
}

export async function searchMovies(
  query: string,
  page = 1,
  signal?: AbortSignal,
): Promise<PaginatedMoviesResponse> {
  const { data } = await client.get<PaginatedMoviesResponse>('/search/movie', {
    params: { query, page },
    signal,
  });
  return data;
}

export async function fetchMovieDetail(movieId: number): Promise<ApiMovieDetail> {
  const { data } = await client.get<ApiMovieDetail>(`/movie/${movieId}`);
  return data;
}

export async function fetchMovieCredits(movieId: number): Promise<CreditsResponse> {
  const { data } = await client.get<CreditsResponse>(`/movie/${movieId}/credits`);
  return data;
}

export async function fetchSimilarMovies(
  movieId: number,
  page = 1,
): Promise<PaginatedMoviesResponse> {
  const { data } = await client.get<PaginatedMoviesResponse>(
    `/movie/${movieId}/similar`,
    { params: { page } },
  );
  return data;
}

export type { ApiMovieListItem };
