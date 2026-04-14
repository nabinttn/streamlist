import React, { useCallback } from 'react';
import { LinearGradient } from 'react-native-linear-gradient';
import {
  Alert,
  FlatList,
  ImageBackground,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ApiMovieListItem } from '../api/types';
import { ContentCard } from '../components/common/ContentCard';
import { ScreenErrorBoundary } from '../components/common/ScreenErrorBoundary';
import { HomeScreenSkeleton } from '../components/common/HomeScreenSkeleton';
import {
  IconMovie,
  IconNotificationsOutline,
  IconPlayArrowFilled,
} from '../components/icons/StreamlistIcons';
import { useHome } from '../hooks/useHome';
import type { HomeMainScreenProps } from '../navigation/types';
import { colors } from '../theme/colors';
import { iconSize } from '../theme/iconSizes';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { genreLine } from '../utils/genres';
import { posterUrl } from '../utils/image';

type Props = HomeMainScreenProps;

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
    refreshing,
    onRefresh,
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
            <View style={styles.rowPosterWrap}>
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

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.primary}
      progressViewOffset={insets.top}
    />
  );

  if (trending.loading && !hero) {
    return (
      <ScrollView
        style={[styles.root, { paddingTop: insets.top }]}
        contentContainerStyle={styles.homeScrollContent}
        refreshControl={refreshControl}>
        <HomeScreenSkeleton />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.root, { paddingTop: insets.top }]}
      contentContainerStyle={styles.homeScrollContent}
      refreshControl={refreshControl}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconMovie size={iconSize.topBarLogo} color={colors.brand} />
          <Text style={styles.logo}>StreamList</Text>
        </View>
        <Pressable
          hitSlop={12}
          accessibilityLabel="Notifications"
          onPress={() => Alert.alert('StreamList', 'Notifications coming soon.')}>
          <IconNotificationsOutline
            size={iconSize.topBar}
            color={colors.on_surface_variant}
          />
        </Pressable>
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

      {hero && heroUri ? (
        <View style={styles.heroWrap}>
          <Pressable
            onPress={() => navigation.navigate('Detail', { movieId: hero.id })}
            style={styles.heroPress}>
            <ImageBackground
              source={{ uri: heroUri }}
              style={styles.heroBg}
              imageStyle={styles.heroBgImage}>
              <LinearGradient
                colors={['transparent', colors.surface]}
                locations={[0.2, 1]}
                style={styles.heroGrad}
                pointerEvents="none"
              />
              <View style={styles.heroInner} collapsable={false}>
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
                    }
                    style={styles.heroCtaOuter}>
                    {/** Stitch `07-home-nav`: `bg-primary text-on-primary` (flat salmon, not gradient). */}
                    <View style={styles.heroCtaFill}>
                      <View style={styles.heroCtaRow}>
                        <View style={styles.heroCtaIconWrap}>
                          <IconPlayArrowFilled
                            size={iconSize.ctaPlay}
                            color={colors.on_primary}
                          />
                        </View>
                        <Text
                          style={styles.heroCtaTxt}
                          numberOfLines={1}>
                          Watch Now
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                  <Pressable
                    style={styles.heroSec}
                    onPress={() =>
                      navigation.navigate('Detail', { movieId: hero.id })
                    }>
                    <Text style={styles.heroSecTxt}>Details</Text>
                  </Pressable>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        </View>
      ) : (
        <View style={[styles.heroPlaceholder, styles.heroPlaceholderShort]}>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    ...typography.titleLg,
    color: colors.brand,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
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
    backgroundColor: colors.brand,
  },
  chipOff: {
    backgroundColor: colors.surface_container_high,
  },
  chipTxtOn: {
    ...typography.titleSm,
    color: colors.on_brand,
  },
  chipTxtOff: {
    ...typography.titleSm,
    color: colors.on_surface_variant,
  },
  heroWrap: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  heroPress: {
    borderRadius: spacing.md,
  },
  heroBg: {
    width: '100%',
    minHeight: 460,
    justifyContent: 'flex-end',
  },
  heroBgImage: {
    borderRadius: spacing.md,
  },
  heroGrad: {
    ...StyleSheet.absoluteFill,
    borderRadius: spacing.md,
  },
  heroInner: {
    padding: spacing.md,
    width: '100%',
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
    alignItems: 'stretch',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  /** Primary CTA grows in the row; flexShrink 0 avoids squeezing label onto two lines. */
  heroCtaOuter: {
    flex: 1,
    flexShrink: 0,
    minWidth: 148,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  /** `07-home-nav`: `px-8 py-3 rounded-lg` — pill + generous horizontal inset. */
  heroCtaFill: {
    minHeight: 48,
    width: '100%',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    maxWidth: '100%',
  },
  heroCtaIconWrap: {
    flexShrink: 0,
  },
  heroCtaTxt: {
    ...typography.ctaBold,
    color: colors.on_primary,
    lineHeight: 20,
    includeFontPadding: false,
    flexShrink: 1,
  },
  /** `bg-surface-container-highest/80` + `border-white/5` */
  heroSec: {
    flexShrink: 0,
    backgroundColor: colors.hero_secondary_cta_bg,
    minHeight: 48,
    minWidth: 100,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: 9999,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.hero_secondary_cta_border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSecTxt: {
    ...typography.ctaBold,
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
  homeScrollContent: {
    paddingBottom: 100,
  },
  rowPosterWrap: {
    width: 140,
  },
  heroPlaceholderShort: {
    height: 200,
  },
});
