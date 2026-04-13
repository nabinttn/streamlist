export function formatYear(isoDate: string | undefined): string {
  if (!isoDate || isoDate.length < 4) {
    return '';
  }
  return isoDate.slice(0, 4);
}

export function formatRuntime(minutes: number | null | undefined): string {
  if (minutes == null || minutes <= 0) {
    return '';
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h <= 0) {
    return `${m}m`;
  }
  if (m === 0) {
    return `${h}h`;
  }
  return `${h}h ${m}m`;
}
