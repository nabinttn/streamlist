/** "The Cinematic Curator" — all UI colors must come from here (no hex in components). */
export const colors = {
  /** Stitch top bar / brand wordmark + movie icon accent */
  brand: '#E5383B',
  /** Text on `brand` solid fills (e.g. active “All” chip in `07-home-nav`). */
  on_brand: '#FFFFFF',
  surface: '#131313',
  surface_container_lowest: '#0E0E0E',
  surface_container_low: '#1C1B1B',
  surface_container: '#232323',
  surface_container_high: '#2A2A2A',
  surface_container_highest: '#353534',
  surface_bright: '#3A3939',
  primary: '#FFB3AE',
  primary_container: '#FF5351',
  /** Text / icons on primary-filled or primary-gradient CTAs (Stitch Cinema Noir). */
  on_primary: '#68000b',
  secondary_container: '#822625',
  on_surface: '#E5E2E1',
  on_surface_variant: '#E4BDBA',
  /**
   * Bottom tab — inactive icon + label (Stitch: `text-on_surface_variant` + `opacity-60`).
   */
  tab_bar_inactive: 'rgba(228, 189, 186, 0.6)',
  outline_variant: 'rgba(255,255,255,0.15)',
  /** Hero “Details” — `bg-surface-container-highest/80` (`07-home-nav`). */
  hero_secondary_cta_bg: 'rgba(53, 53, 52, 0.82)',
  /** Hero “Details” — `border-white/5`. */
  hero_secondary_cta_border: 'rgba(255, 255, 255, 0.05)',
} as const;

export type ColorName = keyof typeof colors;
