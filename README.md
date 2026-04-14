# StreamList — training workspace

Monorepo-style layout for the **AI-first development** program: **Phase 1** documentation, **Phase 2** React Native app, and shared editor tooling at the repository root.

## Repository layout

| Path | Contents |
|------|----------|
| [`phase1/`](phase1/) | Phase 1 deliverables (prompt strategy, links to the course Phase 1 briefing) |
| [`docs/`](docs/) | **Project spec** ([`PROJECT_SPEC.md`](docs/PROJECT_SPEC.md)), **ADRs** ([`ADR.md`](docs/ADR.md)) — canonical contracts for the app |
| [`phase2/streamlist/`](phase2/streamlist/) | **Streamlist** — React Native CLI app (`package.json`, `android/`, `ios/`, `src/`); pointers to root docs in [`phase2/streamlist/docs/README.md`](phase2/streamlist/docs/README.md) |
| [`.cursor/`](.cursor/) | Cursor rules for this project |
| [`.specstory/`](.specstory/) | SpecStory / agent history (local tooling) |

All **npm**, **Metro**, **Gradle**, and **CocoaPods** commands run from **`phase2/streamlist/`**. See [`phase2/streamlist/README.md`](phase2/streamlist/README.md) for setup, scripts, and security notes.

## Quick start (app)

```bash
cd phase2/streamlist
npm install
cd ios && bundle exec pod install && cd ..
cp .env.example .env   # add TMDB token; never commit .env
npm start              # Metro, in one terminal
npm run ios            # or npm run android, in another
```

Open **`phase2/streamlist/ios/Streamlist.xcworkspace`** in Xcode (not `.xcodeproj`) after `pod install`.
