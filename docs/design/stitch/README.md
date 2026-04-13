# Stitch — “Remix of Search” design exports

**Project:** [Stitch project 6747508532178572615](https://stitch.withgoogle.com/projects/6747508532178572615)

**Project ID (API / MCP):** `6747508532178572615`

## Cursor + Stitch MCP (verified)

The **Stitch MCP** server in Cursor can call `list_screens` and `list_design_systems` for this project when your Google account has access. This repo’s assets were refreshed by:

1. MCP **`list_screens`** → read `screenshot.downloadUrl` and `htmlCode.downloadUrl` per screen.
2. **`curl -fsSL '<url>' -o …`** into the files below (PNG + HTML).
3. MCP **`list_design_systems`** → full **Cinema Noir** theme saved in [`01-design-system.json`](01-design-system.json) and prose in [`01-design-system-strategy.md`](01-design-system-strategy.md).

**Screen inventory** (resource names + dimensions): [`screens-manifest.json`](screens-manifest.json).

**Icons:** Stitch does not ship a separate icon pack via MCP. See [`ICONS.md`](ICONS.md) for how HTML uses Material Symbols and how to map them in React Native.

## Contents

| File | Description |
|------|-------------|
| `01-design-system.json` | Design system theme: `namedColors`, fonts, roundness, spacing scale (from MCP). |
| `01-design-system-strategy.md` | Full **Cinematic Curator** strategy (`theme.designMd` from MCP). |
| `screens-manifest.json` | Stitch `screen` resource names and file prefixes for each export. |
| `ICONS.md` | Icons vs PNG vs HTML; Material Symbols → RN mapping notes. |
| `02-search-results-scifi.*` | Search Results: Sci-Fi (Matched) |
| `03-search.*` | Search |
| `04-watchlist-empty.*` | Watchlist (Empty State - Matched) |
| `05-watchlist.*` | Watchlist |
| `06-movie-detail.*` | Movie/Show Detail |
| `07-home-nav.*` | Home (Updated Nav) |

Each numbered screen has a **`.png`** (screenshot) and **`.html`** (generated markup) for layout/CSS reference (not drop-in React Native).

## Refreshing downloads

Hosted `downloadUrl` values **can expire**. To refresh:

1. In Cursor, use MCP **Stitch** → `list_screens` with `projectId` `6747508532178572615`.
2. Copy `screenshot.downloadUrl` / `htmlCode.downloadUrl` for the screen you need.
3. Run `curl -fsSL '<url>' -o docs/design/stitch/<name>.png` (or `.html`).

Re-run **`list_design_systems`** if tokens change, then update `01-design-system.json` and `01-design-system-strategy.md` as needed.

## Reference

- [Stitch documentation](https://stitch.withgoogle.com/docs)
