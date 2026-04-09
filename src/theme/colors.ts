/** "The Cinematic Curator" — all UI colors must come from here (no hex in components). */
export const colors = {
  surface: '#131313',
  surface_container_lowest: '#0E0E0E',
  surface_container_low: '#1C1B1B',
  surface_container: '#232323',
  surface_container_high: '#2A2A2A',
  surface_container_highest: '#353534',
  surface_bright: '#3A3939',
  primary: '#FFB3AE',
  primary_container: '#FF5351',
  secondary_container: '#822625',
  on_surface: '#E5E2E1',
  on_surface_variant: '#E4BDBA',
  outline_variant: 'rgba(255,255,255,0.15)',
} as const;

export type ColorName = keyof typeof colors;
