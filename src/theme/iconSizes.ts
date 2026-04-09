/**
 * Icon sizes aligned with Stitch HTML (Material Symbols, tailwind text-* where noted).
 */
export const iconSize = {
  /** Bottom tab bar — design uses ~24dp glyphs */
  tab: 24,
  /** Top app bar: movie logo `text-2xl`, notifications */
  topBar: 24,
  topBarLogo: 24,
  /** Inline search field magnifier */
  searchField: 22,
  /** Hero “Watch Now” play_arrow — scales with `typography.ctaBold` (`07-home-nav`). */
  ctaPlay: 20,
  /** Watchlist empty state `text-8xl` → 96px */
  emptyStateBookmark: 96,
  /** Detail back control */
  detailBack: 24,
  /** Detail watchlist CTAs — align with Home hero icon scale (`ctaPlay`). */
  detailWatchlist: 20,
} as const;
