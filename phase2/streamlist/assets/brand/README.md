# StreamList brand assets

## Copyright / usage

- **`app-icon.svg`** and **`splash-mark.svg`** are **original vector artwork** for this project: simple geometric shapes (list bars, play triangle, circle stroke) and app palette colors from `src/theme/colors.ts`.
- They do **not** incorporate third-party logos, studio marks, or TMDB imagery. Regenerate platform PNGs after editing the SVGs.

## Platform outputs

Raster icons and splash bitmaps are produced by:

```bash
npm run generate:icons
```

(requires devDependency `@resvg/resvg-js`; see `scripts/generate-app-icons.cjs`). This writes:

- **iOS:** `ios/Streamlist/Images.xcassets/AppIcon.appiconset/*.png` and `SplashCenter.imageset/*.png`
- **Android:** `android/app/src/main/res/mipmap-*/ic_launcher*.png` and `drawable/splash_logo.png`

## Manual export

If you prefer not to run the script, open `app-icon.svg` in a design tool and export PNGs using [Apple’s icon sizes](https://developer.apple.com/design/human-interface-guidelines/app-icons) and [Android density buckets](https://developer.android.com/training/multiscreen/screendensities).
