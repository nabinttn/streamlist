import { Platform } from 'react-native';

/**
 * iOS resolves custom fonts by PostScript name; Android uses the linked file stem
 * from `react-native-asset` (see `assets/fonts/*.ttf`).
 * Names verified with `fc-scan` on the bundled TTFs.
 */
export const fontFamily = {
  inter400: Platform.select({
    ios: 'Inter-Regular',
    default: 'Inter_400Regular',
  })!,
  inter600: Platform.select({
    ios: 'Inter-SemiBold',
    default: 'Inter_600SemiBold',
  })!,
  manrope600: Platform.select({
    ios: 'Manrope-SemiBold',
    default: 'Manrope_600SemiBold',
  })!,
  manrope700: Platform.select({
    ios: 'Manrope-Bold',
    default: 'Manrope_700Bold',
  })!,
  manrope800: Platform.select({
    ios: 'Manrope-ExtraBold',
    default: 'Manrope_800ExtraBold',
  })!,
} as const;
