# Prompt Strategy — Phase 2 (StreamList app)

**App root:** `phase2/streamlist/` (all `src/` paths below are relative to it). **Contracts:** [`docs/PROJECT_SPEC.md`](../../docs/PROJECT_SPEC.md), [`.cursor/rules/react-native-cursor-rules.mdc`](../../.cursor/rules/react-native-cursor-rules.mdc).

---

## 1. CDIR template (paste and fill)

Use for each agent task so scope and review stay explicit.

| Letter | Fill in |
|--------|---------|
| **C** — Context | RN CLI, strict TS, app root `phase2/streamlist/`. Stack pieces that may *not* change (e.g. “do not edit `RootNavigator`”). |
| **D** — Deliverables | Exact files or exports (e.g. “only `src/hooks/useSearch.ts` + types if needed”). |
| **I** — Invariants | From project spec: hooks only from screens, HTTP only via `src/api/client.ts` + `movies.ts`, `UseQueryResult`, theme tokens, no `any`, TMDB via `@env`. |
| **R** — Review | Commands: `cd phase2/streamlist && npm run lint && npm test`. Optional greps: no `fetch` in screens; `AsyncStorage` only via watchlist store patterns. |

**One-shot prompt skeleton:**

> StreamList, Phase 2. App root `phase2/streamlist/`. **[C]** … **[D]** … **[I]** Follow `docs/PROJECT_SPEC.md` and `.cursor/rules`. No `any`. **[R]** Run `npm run lint` and `npm test` from `phase2/streamlist`; fix failures before finishing.

---

## 2. Verification (always from app root)

```bash
cd phase2/streamlist
npm run lint
npm test
```

For native or runtime checks after dependency or iOS changes: `cd ios && bundle exec pod install` (document in PR notes).

---

## 3. Plan mode (bigger features)

Before large navigational or multi-screen work, outline:

- **Files touched:** e.g. `src/navigation/types.ts`, `RootNavigator.tsx`, affected screens.
- **Open questions:** tab vs stack, empty states, hydration for watchlist, debounce/cancel for search.
- **Risks:** duplicate API surfaces, untyped `navigate`, theme hex literals.

Use Phase 1’s [Plan Mode Outline pattern](../../phase1/docs/phase-1-prompt-strategy.md) as a style reference.

---

## 4. Scope discipline

- Prefer **one layer per task** (e.g. API + hook *or* screen UI), unless the spec requires an end-to-end slice.
- **Search-related hooks** (`useSearch`, `useSearchExplore`, etc.): preserve **~400 ms debounce** and **AbortSignal** cancellation so stale results do not overwrite newer ones.
- **Watchlist:** only `src/store/watchlistStore.ts` for persistence; gate UI on **`hydrated`**.

---

## 5. AI failure checks (quick)

| Risk | Check |
|------|--------|
| Screens calling `fetch` / Axios | Grep `fetch` / `import axios` under `src/screens` — should be absent except via hooks |
| Untyped navigation | New routes added in `src/navigation/types.ts` and wired in `RootNavigator` |
| Watchlist before hydration | Detail / tab badge not trusted until `hydrated === true` |

---

*Align file names with the current tree under `phase2/streamlist/src/`; see [`docs/PROJECT_SPEC.md`](../../docs/PROJECT_SPEC.md) for the prescribed layout.*
