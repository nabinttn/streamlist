import type { Genre } from '../api/types';

export function genreLine(ids: number[], genres: Genre[]): string {
  const m = new Map(genres.map(g => [g.id, g.name]));
  return ids
    .slice(0, 2)
    .map(id => m.get(id))
    .filter((x): x is string => Boolean(x))
    .join(' • ');
}
