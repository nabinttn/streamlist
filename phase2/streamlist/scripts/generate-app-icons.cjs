/**
 * Renders assets/brand/*.svg to iOS AppIcon + Android mipmaps + splash bitmaps.
 * Run: npm run generate:icons
 * Uses @resvg/resvg-js (reliable SVG rasterization).
 */
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

function pngFromSvg(svgPath, size, outPath) {
  const svg = fs.readFileSync(svgPath, 'utf8');
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: size,
    },
    background: 'rgba(0,0,0,0)',
  });
  const pngData = resvg.render();
  const buf = pngData.asPng();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
}

function main() {
  const root = path.join(__dirname, '..');
  const brand = path.join(root, 'assets', 'brand');
  const iconSvg = path.join(brand, 'app-icon.svg');
  const splashSvg = path.join(brand, 'splash-mark.svg');

  const iosIconDir = path.join(
    root,
    'ios',
    'Streamlist',
    'Images.xcassets',
    'AppIcon.appiconset',
  );
  const iosSplashDir = path.join(
    root,
    'ios',
    'Streamlist',
    'Images.xcassets',
    'SplashCenter.imageset',
  );

  const iconTargets = [
    ['icon_40.png', 40],
    ['icon_60.png', 60],
    ['icon_58.png', 58],
    ['icon_87.png', 87],
    ['icon_80.png', 80],
    ['icon_120.png', 120],
    ['icon_180.png', 180],
    ['icon_1024.png', 1024],
  ];

  for (const [name, px] of iconTargets) {
    pngFromSvg(iconSvg, px, path.join(iosIconDir, name));
  }

  const androidMap = [
    ['mipmap-mdpi', 48],
    ['mipmap-hdpi', 72],
    ['mipmap-xhdpi', 96],
    ['mipmap-xxhdpi', 144],
    ['mipmap-xxxhdpi', 192],
  ];
  for (const [folder, px] of androidMap) {
    const base = path.join(root, 'android', 'app', 'src', 'main', 'res', folder);
    pngFromSvg(iconSvg, px, path.join(base, 'ic_launcher.png'));
    pngFromSvg(iconSvg, px, path.join(base, 'ic_launcher_round.png'));
  }

  const drawable = path.join(root, 'android', 'app', 'src', 'main', 'res', 'drawable');
  pngFromSvg(splashSvg, 288, path.join(drawable, 'splash_logo.png'));

  pngFromSvg(splashSvg, 256, path.join(iosSplashDir, 'SplashCenter.png'));
  pngFromSvg(splashSvg, 512, path.join(iosSplashDir, 'SplashCenter@2x.png'));
  pngFromSvg(splashSvg, 768, path.join(iosSplashDir, 'SplashCenter@3x.png'));

  console.log('Generated app icons, launcher mipmaps, and splash assets.');
}

main();
