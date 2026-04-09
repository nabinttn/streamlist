import { TMDB_IMAGE_BASE_URL } from '@env';

/**
 * Build a TMDB image URL, or null if path is missing (never return a broken URL).
 */
export function posterUrl(
  path: string | null,
  size: 'w185' | 'w342' | 'w780' = 'w342',
): string | null {
  if (!path || path.length === 0) {
    return null;
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
