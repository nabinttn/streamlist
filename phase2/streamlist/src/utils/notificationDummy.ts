/** Dummy notifications for the notifications screen (no network). */

export interface DummyNotification {
  id: string;
  title: string;
  body: string;
  /** Epoch ms */
  at: number;
}

function startOfLocalWeek(now: Date): Date {
  const d = new Date(now);
  const day = d.getDay();
  const diffFromMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffFromMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isInThisWeekNotToday(at: number, now: Date): boolean {
  const d = new Date(at);
  if (isSameCalendarDay(d, now)) {
    return false;
  }
  const sow = startOfLocalWeek(now);
  const weekEnd = new Date(sow);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return d >= sow && d < weekEnd;
}

function isEarlierThanThisWeek(at: number, now: Date): boolean {
  const d = new Date(at);
  return d < startOfLocalWeek(now);
}

export function bucketNotifications(
  items: DummyNotification[],
  now: Date = new Date(),
): {
  today: DummyNotification[];
  thisWeek: DummyNotification[];
  earlier: DummyNotification[];
} {
  const today: DummyNotification[] = [];
  const thisWeek: DummyNotification[] = [];
  const earlier: DummyNotification[] = [];

  for (const n of items) {
    const d = new Date(n.at);
    if (isSameCalendarDay(d, now)) {
      today.push(n);
    } else if (isInThisWeekNotToday(n.at, now)) {
      thisWeek.push(n);
    } else if (isEarlierThanThisWeek(n.at, now)) {
      earlier.push(n);
    } else {
      // Future or edge — keep visible under This week for demo consistency
      thisWeek.push(n);
    }
  }

  const byTimeDesc = (a: DummyNotification, b: DummyNotification) => b.at - a.at;
  today.sort(byTimeDesc);
  thisWeek.sort(byTimeDesc);
  earlier.sort(byTimeDesc);

  return { today, thisWeek, earlier };
}

const TITLE_PARTS = [
  'New arrivals',
  'Reminder',
  'Watchlist',
  'Trending',
  'Recommendation',
  'Continue watching',
] as const;

const BODIES = [
  'Fresh picks matched to your taste.',
  'Your saved title is available in your region.',
  'A title you liked has a new season.',
  'Popular this week on StreamList.',
  'Because you enjoyed similar stories.',
  'Pick up where you left off.',
] as const;

/** Initial set: some today, some this week (same Mon–Sun window, not today), none earlier. */
export function createInitialDummyNotifications(now: Date = new Date()): DummyNotification[] {
  const out: DummyNotification[] = [];
  let i = 0;

  for (const h of [1, 3, 8]) {
    i += 1;
    const d = new Date(now);
    d.setHours(d.getHours() - h);
    out.push({
      id: `t-${i}`,
      title: `${TITLE_PARTS[i % TITLE_PARTS.length]}`,
      body: BODIES[i % BODIES.length],
      at: d.getTime(),
    });
  }

  const sow = startOfLocalWeek(now);
  let weekAdded = 0;
  for (let day = 0; day < 7 && weekAdded < 5; day += 1) {
    const d = new Date(sow);
    d.setDate(sow.getDate() + day);
    d.setHours(10, 30, 0, 0);
    if (d > now) {
      continue;
    }
    if (isSameCalendarDay(d, now)) {
      continue;
    }
    i += 1;
    weekAdded += 1;
    out.push({
      id: `w-${i}`,
      title: `${TITLE_PARTS[(i + 2) % TITLE_PARTS.length]}`,
      body: BODIES[(i + 1) % BODIES.length],
      at: d.getTime(),
    });
  }

  return out;
}

/** Older pages for infinite scroll (dated before this calendar week). */
export function generateOlderNotificationsPage(
  page: number,
  now: Date = new Date(),
): DummyNotification[] {
  const start = startOfLocalWeek(now);
  const baseDayOffset = 7 + page * 12;
  const batch: DummyNotification[] = [];
  for (let k = 0; k < 12; k += 1) {
    const dayOffset = baseDayOffset + k;
    const d = new Date(start);
    d.setDate(d.getDate() - dayOffset);
    d.setHours(9 + (k % 8), (k * 5) % 55, 0, 0);
    const idx = page * 12 + k;
    batch.push({
      id: `p${page}-i${k}`,
      title: `${TITLE_PARTS[idx % TITLE_PARTS.length]}`,
      body: BODIES[(idx + 2) % BODIES.length],
      at: d.getTime(),
    });
  }
  return batch;
}

export const MAX_DUMMY_PAGES = 8;

export function formatNotificationTime(at: number): string {
  const d = new Date(at);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
