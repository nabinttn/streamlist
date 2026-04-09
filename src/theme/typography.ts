import { TextStyle } from 'react-native';

/**
 * Must match loaded fonts in App.tsx (@expo-google-fonts).
 * Family strings are the keys returned by useFonts.
 */
export const fontFamily = {
  manrope800: 'Manrope_800ExtraBold',
  manrope700: 'Manrope_700Bold',
  manrope600: 'Manrope_600SemiBold',
  inter400: 'Inter_400Regular',
  inter600: 'Inter_600SemiBold',
} as const;

export const typography = {
  displayLg: {
    fontFamily: fontFamily.manrope800,
    fontSize: 56,
    letterSpacing: -1.12,
  },
  displayMd: {
    fontFamily: fontFamily.manrope800,
    fontSize: 40,
    letterSpacing: -0.8,
  },
  headlineMd: {
    fontFamily: fontFamily.manrope700,
    fontSize: 28,
    letterSpacing: -0.28,
  },
  titleLg: {
    fontFamily: fontFamily.manrope600,
    fontSize: 20,
  },
  titleSm: {
    fontFamily: fontFamily.inter600,
    fontSize: 14,
  },
  bodyMd: {
    fontFamily: fontFamily.inter400,
    fontSize: 14,
  },
  labelSm: {
    fontFamily: fontFamily.inter400,
    fontSize: 12,
  },
} as const satisfies Record<string, TextStyle>;
