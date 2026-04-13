# Prompt Strategy Document — Phase 1

**Project:** Streamlist (React Native CLI) · **Feature:** Option A — **Watchlist**

---

## 1. Feature Breakdown

| # | Task | Build note |
|---|------|------------|
| 1 | **Types + constants** — `WatchlistItem`, storage key `STREAMLIST_WATCHLIST_V1` in `src/features/watchlist/types.ts` and `constants.ts`. | Contracts first; no UI. |
| 2 | **`WatchlistProvider` + `useWatchlist`** — AsyncStorage JSON array; `items`, `isInWatchlist`, `add`, `remove`, `toggle`, `isHydrating`, `error`. Mount in `App.tsx`. | Single source of truth before any card/screen. |
| 3 | **`ContentCard` bookmark** — `src/components/content/ContentCard.tsx`: icon from `isInWatchlist(contentId)`; `toggle` on press; must not navigate. | One file; reuses hook only. |
| 4 | **Title detail** — `src/screens/TitleDetailScreen.tsx`: save / in-watchlist control, same hook. | Full add/remove without list screen. |
| 5 | **`WatchlistScreen` + navigation** — list, empty/loading/error, `RootStackParamList` + navigator registration. | Largest task (see Plan Mode). |
| 6 | **Polish** — duplicate taps, storage failure messaging, refresh if API appears later. | Small, targeted diffs. |

---

## 2. Two Full Prompts (CDIR)

### Task 2 — `useWatchlist` (persistence only)

**C:** React Native CLI, strict TS, React Navigation. Code under `src/features/watchlist/`. No backend; persist `{ contentId: string; addedAt: string }[]`. Use `@react-native-async-storage/async-storage`; if missing, add package and note `pod install` for iOS.

**D:** Provider + hook + types + constants only. Do not edit navigators, screens, or `ContentCard`.

**I:** Export `WatchlistProvider`, `useWatchlist`. Wrap app in provider in `App.tsx` (respect existing provider order). Memoize context value if needed to avoid list-wide rerenders. No `any`.

**R:** Grep: `AsyncStorage` appears only under `features/watchlist`. Parse errors surface as `error`, not crash.

**Complete prompt (paste to agent):**

> Streamlist, RN CLI, strict TS. Add `src/features/watchlist/types.ts`, `constants.ts` (key `STREAMLIST_WATCHLIST_V1`), and `WatchlistContext.tsx` with `WatchlistProvider` + `useWatchlist` using AsyncStorage JSON for `WatchlistItem[]`. Methods: `items`, `isInWatchlist`, `add`, `remove`, `toggle`, `isHydrating`, `error`. Mount provider in `App.tsx`. Do not change navigation, screens, or `ContentCard`. No `any`. Add async-storage if needed; note iOS pods.

---

### Task 3 — `ContentCard` indicator

**C:** Watchlist feature exists. `ContentCard` at `src/components/content/ContentCard.tsx` has `contentId` and existing `onPress`.

**D:** Only `ContentCard` (+ styles file if present). No new routes.

**I:** Bookmark UI via `useWatchlist()`; filled vs outline; `toggle(contentId)` on icon press without firing card navigation (`stopPropagation` / hitSlop as needed). `accessibilityLabel` + `accessibilityState.selected`. No new dependencies.

**R:** Long list scroll still smooth; card press opens detail; icon only toggles watchlist.

**Complete prompt (paste to agent):**

> Update `src/components/content/ContentCard.tsx`: add watchlist bookmark using `useWatchlist()` from `src/features/watchlist`. Reflect `isInWatchlist(contentId)`; icon toggles watchlist and must not trigger the card’s navigation handler. Accessibility for saved state. Match existing StyleSheet. No new packages; do not touch AsyncStorage here.

---

## 3. Plan Mode Outline

**Task:** 5 — `WatchlistScreen` + typed navigation.

**Questions the agent should ask:** Tab vs stack entry for watchlist? Inline remove vs detail-only? Reuse `ContentCard` or slim row? How do we resolve `contentId` → poster/title if watchlist only stores IDs?

**Files to reference:** `src/navigation/types.ts`, `RootStack.tsx` (or app navigator), `src/features/watchlist/**`, `HomeScreen` (or similar) for empty/loading patterns, `ContentCard` if rows reuse it.

**Plan should include:** (1) Extend param list + register screen. (2) `WatchlistScreen` with `FlashList`/`FlatList`, `keyExtractor`, empty, error, hydrate loading. (3) Data mapping strategy for rows (mock catalog stub vs TODO). (4) User-visible entry (tab / menu). (5) Test flow: empty → save from browse → list updates → remove.

---

## 4. `.cursor/rules` Additions

1. **Schema + key versioning** — Watchlist data uses only `STREAMLIST_WATCHLIST_V1` and `WatchlistItem`; bump key if schema changes. *Stops AI from inventing parallel keys per screen.*

2. **Persistence boundary** — UI never imports AsyncStorage for watchlist; only `useWatchlist()` from `src/features/watchlist`. *One place to add API sync later.*

3. **Typed routes** — New screens go in `RootStackParamList` (or project equivalent) with the same `NativeStackScreenProps` pattern as existing screens—no stringly `navigate`. *Watchlist adds a route; this is where hallucinated APIs slip in.*

---

## 5. AI Failure Anticipation

| Hallucination | Catch in review | Corrective prompt |
|---------------|-----------------|-------------------|
| AsyncStorage in `ContentCard` or `WatchlistScreen` “to save faster.” | `rg AsyncStorage` — only `features/watchlist`. | “Remove AsyncStorage from UI files; use `useWatchlist()` only; persistence stays in `WatchlistContext`.” |
| `navigate('Watchlist')` without updating `RootStackParamList` or registering the screen. | `tsc`, search `Watchlist` in `types.ts` and navigator. | “Add `Watchlist: undefined` to `src/navigation/types.ts`, register in `RootStack.tsx`, type screen props with `NativeStackScreenProps<RootStackParamList, 'Watchlist'>`.” |

---

## 6. One Thing I Learned

The watchlist feature made **persistence boundaries** concrete: if Task 2’s prompt allows AsyncStorage anywhere, the agent optimizes locally and Tasks 3–5 inherit garbage. I now treat the first state prompt as a **contract + grep checklist** (“AsyncStorage only under `src/features/watchlist`”), not just a feature description—that shifts my job from fixing diffs to tightening the factory.

---

*Paths are hypothetical until the repo is scaffolded; align names to your tree before submitting.*
