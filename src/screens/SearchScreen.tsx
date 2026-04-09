import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ContentCard } from '../components/common/ContentCard';
import { IconPersonOutline, IconSearch } from '../components/icons/StreamlistIcons';
import { ScreenErrorBoundary } from '../components/common/ScreenErrorBoundary';
import { Skeleton } from '../components/common/Skeleton';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { useSearch } from '../hooks/useSearch';
import { useSearchExplore } from '../hooks/useSearchExplore';
import type { SearchMainScreenProps } from '../navigation/types';
import { fetchMovieGenres } from '../api/movies';
import type { Genre } from '../api/types';
import { colors } from '../theme/colors';
import { iconSize } from '../theme/iconSizes';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { genreLine } from '../utils/genres';
import { formatYear } from '../utils/format';
import { posterUrl } from '../utils/image';

type Props = SearchMainScreenProps;

const PRESET_CHIPS = [
  { label: 'Action', query: 'action' },
  { label: 'Comedy', query: 'comedy' },
  { label: 'Sci-Fi', query: 'science fiction' },
];

function firstGenreName(genreIds: number[], genreList: Genre[]): string {
  if (genreIds.length === 0 || genreList.length === 0) {
    return '';
  }
  const map = new Map(genreList.map(g => [g.id, g.name]));
  return map.get(genreIds[0]) ?? '';
}

