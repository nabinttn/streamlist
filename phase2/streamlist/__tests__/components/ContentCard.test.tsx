/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { act } from 'react-test-renderer';
import { Image, Text } from 'react-native';

import type { ApiMovieListItem } from '../../src/api/types';
import { ContentCard } from '../../src/components/common/ContentCard';

const baseMovie: ApiMovieListItem = {
  id: 1,
  title: 'Test Movie',
  poster_path: '/abc.jpg',
  backdrop_path: null,
  vote_average: 7.5,
  release_date: '2024-06-01',
  genre_ids: [],
};

describe('ContentCard', () => {
  test('renders poster image and rating when poster and vote exist', async () => {
    const onPress = jest.fn();
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <ContentCard movie={baseMovie} onPress={onPress} width={100} />,
      );
    });
    const root = tree!.root;
    expect(root.findByType(Image).props.source).toEqual({
      uri: 'https://image.tmdb.org/t/p/w342/abc.jpg',
    });
    const texts = root.findAllByType(Text).map(n => n.props.children);
    expect(texts).toContain('Test Movie');
    expect(texts.some(t => String(t).includes('2024'))).toBe(true);
    expect(texts).toContain('★');
    expect(texts).toContain('7.5');
  });

  test('renders placeholder when poster_path is null', async () => {
    const movie = { ...baseMovie, poster_path: null };
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <ContentCard movie={movie} onPress={jest.fn()} width={80} />,
      );
    });
    const texts = tree!.root.findAllByType(Text).map(n => n.props.children);
    expect(texts).toContain('SL');
  });

  test('hides rating badge when showRating is false', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <ContentCard
          movie={baseMovie}
          onPress={jest.fn()}
          width={100}
          showRating={false}
        />,
      );
    });
    const texts = tree!.root.findAllByType(Text).map(n => n.props.children);
    expect(texts).not.toContain('★');
  });

  test('hides rating badge when vote_average is 0', async () => {
    const movie = { ...baseMovie, vote_average: 0 };
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <ContentCard movie={movie} onPress={jest.fn()} width={100} />,
      );
    });
    const texts = tree!.root.findAllByType(Text).map(n => n.props.children);
    expect(texts).not.toContain('★');
  });

  test('includes genreLabel in meta line', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <ContentCard
          movie={baseMovie}
          onPress={jest.fn()}
          width={100}
          genreLabel="Action"
        />,
      );
    });
    const meta = tree!.root
      .findAllByType(Text)
      .find(t => typeof t.props.children === 'string' && t.props.children.includes('•'));
    expect(meta?.props.children).toContain('Action');
  });

  test('invokes onPress when card is pressed', async () => {
    const onPress = jest.fn();
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <ContentCard movie={baseMovie} onPress={onPress} width={100} />,
      );
    });
    const pressable = tree!.root.findByProps({ onPress });
    act(() => {
      pressable.props.onPress();
    });
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
