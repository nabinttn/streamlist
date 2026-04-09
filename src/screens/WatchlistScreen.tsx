import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ApiMovieListItem } from '../api/types';
import { fetchSimilarMovies } from '../api/movies';
import { ContentCard } from '../components/common/ContentCard';
import { IconBookmarkOutline, IconPersonOutline } from '../components/icons/StreamlistIcons';
import { ScreenErrorBoundary } from '../components/common/ScreenErrorBoundary';
import { useWatchlistStore, type WatchlistItem } from '../store/watchlistStore';
import { colors } from '../theme/colors';
import { iconSize } from '../theme/iconSizes';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { genreLine } from '../utils/genres';
import { fetchMovieGenres } from '../api/movies';
import type { Genre } from '../api/types';
import type { WatchlistMainScreenProps } from '../navigation/types';
import { formatYear } from '../utils/format';

type Props = WatchlistMainScreenProps;

type Filter = 'all' | 'movie' | 'tv';

function WatchlistInner({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const colW = (width - spacing.md * 3) / 2;
  const hydrated = useWatchlistStore(s => s.hydrated);
  const items = useWatchlistStore(s => s.items);
  const removeItem = useWatchlistStore(s => s.removeItem);
  const [filter, setFilter] = useState<Filter>('all');
  const [similar, setSimilar] = useState<ApiMovieListItem[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    fetchMovieGenres()
      .then(r => setGenres(r.genres))
      .catch(() => setGenres([]));
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') {
      return items;
    }
    if (filter === 'movie') {
      return items.filter(i => i.mediaType === 'movie');
    }
    return items.filter(i => i.mediaType === 'tv');
  }, [items, filter]);

  const mostRecent = items.length > 0 ? items[items.length - 1] : null;

  useEffect(() => {
    if (!mostRecent) {
      setSimilar([]);
      return;
    }
    let cancelled = false;
    fetchSimilarMovies(mostRecent.id, 1)
      .then(res => {
        if (!cancelled) {
          setSimilar(res.results.slice(0, 10));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSimilar([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [mostRecent]);

  const listAsMovies = (list: WatchlistItem[]): ApiMovieListItem[] =>
    list.map(i => ({
      id: i.id,
      title: i.title,
      poster_path: i.posterPath,
      backdrop_path: null,
      vote_average: i.voteAverage,
      release_date: i.releaseDate,
      genre_ids: i.genreIds,
    }));

  const emptyFilter =
    filtered.length === 0 && items.length > 0 && filter !== 'all';

  if (!hydrated) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Text style={styles.meta}>Loading…</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.emptyRoot,
          { paddingTop: insets.top, paddingBottom: 100 },
        ]}>
        <Text style={styles.label}>YOUR COLLECTION</Text>
        <Text style={styles.bigTitle}>My Watchlist</Text>
        <Text style={styles.count}>0 titles</Text>
        <View style={styles.emptyBookmarkWrap}>
          <IconBookmarkOutline
            size={iconSize.emptyStateBookmark}
            color={colors.secondary_container}
          />
        </View>
        <Text style={styles.emptyHead}>Your watchlist is empty</Text>
        <Text style={styles.emptyBody}>
          Save movies and shows you want to watch later and they'll appear here.
        </Text>
        <Pressable
          style={styles.cta}
          onPress={() =>
            navigation.getParent()?.dispatch(
              CommonActions.navigate({
                name: 'HomeTab',
                params: { screen: 'HomeMain' },
              }),
            )
          }>
          <Text style={styles.ctaTxt}>Browse Trending Now</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.label}>YOUR COLLECTION</Text>
          <Text style={styles.bigTitle}>My Watchlist</Text>
        </View>
        <IconPersonOutline size={iconSize.topBar} color={colors.on_surface_variant} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {(['all', 'movie', 'tv'] as const).map(f => {
          const active = filter === f;
          const label =
            f === 'all' ? 'All' : f === 'movie' ? 'Movies' : 'Series';
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterChip, active && styles.filterOn]}>
              <Text style={active ? styles.filterTxtOn : styles.filterTxtOff}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {emptyFilter ? (
        <View style={styles.ctxEmpty}>
          <Text style={styles.emptyHead}>
            No {filter === 'tv' ? 'Series' : 'Movies'} in your watchlist yet
          </Text>
          <Pressable style={styles.browseChip} onPress={() => setFilter('all')}>
            <Text style={styles.browseChipTxt}>Browse All</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={listAsMovies(filtered)}
          keyExtractor={item => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{ gap: spacing.sm, paddingHorizontal: spacing.md }}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListHeaderComponent={
            similar.length > 0 && !emptyFilter ? (
              <View style={styles.because}>
                <View style={styles.rowHead}>
                  <Text style={styles.headline}>
                    Because you saved {mostRecent?.title}
                  </Text>
                </View>
                <FlatList
                  horizontal
                  data={similar}
                  keyExtractor={item => String(item.id)}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.md }}
                  renderItem={({ item }) => (
                    <View style={{ width: 130 }}>
                      <ContentCard
                        movie={item}
                        width={130}
                        onPress={() =>
                          navigation.navigate('Detail', { movieId: item.id })
                        }
                        genreLabel={formatYear(item.release_date)}
                      />
                    </View>
                  )}
                />
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={{ width: colW }}>
              <View style={styles.cardWrap}>
                <Pressable
                  style={styles.remove}
                  onPress={() => removeItem(item.id)}
                  hitSlop={8}>
                  <Text style={styles.removeTxt}>×</Text>
                </Pressable>
                <ContentCard
                  movie={item}
                  width={colW}
                  onPress={() =>
                    navigation.navigate('Detail', { movieId: item.id })
                  }
                  genreLabel={genreLine(item.genre_ids, genres)}
                />
                <Pressable
                  style={styles.detailsBtn}
                  onPress={() =>
                    navigation.navigate('Detail', { movieId: item.id })
                  }>
                  <Text style={styles.detailsTxt}>Details</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

export function WatchlistScreen(props: Props) {
  return (
    <ScreenErrorBoundary onRetry={() => {}}>
      <WatchlistInner {...props} />
    </ScreenErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  meta: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    padding: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  label: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    letterSpacing: 2,
  },
  bigTitle: {
    ...typography.displayMd,
    color: colors.on_surface,
  },
  filters: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginVertical: spacing.md,
    alignItems: 'center',
  },
  filterChip: {
    minHeight: 40,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.md,
    backgroundColor: colors.surface_container_high,
    justifyContent: 'center',
  },
  filterOn: {
    backgroundColor: colors.brand,
  },
  filterTxtOn: {
    ...typography.titleSm,
    color: colors.on_brand,
    lineHeight: 20,
    includeFontPadding: false,
  },
  filterTxtOff: {
    ...typography.titleSm,
    color: colors.on_surface_variant,
    lineHeight: 20,
    includeFontPadding: false,
  },
  cardWrap: {
    marginBottom: spacing.md,
  },
  remove: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    zIndex: 2,
    backgroundColor: colors.surface_container_highest,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeTxt: {
    color: colors.on_surface,
    fontSize: 18,
    lineHeight: 20,
  },
  detailsBtn: {
    marginTop: spacing.xs,
    backgroundColor: colors.surface_container_highest,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
    alignItems: 'center',
  },
  detailsTxt: {
    ...typography.titleSm,
    color: colors.on_surface,
  },
  because: {
    marginBottom: spacing.lg,
  },
  rowHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  headline: {
    ...typography.headlineMd,
    color: colors.on_surface,
    flex: 1,
  },
  ctxEmpty: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyRoot: {
    flexGrow: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  count: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    marginBottom: spacing.lg,
  },
  emptyBookmarkWrap: {
    marginVertical: spacing.md,
    opacity: 0.5,
  },
  emptyHead: {
    ...typography.headlineMd,
    color: colors.on_surface,
    textAlign: 'center',
  },
  emptyBody: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  cta: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary_container,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.xs,
  },
  ctaTxt: {
    ...typography.titleSm,
    color: colors.surface,
  },
  browseChip: {
    marginTop: spacing.md,
    minHeight: 40,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface_container_highest,
    borderRadius: spacing.md,
    justifyContent: 'center',
  },
  browseChipTxt: {
    ...typography.titleSm,
    color: colors.on_surface,
    lineHeight: 20,
    includeFontPadding: false,
  },
});
