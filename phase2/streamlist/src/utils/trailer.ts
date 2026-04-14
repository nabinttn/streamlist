import type { MovieVideo } from '../api/types';

const YOUTUBE = 'YouTube';

/**
 * Picks a YouTube video id for in-app playback. Only `site === "YouTube"` entries are considered.
 * Priority: official Trailer, Trailer, official Teaser, Teaser.
 */
export function pickYoutubeTrailerKey(videos: MovieVideo[]): string | null {
  const yt = videos.filter(v => v.site === YOUTUBE);
  const findKey = (match: (v: MovieVideo) => boolean): string | null => {
    const hit = yt.find(match);
    return hit?.key ?? null;
  };

  return (
    findKey(v => v.type === 'Trailer' && v.official) ??
    findKey(v => v.type === 'Trailer') ??
    findKey(v => v.type === 'Teaser' && v.official) ??
    findKey(v => v.type === 'Teaser')
  );
}
