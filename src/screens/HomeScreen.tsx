import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import {
  FlatList,
  ImageBackground,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ApiMovieListItem } from '../api/types';
import { ContentCard } from '../components/common/ContentCard';
import { ScreenErrorBoundary } from '../components/common/ScreenErrorBoundary';
import { Skeleton } from '../components/common/Skeleton';
import { useHome } from '../hooks/useHome';
import type { HomeStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { genreLine } from '../utils/genres';
import { posterUrl } from '../utils/image';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

function HomeScreenInner({
  navigation,
  home,
}: Props & {
  home: ReturnType<typeof useHome>;
}) {
  const insets = useSafeAreaInsets();
  const {
    orderedChips,
    selectedGenreId,
    setSelectedGenreId,
    hero,
    trending,
    topRated,
    genreRow,
    genreRowTitle,
    loadMoreTrending,
    loadMoreTopRated,
    loadMoreGenre,
    genres,
  } = home;

  const onScrollRow = useCallback(
    (
      e: NativeSyntheticEvent<NativeScrollEvent>,
      loadMore: () => void,
      hasMore: boolean,
    ) => {
      const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
      const nearEnd =
        contentOffset.x + layoutMeasurement.width >= contentSize.width - 120;
      if (nearEnd && hasMore) {
        loadMore();
      }
    },
    [],
  );

  const renderRow = (
    title: string,
    data: ApiMovieListItem[],
    onEnd: () => void,
    hasMore: boolean,
    seeAll: () => void,
  ) => (
    <View style={styles.rowBlock}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Pressable onPress={seeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>
      {data.length === 0 && !trending.loading ? (
        <Text style={styles.emptyRow}>No titles in this row yet.</Text>
      ) : (
        <FlatList
          horizontal
          data={data}
          keyExtractor={item => String(item.id)}
          onScroll={e => onScrollRow(e, onEnd, hasMore)}
          scrollEventThrottle={400}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}
          renderItem={({ item }) => (
            <View style={{ width: 140 }}>
              <ContentCard
                movie={item}
                width={140}
                onPress={() =>
                  navigation.navigate('Detail', { movieId: item.id })
                }
                genreLabel={genreLine(item.genre_ids, genres)}
              />
            </View>
          )}
          ListFooterComponent={
            hasMore ? (
              <View style={styles.moreHint}>
                <Text style={styles.moreHintTxt}>LOADING MORE CONTENT</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );

  const heroUri = hero ? posterUrl(hero.backdrop_path, 'w780') : null;

  return (
    <ScrollView
      style={[styles.root, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <Text style={styles.logo}>StreamList</Text>
        <Text style={styles.bell}>🔔</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipStrip}>
        {orderedChips.map(chip => {
          const active =
            chip.id === selectedGenreId ||
            (chip.id === null && selectedGenreId === null);
          return (
            <Pressable
              key={chip.label}
              onPress={() => setSelectedGenreId(chip.id)}
              style={[
                styles.chip,
                active ? styles.chipOn : styles.chipOff,
              ]}>
              <Text style={active ? styles.chipTxtOn : styles.chipTxtOff}>
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {trending.loading && !hero ? (
        <Skeleton width="92%" height={220} style={{ alignSelf: 'center' }} />
      ) : hero && heroUri ? (
        <Pressable
          onPress={() => navigation.navigate('Detail', { movieId: hero.id })}
          style={styles.heroWrap}>
          <ImageBackground source={{ uri: heroUri }} style={styles.heroImg}>
            <LinearGradient
              colors={['transparent', colors.surface]}
              style={styles.heroGrad}
            />
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeTxt}>NEW RELEASE</Text>
            </View>
            <Text style={styles.heroTitle}>{hero.title}</Text>
            <Text style={styles.heroSyn} numberOfLines={2}>
              {hero.overview ?? ''}
            </Text>
            <View style={styles.heroBtns}>
              <Pressable
                onPress={() =>
                  navigation.navigate('Detail', { movieId: hero.id })
                }>
                <LinearGradient
                  colors={[colors.primary, colors.primary_container]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heroCta}>
                  <Text style={styles.heroCtaTxt}>▶ Watch Now</Text>
                </LinearGradient>
              </Pressable>
              <Pressable
                style={styles.heroSec}
                onPress={() =>
                  navigation.navigate('Detail', { movieId: hero.id })
                }>
                <Text style={styles.heroSecTxt}>Details</Text>
              </Pressable>
            </View>
          </ImageBackground>
        </Pressable>
      ) : (
        <View style={[styles.heroPlaceholder, { height: 200 }]}>
          <Text style={styles.meta}>No hero content</Text>
        </View>
      )}

      {renderRow(
        'Trending Now',
        trending.items,
        loadMoreTrending,
        trending.page < trending.totalPages,
        () =>
          navigation.navigate('MovieList', {
            title: 'Trending Now',
            listType: 'trending',
          }),
      )}

      {renderRow(
        'Top Rated',
        topRated.items,
        loadMoreTopRated,
        topRated.page < topRated.totalPages,
        () =>
          navigation.navigate('MovieList', {
            title: 'Top Rated',
            listType: 'topRated',
          }),
      )}

      {renderRow(
        genreRowTitle,
        genreRow.items,
        loadMoreGenre,
        genreRow.page < genreRow.totalPages,
        () =>
          navigation.navigate('MovieList', {
            title: genreRowTitle,
            listType: 'genre',
            genreId: selectedGenreId,
          }),
      )}
    </ScrollView>
  );
}

export function HomeScreen(props: Props) {
  const home = useHome();
  return (
    <ScreenErrorBoundary
      onRetry={() => {
        home.refetchTrending();
        home.refetchTopRated();
        home.refetchGenreRow();
      }}>
      <HomeScreenInner {...props} home={home} />
    </ScreenErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  logo: {
    ...typography.titleLg,
    color: colors.primary_container,
  },
  bell: {
    opacity: 0.5,
  },
  chipStrip: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  chipOn: {
    backgroundColor: colors.secondary_container,
  },
  chipOff: {
    backgroundColor: colors.surface_container_high,
  },
  chipTxtOn: {
    ...typography.titleSm,
    color: colors.on_surface,
  },
  chipTxtOff: {
    ...typography.titleSm,
    color: colors.on_surface_variant,
  },
  heroWrap: {
    marginHorizontal: spacing.md,
    borderRadius: spacing.md,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  heroImg: {
    minHeight: 280,
    padding: spacing.md,
    justifyContent: 'flex-end',
  },
  heroGrad: {
    ...StyleSheet.absoluteFill,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary_container,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.xs,
    marginBottom: spacing.sm,
  },
  heroBadgeTxt: {
    ...typography.labelSm,
    color: colors.surface,
  },
  heroTitle: {
    ...typography.displayMd,
    color: colors.on_surface,
  },
  heroSyn: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
  },
  heroBtns: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  heroCta: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.xs,
  },
  heroCtaTxt: {
    ...typography.titleSm,
    color: colors.surface,
  },
  heroSec: {
    backgroundColor: colors.surface_container_highest,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.xs,
  },
  heroSecTxt: {
    ...typography.titleSm,
    color: colors.on_surface,
  },
  rowBlock: {
    marginBottom: spacing.lg,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  rowTitle: {
    ...typography.headlineMd,
    color: colors.on_surface,
  },
  seeAll: {
    ...typography.titleSm,
    color: colors.primary_container,
  },
  emptyRow: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    paddingHorizontal: spacing.md,
  },
  moreHint: {
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  moreHintTxt: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
  },
  heroPlaceholder: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.surface_container_low,
    borderRadius: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
  },
});
