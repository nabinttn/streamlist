/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo-google-fonts/manrope', () => ({
  Manrope_600SemiBold: 'Manrope_600SemiBold',
  Manrope_700Bold: 'Manrope_700Bold',
  Manrope_800ExtraBold: 'Manrope_800ExtraBold',
}));

jest.mock('@expo-google-fonts/inter', () => ({
  Inter_400Regular: 'Inter_400Regular',
  Inter_600SemiBold: 'Inter_600SemiBold',
}));

jest.mock('react-native-gesture-handler', () => {
  const RN = jest.requireActual('react-native');
  return {
    GestureHandlerRootView: RN.View,
  };
});

jest.mock('../src/navigation/RootNavigator', () => ({
  RootNavigator: () => null,
}));

jest.mock('../src/store/watchlistStore', () => ({
  useWatchlistStore: Object.assign(
    jest.fn(),
    {
      setState: jest.fn(),
      persist: {
        onFinishHydration: (fn: () => void) => {
          fn();
          return () => {};
        },
      },
    },
  ),
}));

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
  });
});
