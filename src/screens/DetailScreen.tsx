import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ApiMovieListItem } from '../api/types';
import { ContentCard } from '../components/common/ContentCard';
import {
  IconArrowBack,
  IconBookmarkAdd,
  IconBookmarkAdded,
  IconShare,
  IconStarFilled,
} from '../components/icons/StreamlistIcons';
import { Skeleton } from '../components/common/Skeleton';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { colors } from '../theme/colors';
import { iconSize } from '../theme/iconSizes';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatRuntime, formatYear } from '../utils/format';
import { posterUrl } from '../utils/image';
import { useWatchlistStore, type WatchlistItem } from '../store/watchlistStore';
import type { DetailScreenProps } from '../navigation/types';

export function DetailScreen({
  navigation,
  route,
}: DetailScreenProps) {
  const { movieId } = route.params;
  const insets = useSafeAreaInsets();
  const { details, credits, similar } = useMovieDetail(movieId);
  const hydrated = useWatchlistStore(s => s.hydrated);
  const isSaved = useWatchlistStore(s => s.isInWatchlist(movieId));
  const addItem = useWatchlistStore(s => s.addItem);
  const removeItem = useWatchlistStore(s => s.removeItem);

  const [expanded, setExpanded] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const BACKDROP_H = 220 + insets.top;
  const HEADER_H = 48 + insets.top;

  const stickyOpacity = scrollY.interpolate({
    inputRange: [BACKDROP_H - HEADER_H - 20, BACKDROP_H - HEADER_H],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const onScroll = useMemo(
    () =>
      Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true },
      ),
    [scrollY],
  );

  const movie = details.data;
  const castList = useMemo(() => {
    const c = credits.data?.cast ?? [];
    return c
      .filter(x => x.order < 20)
      .slice(0, 12);
  }, [credits.data]);

  const similarMovies: ApiMovieListItem[] = similar.data?.results ?? [];

  const backdropUri = movie
    ? posterUrl(movie.backdrop_path, 'w780')
    : null;

  const toggleWatchlist = () => {
    if (!movie) {
      return;
    }
    if (isSaved) {
      removeItem(movie.id);
      return;
    }
    const item: WatchlistItem = {
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      voteAverage: movie.vote_average,
      releaseDate: movie.release_date,
      genreIds: movie.genres.map(g => g.id),
      mediaType: 'movie',
    };
    addItem(item);
  };

  type ChipItem =
    | { kind: 'rating'; key: string; value: string }
    | { kind: 'meta'; key: string; value: string };

  const chips: ChipItem[] = [];
  if (movie) {
    const y = formatYear(movie.release_date);
    if (y) {
      chips.push({ kind: 'meta', key: 'year', value: y });
    }
    if (movie.vote_average > 0) {
      chips.push({
        kind: 'rating',
        key: 'rating',
        value: `${movie.vote_average.toFixed(1)} Rating`,
      });
    }
    const g = movie.genres[0]?.name;
    if (g) {
      chips.push({ kind: 'meta', key: 'genre', value: g });
    }
    const rt = formatRuntime(movie.runtime);
    if (rt) {
      chips.push({ kind: 'meta', key: 'run', value: rt });
    }
  }

  const onShare = async () => {
    if (!movie) {
      return;
    }
    try {
      await Share.share({
        message: `${movie.title} — StreamList`,
        title: movie.title,
      });
    } catch {
      Alert.alert('Share', 'Unable to open the share sheet.');
    }
  };

  const onSeeAllSimilar = () => {
    navigation.navigate('Main', {
      screen: 'HomeTab',
      params: {
        screen: 'MovieList',
        params: {
          title: 'Trending Now',
          listType: 'trending',
        },
      },
    });
  };

  return (
    <View style={styles.root}>
      {/* Sticky header — fades in once the backdrop scrolls away */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.stickyHeader,
          { height: HEADER_H, paddingTop: insets.top, opacity: stickyOpacity },
        ]}>
        <View style={styles.stickyInner} pointerEvents="auto">
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            accessibilityLabel="Back">
            <IconArrowBack size={iconSize.detailBack} color={colors.on_surface} />
          </Pressable>
          <Text style={styles.stickyTitle} numberOfLines={1}>
            {movie?.title ?? ''}
          </Text>
          <Pressable
            onPress={onShare}
            hitSlop={12}
            accessibilityLabel="Share"
            disabled={!movie}>
            <IconShare size={iconSize.detailBack} color={colors.on_surface} />
          </Pressable>
        </View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        onScroll={onScroll}
        scrollEventThrottle={16}>
        <View style={{ height: BACKDROP_H }}>
          {details.loading && !movie ? (
            <View style={{ height: BACKDROP_H }}>
              <Skeleton width="100%" height={BACKDROP_H} borderRadius={0} />
              <View
                style={[styles.heroTopChrome, { paddingTop: insets.top + spacing.xs }]}>
                <Pressable
                  onPress={() => navigation.goBack()}
                  hitSlop={12}
                  accessibilityLabel="Back">
                  <IconArrowBack size={iconSize.detailBack} color={colors.on_surface} />
                </Pressable>
                <View style={{ width: iconSize.detailBack }} />
              </View>
            </View>
          ) : backdropUri ? (
            <ImageBackground
              source={{ uri: backdropUri }}
              style={[styles.backdrop, { paddingTop: insets.top }]}>
              <LinearGradient
                colors={['transparent', colors.surface]}
                style={StyleSheet.absoluteFill}
              />
              <View
                style={[styles.heroTopChrome, { paddingTop: insets.top + spacing.xs }]}>
                <Pressable
                  onPress={() => navigation.goBack()}
                  hitSlop={12}
                  accessibilityLabel="Back">
                  <IconArrowBack size={iconSize.detailBack} color={colors.on_surface} />
                </Pressable>
                <Pressable
                  onPress={onShare}
                  hitSlop={12}
                  accessibilityLabel="Share"
                  disabled={!movie}>
                  <IconShare size={iconSize.detailBack} color={colors.on_surface} />
                </Pressable>
              </View>
            </ImageBackground>
          ) : (
            <View
              style={[
                styles.placeholderBackdrop,
                { paddingTop: insets.top, height: 220 + insets.top },
              ]}>
              <View
                style={[styles.heroTopChrome, { paddingTop: insets.top + spacing.xs }]}>
                <Pressable
                  onPress={() => navigation.goBack()}
                  hitSlop={12}
                  accessibilityLabel="Back">
                  <IconArrowBack size={iconSize.detailBack} color={colors.on_surface} />
                </Pressable>
                <Pressable
                  onPress={onShare}
                  hitSlop={12}
                  accessibilityLabel="Share"
                  disabled={!movie}>
                  <IconShare size={iconSize.detailBack} color={colors.on_surface} />
                </Pressable>
              </View>
              <Text style={styles.phLogo}>SL</Text>
            </View>
          )}
        </View>

        {details.error ? (
          <View style={styles.section}>
            <Text style={styles.err}>{details.error}</Text>
            <Pressable style={styles.retry} onPress={details.refetch}>
              <Text style={styles.retryTxt}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {movie ? (
          <>
            <Text style={[styles.title, { paddingHorizontal: spacing.md }]}>
              {movie.title}
            </Text>
            <View style={styles.chipRow}>
              {chips.map(c =>
                c.kind === 'rating' ? (
                  <View key={c.key} style={styles.chipRating}>
                    <IconStarFilled size={14} color={colors.on_brand} />
                    <Text style={styles.chipRatingTxt}>{c.value}</Text>
                  </View>
                ) : (
                  <View key={c.key} style={styles.chip}>
                    <Text style={styles.chipTxt}>{c.value}</Text>
                  </View>
                ),
              )}
            </View>

            {hydrated ? (
              <Pressable
                onPress={toggleWatchlist}
                accessibilityRole="button"
                accessibilityLabel={
                  isSaved ? 'Remove from watchlist' : 'Add to watchlist'
                }
                style={({ pressed }) => [
                  styles.watchBtn,
                  pressed ? styles.watchBtnPressed : null,
                ]}>
                {isSaved ? (
                  <View style={styles.watchSaved}>
                    <View style={styles.watchlistRow}>
                      <View style={styles.watchlistIconWrap}>
                        <IconBookmarkAdded
                          size={iconSize.detailWatchlist}
                          color={colors.primary}
                        />
                      </View>
                      <Text
                        style={styles.watchSavedTxt}
                        numberOfLines={1}>
                        In Watchlist
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.watchAddOuter}>
                    <LinearGradient
                      colors={[colors.primary, colors.primary_container]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.watchlistRow}>
                      <View style={styles.watchlistIconWrap}>
                        <IconBookmarkAdd
                          size={iconSize.detailWatchlist}
                          color={colors.on_brand}
                        />
                      </View>
                      <Text
                        style={styles.watchAddTxt}
                        numberOfLines={1}>
                        Add to Watchlist
                      </Text>
                    </View>
                  </View>
                )}
              </Pressable>
            ) : (
              <Skeleton width="90%" height={52} style={{ alignSelf: 'center' }} />
            )}

            <Text
              style={[styles.headline, { paddingHorizontal: spacing.md }]}>
              Synopsis
            </Text>
            <Text
              style={[styles.body, { paddingHorizontal: spacing.md }]}
              numberOfLines={expanded ? undefined : 3}>
              {movie.overview || 'No synopsis available.'}
            </Text>
            {movie.overview.length > 180 ? (
              <Pressable onPress={() => setExpanded(!expanded)}>
                <Text style={styles.readMore}>
                  {expanded ? 'Show less' : 'Read more'}
                </Text>
              </Pressable>
            ) : null}
          </>
        ) : null}

        <Text style={[styles.headline, { paddingHorizontal: spacing.md }]}>
          Cast
        </Text>
        {credits.loading ? (
          <Skeleton width="100%" height={80} style={{ marginHorizontal: spacing.md }} />
        ) : credits.error ? (
          <Text style={styles.metaMuted}>{credits.error}</Text>
        ) : castList.length === 0 ? (
          <Text style={styles.metaMuted}>Cast information unavailable</Text>
        ) : (
          <FlatList
            horizontal
            data={castList}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.castCell}>
                {item.profile_path ? (
                  <Image
                    source={{ uri: posterUrl(item.profile_path, 'w185')! }}
                    style={styles.castImg}
                  />
                ) : (
                  <View style={[styles.castImg, styles.castPh]} />
                )}
                <Text style={styles.castName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.castChar} numberOfLines={1}>
                  {item.character}
                </Text>
              </View>
            )}
          />
        )}

        {similarMovies.length > 0 ? (
          <>
            <View style={styles.rowHead}>
              <Text style={styles.rowSectionTitle}>More Like This</Text>
              <Pressable onPress={onSeeAllSimilar} hitSlop={8}>
                <Text style={styles.seeAll}>See All</Text>
              </Pressable>
            </View>
            <FlatList
              horizontal
              data={similarMovies}
              keyExtractor={item => String(item.id)}
              contentContainerStyle={{ paddingHorizontal: spacing.md }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={{ marginRight: spacing.sm, width: 130 }}>
                  <ContentCard
                    movie={item}
                    width={130}
                    onPress={() =>
                      navigation.push('Detail', { movieId: item.id })
                    }
                    genreLabel={formatYear(item.release_date)}
                  />
                </View>
              )}
            />
          </>
        ) : null}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  backdrop: {
    height: 220,
    width: '100%',
    justifyContent: 'flex-end',
  },
  backdropGrad: {
    ...StyleSheet.absoluteFill,
  },
  placeholderBackdrop: {
    backgroundColor: colors.surface_container_high,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phLogo: {
    ...typography.displayMd,
    color: colors.on_surface_variant,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.surface,
    justifyContent: 'flex-end',
  },
  stickyInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    height: 48,
  },
  stickyTitle: {
    ...typography.titleLg,
    color: colors.on_surface,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  heroTopChrome: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  title: {
    ...typography.displayMd,
    color: colors.on_surface,
    marginTop: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surface_container_highest,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.xs,
  },
  chipTxt: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
  },
  chipRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondary_container,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.xs,
  },
  chipRatingTxt: {
    ...typography.titleSm,
    fontSize: 12,
    color: colors.on_brand,
  },
  watchBtn: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  watchBtnPressed: {
    opacity: 0.92,
  },
  /** Primary — horizontal gradient + white label (Stitch detail mock). */
  watchAddOuter: {
    minHeight: 48,
    width: '100%',
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    borderRadius: spacing.xs,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    maxWidth: '100%',
  },
  watchlistIconWrap: {
    flexShrink: 0,
  },
  watchAddTxt: {
    ...typography.ctaBold,
    color: colors.on_brand,
    lineHeight: 20,
    includeFontPadding: false,
    flexShrink: 1,
  },
  /** Outlined — `border border-primary` (Stitch detail). */
  watchSaved: {
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.primary,
    minHeight: 48,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchSavedTxt: {
    ...typography.ctaBold,
    color: colors.primary,
    lineHeight: 20,
    includeFontPadding: false,
    flexShrink: 1,
  },
  headline: {
    ...typography.headlineMd,
    color: colors.on_surface,
    marginTop: spacing.lg,
  },
  body: {
    ...typography.bodyMd,
    color: colors.on_surface,
    marginTop: spacing.xs,
  },
  readMore: {
    ...typography.titleSm,
    color: colors.primary_container,
    marginLeft: spacing.md,
    marginTop: spacing.xs,
  },
  metaMuted: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    paddingHorizontal: spacing.md,
  },
  castCell: {
    width: 72,
  },
  castImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface_container_high,
  },
  castPh: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  castName: {
    ...typography.labelSm,
    color: colors.on_surface,
    marginTop: spacing.xxs,
  },
  castChar: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
  },
  rowHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  rowSectionTitle: {
    ...typography.headlineMd,
    color: colors.on_surface,
  },
  seeAll: {
    ...typography.titleSm,
    color: colors.primary_container,
  },
  section: {
    padding: spacing.md,
  },
  err: {
    ...typography.bodyMd,
    color: colors.primary_container,
  },
  retry: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface_container_highest,
    padding: spacing.sm,
    borderRadius: spacing.xs,
  },
  retryTxt: {
    ...typography.titleSm,
    color: colors.on_surface,
  },
});
