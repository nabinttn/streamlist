/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { act } from 'react-test-renderer';
import { Text } from 'react-native';

import { ScreenErrorBoundary } from '../../src/components/common/ScreenErrorBoundary';

function ThrowOnce({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test screen error');
  }
  return <Text>OK</Text>;
}

describe('ScreenErrorBoundary', () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    warnSpy.mockClear();
    errorSpy.mockClear();
  });

  afterAll(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test('renders children when there is no error', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <ScreenErrorBoundary onRetry={jest.fn()}>
          <ThrowOnce shouldThrow={false} />
        </ScreenErrorBoundary>,
      );
    });
    expect(JSON.stringify(tree!.toJSON())).toContain('OK');
    act(() => {
      tree!.unmount();
    });
  });

  test('renders fallback with message and calls onRetry when Try Again is pressed', () => {
    const onRetry = jest.fn();
    let tree: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <ScreenErrorBoundary onRetry={onRetry}>
          <ThrowOnce shouldThrow />
        </ScreenErrorBoundary>,
      );
    });

    expect(JSON.stringify(tree!.toJSON())).toContain('Test screen error');
    expect(JSON.stringify(tree!.toJSON())).toContain('Try Again');

    const instance = tree!.root;
    const pressable = instance.find(
      n => n.props != null && typeof n.props.onPress === 'function',
    );
    act(() => {
      pressable.props.onPress();
    });
    expect(onRetry).toHaveBeenCalledTimes(1);
    act(() => {
      tree!.unmount();
    });
  });
});
