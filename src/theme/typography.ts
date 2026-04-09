import { TextStyle } from 'react-native';
import { fontFamily } from './fontFamily';

export { fontFamily };

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
  /** Hero / primary CTAs — Stitch `font-bold` on salmon buttons (`07-home-nav`). */
  ctaBold: {
    fontFamily: fontFamily.manrope700,
    fontSize: 15,
    letterSpacing: 0.15,
  },
} as const satisfies Record<string, TextStyle>;
