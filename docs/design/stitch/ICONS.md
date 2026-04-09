# Icons and imagery (Stitch exports vs React Native)

Stitch MCP returns **full-screen PNGs** and **HTML** per screen. It does **not** emit a standalone icon font or SVG sprite for React Native.

## What the HTML exports use

The generated HTML loads **Google Material Symbols** (`material-symbols-outlined`) and uses ligature text (e.g. `movie`, `home`, `search`, `bookmark`, `person`, `notifications`, `play_arrow`) with optional `data-icon` attributes. Example pattern:

```html
<span class="material-symbols-outlined" data-icon="home">home</span>
```

See any `*.html` file under this folder (e.g. `07-home-nav.html`) for the full set on a given screen.

## Matching icons “exactly” in the app

The app uses **`react-native-svg`** with 24dp Material-style paths in **`src/components/icons/StreamlistIcons.tsx`**, with sizes centralized in **`src/theme/iconSizes.ts`** (tab bar 24, top bar 24, search field 22, CTA play 18, empty-state bookmark 96, etc.). Colors use theme tokens (e.g. `colors.brand` `#E5383B` for the header movie icon).

1. **Name mapping:** Collect unique `data-icon` values from the HTML exports; the components follow the same names (`home`, `search`, `bookmark`, `person`, `notifications`, `movie`, `play_arrow`, back arrow).
2. **Sizing and weight:** Stitch uses Tailwind (`text-2xl`, `text-8xl`, etc.); `iconSizes` mirrors those intents. The Home tab uses **filled** home when the tab is **focused** (see `IconHome` `filled` prop), matching Stitch’s `FILL` 1 on the active tab icon.
3. **No MCP shortcut for vectors:** There is no separate “download all icons” URL from `list_screens`. Pixel-perfect **raster** icons only appear inside the **PNG** (flattened). In-app vectors are hand-mapped SVG paths aligned with Material Icons / Symbols.

## Poster and hero images

HTML references `lh3.googleusercontent.com/aida-public/...` URLs for posters. Treat those as **design-time references** only; the production app should continue to use **TMDB** URLs via [`src/utils/image.ts`](../../../src/utils/image.ts)) so you are not tied to expiring or third-party hotlinks.
