/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { act } from 'react-test-renderer';

import { Skeleton } from '../../src/components/common/Skeleton';

describe('Skeleton', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders with width, height, and default border radius', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <Skeleton width={120} height={40} />,
      );
    });
    const json = tree!.toJSON();
    expect(json).not.toBeNull();
    expect(json).toMatchObject({
      type: 'View',
      props: expect.objectContaining({
        style: expect.objectContaining({
          width: 120,
          height: 40,
          borderRadius: 8,
          opacity: 0.5,
        }),
      }),
    });
  });

  test('applies custom borderRadius and style', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <Skeleton
          width="100%"
          height={24}
          borderRadius={4}
          style={{ marginTop: 4 }}
        />,
      );
    });
    const json = tree!.toJSON();
    expect(json).not.toBeNull();
    expect(json).toMatchObject({
      props: expect.objectContaining({
        style: expect.objectContaining({
          width: '100%',
          height: 24,
          borderRadius: 4,
          marginTop: 4,
          opacity: 0.5,
        }),
      }),
    });
  });
});
