import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ContentCard } from '../components/common/ContentCard';
import { ScreenErrorBoundary } from '../components/common/ScreenErrorBoundary';
import { Skeleton } from '../components/common/Skeleton';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { useSearch } from '../hooks/useSearch';
import { useSearchExplore } from '../hooks/useSearchExplore';
import type { SearchStackParamList } from '../navigation/types';
import { fetchMovieGenres } from '../api/movies';
import type { Genre } from '../api/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { genreLine } from '../utils/genres';
import { formatYear } from '../utils/format';

type Props = NativeStackScreenProps<SearchStackParamList, 'SearchMain'>;

const PRESET_CHIPS = [
  { label: 'Action', query: 'action' },
  { label: 'Drama', query: 'drama' },
  { label: 'Comedy', query: 'comedy' },
];

function SearchInner({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const colW = (width - spacing.md * 3) / 2;
  const [focused, setFocused] = useState(false);
  const { query, setQuery, result } = useSearch();
  const explore = useSearchExplore();
  const recent = useRecentSearches();
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    fetchMovieGenres()
      .then(r => setGenres(r.genres))
      .catch(() => setGenres([]));
  }, []);

  const showRecent = query.length === 0 && !focused && recent.items.length > 0;

  const onSubmitSearch = () => {
    if (query.trim()) {
      recent.addSearch(query.trim());
    }
  };

  const gridData = result.data?.results ?? [];
  const hasQuery = query.trim().length > 0;

  const featured = explore.data?.featured;
  const gridExplore = explore.data?.grid ?? [];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.head}>
        <Text style={styles.logo}>StreamList</Text>
        <Text style={styles.avatar}>○</Text>
      </View>

      <View
        style={[
          styles.searchBox,
          focused && styles.searchBoxFocus,
        ]}>
        <Text style={styles.mag}>⌕</Text>
        <TextInput
          style={styles.input}
          placeholder="Search movies, actors, directors..."
          placeholderTextColor={colors.on_surface_variant}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={onSubmitSearch}
          returnKeyType="search"
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {PRESET_CHIPS.map(c => (
          <Pressable
            key={c.label}
            style={styles.chip}
            onPress={() => {
              setQuery(c.query);
              recent.addSearch(c.query);
            }}>
            <Text style={styles.chipTxt}>{c.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {showRecent ? (
        <View style={styles.recentBlock}>
          <View style={styles.recentHead}>
            <Text style={styles.headline}>Recent Searches</Text>
            <Pressable onPress={recent.clearAll}>
              <Text style={styles.clear}>CLEAR ALL</Text>
            </Pressable>
          </View>
          {recent.items.map(term => (
            <Pressable
              key={term}
              style={styles.recentRow}
              onPress={() => setQuery(term)}>
              <Text style={styles.clock}>🕐</Text>
              <Text style={styles.recentTxt}>{term}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {hasQuery ? (
        <>
          {result.loading ? (
            <Skeleton width="90%" height={24} style={{ alignSelf: 'center' }} />
          ) : (
            <Text style={styles.count}>
              {result.data?.totalResults ?? 0} results for '{query.trim()}'
            </Text>
          )}
          {gridData.length === 0 && !result.loading && !result.error ? (
            <View style={styles.zero}>
              <Text style={styles.zeroTitle}>No results for '{query.trim()}'</Text>
              <Text style={styles.zeroBody}>
                Try another title or check spelling.
              </Text>
            </View>
          ) : (
            <FlatList
              data={gridData}
              keyExtractor={item => String(item.id)}
              numColumns={2}
              columnWrapperStyle={{ gap: spacing.sm, paddingHorizontal: spacing.md }}
              contentContainerStyle={{ paddingBottom: 100 }}
              renderItem={({ item }) => (
                <ContentCard
                  movie={item}
                  width={colW}
                  onPress={() =>
                    navigation.navigate('Detail', { movieId: item.id })
                  }
                  genreLabel={genreLine(item.genre_ids, genres)}
                />
              )}
            />
          )}
          {result.error ? (
            <Text style={styles.err}>{result.error}</Text>
          ) : null}
        </>
      ) : (
        <>
          <Text style={styles.section}>Trending Now</Text>
          {explore.loading ? (
            <Skeleton width="100%" height={180} style={{ marginHorizontal: spacing.md }} />
          ) : featured ? (
            <Pressable
              onPress={() =>
                navigation.navigate('Detail', { movieId: featured.id })
              }
              style={styles.featured}>
              <Text style={styles.featuredBadge}>FEATURED</Text>
              <Text style={styles.featuredTitle}>{featured.title}</Text>
              <Text style={styles.featuredMeta}>
                {formatYear(featured.release_date)} • ★{' '}
                {featured.vote_average.toFixed(1)}
              </Text>
            </Pressable>
          ) : null}
          <FlatList
            data={gridExplore}
            keyExtractor={item => String(item.id)}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: spacing.sm, paddingHorizontal: spacing.md }}
            renderItem={({ item }) => (
              <ContentCard
                movie={item}
                width={colW}
                onPress={() =>
                  navigation.navigate('Detail', { movieId: item.id })
                }
                genreLabel={genreLine(item.genre_ids, genres)}
              />
            )}
          />
        </>
      )}
    </View>
  );
}

export function SearchScreen(props: Props) {
  const refetch = useMemo(
    () => () => {
      /* search explore refetch via remount - noop */
    },
    [],
  );
  return (
    <ScreenErrorBoundary onRetry={refetch}>
      <SearchInner {...props} />
    </ScreenErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  logo: {
    ...typography.titleLg,
    color: colors.primary_container,
  },
  avatar: {
    fontSize: 24,
    color: colors.on_surface_variant,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface_container_low,
    marginHorizontal: spacing.md,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  searchBoxFocus: {
    borderWidth: 1,
    borderColor: colors.outline_variant,
  },
  mag: {
    marginRight: spacing.xs,
    color: colors.on_surface_variant,
  },
  input: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.on_surface,
    paddingVertical: spacing.sm,
  },
  chips: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  chip: {
    backgroundColor: colors.surface_container_high,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  chipTxt: {
    ...typography.titleSm,
    color: colors.on_surface_variant,
  },
  recentBlock: {
    paddingHorizontal: spacing.md,
  },
  recentHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  headline: {
    ...typography.headlineMd,
    color: colors.on_surface,
  },
  clear: {
    ...typography.titleSm,
    color: colors.primary_container,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  clock: {
    marginRight: spacing.sm,
  },
  recentTxt: {
    ...typography.bodyMd,
    color: colors.on_surface,
  },
  count: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  zero: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  zeroTitle: {
    ...typography.headlineMd,
    color: colors.on_surface,
    textAlign: 'center',
  },
  zeroBody: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  section: {
    ...typography.headlineMd,
    color: colors.on_surface,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  featured: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.surface_container,
    padding: spacing.md,
    borderRadius: spacing.md,
    marginBottom: spacing.md,
  },
  featuredBadge: {
    ...typography.labelSm,
    color: colors.on_surface,
    backgroundColor: colors.secondary_container,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },
  featuredTitle: {
    ...typography.titleLg,
    color: colors.on_surface,
  },
  featuredMeta: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
  },
  err: {
    ...typography.bodyMd,
    color: colors.primary_container,
    padding: spacing.md,
  },
});
