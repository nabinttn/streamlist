/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

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
