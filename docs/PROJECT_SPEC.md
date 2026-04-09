# Streamlist — Project Specification (Local)

**Course reference:** [AI-First Development — Phase 2 `project-spec.md`](https://github.com/NaveenSinghTTN/ai-first-dev-training-mobile/blob/main/phase-2/project-spec.md). This document is the **Streamlist** contract: same product and stack as the course spec, with repo-local notes only. For full screen specs, API tables, and rubric, use the upstream link.

## Product

React Native **OTT discovery and watchlist** app (no video playback): browse TMDB content, search, detail, and a persisted personal watchlist.

## Technical stack (non-negotiable)

| Area | Decision |
|------|------------|
| Framework | React Native **CLI** (not Expo) |
| Language | TypeScript **`strict`** — no `any` |
| Navigation | **React Navigation v6** — bottom tabs + **nested stack per tab** (Detail returns to correct tab) |
| State | **Zustand** + **`persist`** + **AsyncStorage** for watchlist |
| API | **Axios** only via **`src/api/client.ts`**; endpoint helpers in **`src/api/movies.ts`** |
| Styling | **`StyleSheet.create()` only** — no NativeWind, Styled Components, or UI kits |
| Fonts | **Manrope** + **Inter** (e.g. `@expo-google-fonts` / `react-native-google-fonts`) |
| Env | **`react-native-dotenv`** — vars from **`.env`** (gitignored); **`.env.example`** committed |

## Environment variables

Defined in [`.env.example`](../.env.example):

- `TMDB_BASE_URL`
- `TMDB_IMAGE_BASE_URL`
- `TMDB_ACCESS_TOKEN` (Bearer token — never commit)

## Source layout (prescribed)

```
src/
├── api/client.ts, movies.ts, types.ts
├── components/common/
├── hooks/useHome.ts, useSearch.ts, useMovieDetail.ts
├── navigation/RootNavigator.tsx, types.ts
├── screens/HomeScreen, SearchScreen, DetailScreen, WatchlistScreen, ProfileScreen
├── store/watchlistStore.ts
├── theme/colors.ts, typography.ts, spacing.ts
└── utils/image.ts
```

**Rules:** Screens fetch **only through hooks** (no inline `useEffect` + fetch). Colors/spacing only from theme files. Navigation params typed in **`src/navigation/types.ts`**.

## Hook contract

All data hooks return a consistent shape (see course spec §9.2):

```ts
interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
```

## Watchlist store

`src/store/watchlistStore.ts`: `WatchlistItem` + `addItem` / `removeItem` / `isInWatchlist` / `count` / **`hydrated`**. No watchlist UI until **`hydrated === true`**.

## Design language

**“The Cinematic Curator”** — tokens in `src/theme/colors.ts` (no hex in components). **No 1px solid borders** for layout; boundaries via surfaces and spacing. Skeleton loading (shimmer), not bare spinners, for async sections.

## Screens (summary)

| Screen | Role |
|--------|------|
| Home | Hero, genre chips, Trending / Top Rated / genre row, pagination near row end |
| Search | Debounced search (e.g. 400ms), cancel stale requests, recent searches, grid |
| Detail | **`Promise.allSettled`** for movie + credits + similar; per-section loading/error/retry |
| Watchlist | Filters, grid, optimistic remove, “Because you saved”, empty state |
| Profile | Placeholder / “Coming Soon” |

## Submission artifacts (course)

- `prompt-logs/` or committed SpecStory history  
- `docs/ADR.md` — ≥3 architectural decisions  
- `README.md` — setup instructions  
- `.cursor/rules` — substantive (≥10 rules)

## Deviations / ADR hooks

Document intentional divergences from the course spec in [`ADR.md`](ADR.md):

1. _(placeholder)_  
2. _(placeholder)_  
3. _(placeholder)_  

---

*Streamlist local spec — align implementation with the Phase 2 upstream document for assessment details.*