function PresetGenreChips({
  activeQuery,
  onSelect,
}: {
  activeQuery: string;
  onSelect: (presetQuery: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.chipsScroll}
      contentContainerStyle={styles.chips}>
      {PRESET_CHIPS.map(c => {
        const active =
          activeQuery.trim().toLowerCase() === c.query.trim().toLowerCase();
        return (
          <Pressable
            key={c.label}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(c.query)}>
            <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>
              {c.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function SearchResultsEmpty({
  debouncedQuery: dq,
  loading,
  errorMessage,
  gridLength,
}: {
  debouncedQuery: string;
  loading: boolean;
  errorMessage: string | null;
  gridLength: number;
}) {
  if (dq.length === 0 || loading || errorMessage || gridLength > 0) {
    return null;
  }
  return (
    <View style={styles.zero}>
      <Text style={styles.zeroTitle}>No results for '{dq}'</Text>
      <Text style={styles.zeroBody}>
        Try another title or check spelling.
      </Text>
    </View>
  );
}

function SearchInner({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const colW = (width - spacing.md * 3) / 2;
  const [focused, setFocused] = useState(false);
  const { query, debouncedQuery, setQuery, result } = useSearch();
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

  const onPresetChip = (q: string) => {
    setQuery(q);
    recent.addSearch(q);
  };

  const featured = explore.data?.featured;
  const gridExplore = explore.data?.grid ?? [];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.head}>
        <Text style={styles.logo}>StreamList</Text>
        <Pressable
          style={styles.avatarWrap}
          hitSlop={8}
          accessibilityLabel="Profile">
          <View style={styles.avatarCircle}>
            <IconPersonOutline size={iconSize.topBar} color={colors.on_surface_variant} />
          </View>
        </Pressable>
      </View>

      <View
        style={[
          styles.searchBox,
          focused && styles.searchBoxFocus,
        ]}>
        <View style={styles.searchIconWrap}>
          <IconSearch size={iconSize.searchField} color={colors.on_surface_variant} />
        </View>
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

      {hasQuery ? (
        <FlatList
          style={styles.searchResultsList}
          data={gridData}
          keyExtractor={item => String(item.id)}
          numColumns={2}
          keyboardShouldPersistTaps="handled"
          columnWrapperStyle={styles.searchGridRow}
          contentContainerStyle={styles.searchResultsContent}
          ListHeaderComponent={
            <>
              <PresetGenreChips activeQuery={query} onSelect={onPresetChip} />
              {debouncedQuery.length > 0 ? (
                result.loading ? (
                  <Skeleton
                    width="90%"
                    height={24}
                    style={styles.searchMetaSkeleton}
                  />
                ) : (
                  <Text style={styles.count}>
                    {result.data?.totalResults ?? 0} results for '{debouncedQuery}'
                  </Text>
                )
              ) : null}
            </>
          }
          ListEmptyComponent={
            <SearchResultsEmpty
              debouncedQuery={debouncedQuery}
              loading={result.loading}
              errorMessage={result.error}
              gridLength={gridData.length}
            />
          }
          ListFooterComponent={
            result.error ? (
              <Text style={styles.err}>{result.error}</Text>
            ) : null
          }
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
      ) : (
        <ScrollView
          style={styles.exploreScroll}
          contentContainerStyle={styles.exploreScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <PresetGenreChips activeQuery={query} onSelect={onPresetChip} />
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

          <View style={styles.trendingBlock}>
            <Text style={styles.section}>Trending Now</Text>
            {explore.loading ? (
              <Skeleton
                width="100%"
                height={200}
                style={{ marginHorizontal: spacing.md }}
              />
            ) : featured ? (
              <>
                <View style={styles.featuredTagWrap}>
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeTxt}>FEATURED</Text>
                  </View>
                </View>
                <Pressable
                  onPress={() =>
                    navigation.navigate('Detail', { movieId: featured.id })
                  }
                  style={styles.featuredHeroOuter}
                  accessibilityRole="button"
                  accessibilityLabel={`Featured: ${featured.title}`}>
                  {(() => {
                    const heroUri =
                      posterUrl(featured.backdrop_path, 'w780') ??
                      posterUrl(featured.poster_path, 'w780');
                    const textBlock = (
                      <View style={styles.featuredHeroTextBlock}>
                        <Text style={styles.featuredHeroTitle} numberOfLines={2}>
                          {featured.title}
                        </Text>
                        <Text style={styles.featuredHeroMeta} numberOfLines={1}>
                          {[
                            firstGenreName(featured.genre_ids, genres),
                            formatYear(featured.release_date),
                            featured.vote_average > 0
                              ? `★ ${featured.vote_average.toFixed(1)}`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(' • ')}
                        </Text>
                      </View>
                    );
                    if (!heroUri) {
                      return (
                        <View style={[styles.featuredHero, styles.featuredHeroFallback]}>
                          <LinearGradient
                            colors={[colors.surface_container_high, colors.surface]}
                            style={StyleSheet.absoluteFill}
                          />
                          {textBlock}
                        </View>
                      );
                    }
                    return (
                      <ImageBackground
                        source={{ uri: heroUri }}
                        style={styles.featuredHero}
                        imageStyle={styles.featuredHeroImage}>
                        <LinearGradient
                          colors={[
                            'transparent',
                            'rgba(19,19,19,0.35)',
                            'rgba(19,19,19,0.92)',
                          ]}
                          locations={[0.25, 0.55, 1]}
                          style={StyleSheet.absoluteFill}
                        />
                        {textBlock}
                      </ImageBackground>
                    );
                  })()}
                </Pressable>
              </>
            ) : null}
          </View>
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
        </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  avatarWrap: {
    borderRadius: 9999,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface_container_high,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    ...typography.titleLg,
    color: colors.brand,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface_container_low,
    marginHorizontal: spacing.md,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  searchBoxFocus: {
    borderWidth: 1,
    borderColor: colors.outline_variant,
  },
  searchIconWrap: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.on_surface,
    paddingVertical: spacing.sm,
  },
  /** Horizontal strip must not stretch vertically in the column (`flex: 1` root). */
  chipsScroll: {
    flexGrow: 0,
  },
  chips: {
    flexGrow: 0,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  chip: {
    height: 40,
    backgroundColor: colors.surface_container_high,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.md,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.brand,
  },
  chipTxt: {
    ...typography.titleSm,
    color: colors.on_surface_variant,
    lineHeight: 20,
    includeFontPadding: false,
  },
  chipTxtActive: {
    color: colors.on_brand,
  },
  searchResultsList: {
    flex: 1,
  },
  searchResultsContent: {
    paddingBottom: 100,
  },
  searchGridRow: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  searchMetaSkeleton: {
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  exploreScroll: {
    flex: 1,
  },
  exploreScrollContent: {
    paddingBottom: 100,
  },
  recentBlock: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
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
  trendingBlock: {
    marginBottom: spacing.md,
  },
  section: {
    ...typography.headlineMd,
    color: colors.on_surface,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  featuredTagWrap: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brand,
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  featuredBadgeTxt: {
    ...typography.labelSm,
    color: colors.on_brand,
    letterSpacing: 1.2,
    fontFamily: typography.titleSm.fontFamily,
  },
  featuredHeroOuter: {
    marginHorizontal: spacing.md,
    borderRadius: spacing.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  featuredHero: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
  },
  featuredHeroImage: {
    borderRadius: spacing.md,
  },
  featuredHeroFallback: {
    backgroundColor: colors.surface_container_high,
    justifyContent: 'flex-end',
  },
  featuredHeroTextBlock: {
    padding: spacing.md,
    paddingBottom: spacing.md,
  },
  featuredHeroTitle: {
    ...typography.titleLg,
    color: colors.on_surface,
  },
  featuredHeroMeta: {
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
