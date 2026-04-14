# StreamList — agent index

Quick orientation for AI / automation working in this repository.

## App root

- **React Native app:** `phase2/streamlist/` — run **npm**, **Metro**, **Gradle**, and **CocoaPods** from this directory unless a task says otherwise.

## Canonical docs

- **Local product + stack contract:** [`docs/PROJECT_SPEC.md`](docs/PROJECT_SPEC.md)
- **Architectural decisions:** [`docs/ADR.md`](docs/ADR.md)
- **Upstream course Phase 2 spec (rubric, screens):** linked from `PROJECT_SPEC.md`

## Verification (from `phase2/streamlist/`)

```bash
npm run lint
npm test
```

## Cursor rules

- Always-applied rules: [`.cursor/rules/react-native-cursor-rules.mdc`](.cursor/rules/react-native-cursor-rules.mdc)
- Glob-scoped rules: [`.cursor/rules/`](.cursor/rules/) — `streamlist-api`, `streamlist-hooks`, `streamlist-navigation-tests`, `streamlist-watchlist`

## Prompt playbook

- Phase 2 (CDIR + verification): [`phase2/docs/phase-2-prompt-strategy.md`](phase2/docs/phase-2-prompt-strategy.md)
- Phase 1 reference: [`phase1/docs/phase-1-prompt-strategy.md`](phase1/docs/phase-1-prompt-strategy.md)

## Indexing / noise

- Large local history under [`.specstory/`](.specstory/) may be listed in [`.cursorignore`](.cursorignore); prefer opening [`docs/PROJECT_SPEC.md`](docs/PROJECT_SPEC.md) and app source under `phase2/streamlist/src/` for context.
