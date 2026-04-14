/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { act } from 'react-test-renderer';

import {
  IconArrowBack,
  IconBookmarkAdd,
  IconBookmarkAdded,
  IconBookmarkOutline,
  IconHome,
  IconMovie,
  IconNotificationsOutline,
  IconPersonOutline,
  IconPlayArrowFilled,
  IconSearch,
  IconShare,
  IconStarFilled,
} from '../../src/components/icons/StreamlistIcons';

const color = '#ffffff';

describe('StreamlistIcons', () => {
  test('IconHome uses different paths for filled vs outline', () => {
    let filled: ReactTestRenderer.ReactTestRenderer;
    let outline: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      filled = ReactTestRenderer.create(<IconHome color={color} filled size={32} />);
      outline = ReactTestRenderer.create(<IconHome color={color} size={24} />);
    });
    const a = filled!.toJSON();
    const b = outline!.toJSON();
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    expect(JSON.stringify(a)).not.toEqual(JSON.stringify(b));
  });

  test.each([
    ['IconSearch', IconSearch],
    ['IconBookmarkOutline', IconBookmarkOutline],
    ['IconBookmarkAdd', IconBookmarkAdd],
    ['IconBookmarkAdded', IconBookmarkAdded],
    ['IconPersonOutline', IconPersonOutline],
    ['IconNotificationsOutline', IconNotificationsOutline],
    ['IconMovie', IconMovie],
    ['IconPlayArrowFilled', IconPlayArrowFilled],
    ['IconArrowBack', IconArrowBack],
    ['IconShare', IconShare],
    ['IconStarFilled', IconStarFilled],
  ] as const)('%s renders a view tree', (_name, Icon) => {
    let r: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      r = ReactTestRenderer.create(<Icon color={color} />);
    });
    const json = r!.toJSON();
    expect(json).not.toBeNull();
    expect(json).toMatchObject({ type: 'View' });
  });
});
