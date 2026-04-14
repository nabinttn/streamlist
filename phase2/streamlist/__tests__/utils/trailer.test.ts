import type { MovieVideo } from '../../src/api/types';
import { pickYoutubeTrailerKey } from '../../src/utils/trailer';

function v(partial: Partial<MovieVideo> & Pick<MovieVideo, 'key' | 'type'>): MovieVideo {
  return {
    id: '1',
    name: 'x',
    site: 'YouTube',
    official: false,
    ...partial,
  };
}

describe('pickYoutubeTrailerKey', () => {
  it('returns null for empty list', () => {
    expect(pickYoutubeTrailerKey([])).toBeNull();
  });

  it('ignores non-YouTube sites', () => {
    const videos: MovieVideo[] = [
      v({ key: 'vimeo1', type: 'Trailer', site: 'Vimeo', official: true }),
    ];
    expect(pickYoutubeTrailerKey(videos)).toBeNull();
  });

  it('prefers official Trailer over non-official Trailer', () => {
    const videos: MovieVideo[] = [
      v({ key: 'b', type: 'Trailer', official: false }),
      v({ key: 'a', type: 'Trailer', official: true }),
    ];
    expect(pickYoutubeTrailerKey(videos)).toBe('a');
  });

  it('prefers Trailer over Teaser', () => {
    const videos: MovieVideo[] = [
      v({ key: 'teaser', type: 'Teaser', official: true }),
      v({ key: 'trail', type: 'Trailer', official: false }),
    ];
    expect(pickYoutubeTrailerKey(videos)).toBe('trail');
  });

  it('uses official Teaser before non-official Teaser', () => {
    const videos: MovieVideo[] = [
      v({ key: 't2', type: 'Teaser', official: false }),
      v({ key: 't1', type: 'Teaser', official: true }),
    ];
    expect(pickYoutubeTrailerKey(videos)).toBe('t1');
  });

  it('uses first match order in list for same tier', () => {
    const videos: MovieVideo[] = [
      v({ key: 'first', type: 'Trailer', official: true }),
      v({ key: 'second', type: 'Trailer', official: true }),
    ];
    expect(pickYoutubeTrailerKey(videos)).toBe('first');
  });
});
