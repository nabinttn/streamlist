import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NormalizedError } from '../api/client';
import {
  discoverMoviesByGenre,
  fetchDiscoverPopular,
  fetchMovieGenres,
  fetchTopRatedMovies,
  fetchTrendingMovies,
} from '../api/movies';
import type { ApiMovieListItem, Genre } from '../api/types';
import { ContentCard } from '../components/common/ContentCard';
import { IconArrowBack } from '../components/icons/StreamlistIcons';
import type { MovieListScreenProps } from '../navigation/types';
import { colors } from '../theme/colors';
import { iconSize } from '../theme/iconSizes';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { genreLine } from '../utils/genres';

type Props = MovieListScreenProps;

export function MovieListScreen({ navigation, route }: Props) {
  const { title, listType, genreId } = route.params;
  const insets = useSafeAreaInsets();
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    fetchMovieGenres()
      .then(r => setGenres(r.genres))
      .catch(() => setGenres([]));
  }, []);

  const [items, setItems] = useState<ApiMovieListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (p: number, append: boolean) => {
      try {
        let data;
        if (listType === 'trending') {
          data = await fetchTrendingMovies(p);
        } else if (listType === 'topRated') {
          data = await fetchTopRatedMovies(p);
        } else {
          data =
            genreId == null
              ? await fetchDiscoverPopular(p)
              : await discoverMoviesByGenre(genreId, p);
        }
        setTotalPages(data.total_pages);
        setItems(prev => (append ? [...prev, ...data.results] : data.results));
        setPage(data.page);
        setError(null);
      } catch (e) {
        setError((e as NormalizedError).message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [listType, genreId],
  );

  useEffect(() => {
    setLoading(true);
    fetchPage(1, false);
  }, [fetchPage]);

  const onEnd = () => {
    if (loadingMore || page >= totalPages) {
      return;
    }
    setLoadingMore(true);
    fetchPage(page + 1, true);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.top}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={styles.backRow}
          accessibilityLabel="Back">
          <IconArrowBack size={iconSize.detailBack} color={colors.primary_container} />
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>
      {error ? (
        <Text style={styles.err}>{error}</Text>
      ) : null}
      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: spacing.sm, paddingHorizontal: spacing.md }}
        contentContainerStyle={styles.listContent}
        onEndReached={onEnd}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator color={colors.primary_container} />
          ) : null
        }
        renderItem={({ item }) => (
          <ContentCard
            movie={item}
            onPress={() => navigation.navigate('Detail', { movieId: item.id })}
            genreLabel={genreLine(item.genre_ids, genres)}
          />
        )}
      />
      {loading && items.length === 0 ? (
        <ActivityIndicator
          style={styles.center}
          color={colors.primary_container}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  top: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  back: {
    ...typography.titleSm,
    color: colors.primary_container,
  },
  title: {
    ...typography.headlineMd,
    color: colors.on_surface,
  },
  err: {
    ...typography.bodyMd,
    color: colors.primary_container,
    paddingHorizontal: spacing.md,
  },
  center: {
    ...StyleSheet.absoluteFill,
  },
  listContent: {
    paddingBottom: 100,
    gap: spacing.sm,
  },
});
