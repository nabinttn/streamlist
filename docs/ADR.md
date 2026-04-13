# Architectural Decisions — StreamList

## Decision: React Native CLI bootstrap merged into an existing repo

**What:** The app was generated with `npx @react-native-community/cli init` in a temporary directory, then `android/`, `ios/`, and JS config were merged into this repository alongside existing `docs/` and `.cursor/` files.

**Context:** The CLI does not reliably initialize into a non-empty folder; merging preserves git history and course artifacts.

**Prompt strategy:** Scaffold via a one-off init path, then copy-only merge; verify `.gitignore` keeps `.env` excluded and run `pod install` after dependency changes.

**Trade-offs:** Manual merge risk if RN template structure changes between versions; occasional conflict with pre-existing files (resolved by preferring RN template for native projects and keeping docs/cursor separate).

---

## Decision: Omit `react-native-reanimated` (CocoaPods `RNWorklets` resolution failure)

**What:** Navigation uses `@react-navigation/native`, native stack, bottom tabs, and `react-native-gesture-handler` only—no Reanimated.

**Context:** `pod install` failed to resolve `RNWorklets` required by Reanimated 4.x with the current CocoaPods setup.

**Prompt strategy:** Remove Reanimated and its Babel plugin; confirm stacks and transitions work with the default navigator behavior; document that animated transitions are not a priority for the minimum bar.

**Trade-offs:** Fewer animated transitions; smaller native surface and faster iOS pod resolution. If animations become mandatory, revisit Reanimated version / Podfile sources or New Architecture compatibility.

---

## Decision: Watchlist hydration flag via `persist.onFinishHydration`

**What:** `hydrated` is set to `true` in `App.tsx` using `useWatchlistStore.persist.onFinishHydration`, so no watchlist-dependent UI shows a stale “Add” state before AsyncStorage rehydrates.

**Context:** Course spec treats premature watchlist UI as a bug.

**Prompt strategy:** Keep `hydrated: false` in store until `onFinishHydration` runs; gate Detail watchlist button and tab badge on `hydrated`.

**Trade-offs:** Short loading state on cold start; relies on Zustand persist API staying stable across versions.
