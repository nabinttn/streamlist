# StreamList

React Native CLI app for browsing TMDB movies, search, detail, and a persisted watchlist (Phase 2 AI-first training spec).

## Prerequisites

- Node.js ≥ 22 (see `package.json` `engines`)
- Xcode + CocoaPods (iOS)
- Android Studio / SDK (Android)

## Setup

1. Clone the repo and install dependencies:

   ```bash
   npm install
   cd ios && bundle exec pod install && cd ..
   ```

2. Copy `.env.example` to `.env` and add your **TMDB API Read Access Token** (Bearer) from [themoviedb.org](https://www.themoviedb.org/settings/api).

3. Start Metro:

   ```bash
   npm start
   ```

4. Run the app:

   ```bash
   npm run ios
   # or
   npm run android
   ```

Open **`ios/Streamlist.xcworkspace`** in Xcode (not `.xcodeproj`) after `pod install`.

## Scripts

| Command        | Description        |
|----------------|--------------------|
| `npm start`    | Metro bundler      |
| `npm run ios`    | iOS simulator      |
| `npm run android`| Android emulator   |
| `npm test`     | Jest               |
| `npm run lint` | ESLint             |

## Project docs

- [docs/PROJECT_SPEC.md](docs/PROJECT_SPEC.md) — local spec (see upstream course Phase 2 for full detail)
- [docs/ADR.md](docs/ADR.md) — architectural decisions

## Security

Never commit `.env` or API tokens. `.env` is listed in `.gitignore`.
