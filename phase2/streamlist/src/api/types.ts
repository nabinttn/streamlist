/** TMDB list movie (discover, trending, search, similar). */
export interface ApiMovieListItem {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  overview?: string;
}

export interface PaginatedMoviesResponse {
  page: number;
  results: ApiMovieListItem[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenresListResponse {
  genres: Genre[];
}

export interface ApiMovieDetail {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  runtime: number | null;
  genres: Genre[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CreditsResponse {
  cast: CastMember[];
}
