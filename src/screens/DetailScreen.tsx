import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
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
import { Skeleton } from '../components/common/Skeleton';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatRuntime, formatYear } from '../utils/format';
import { posterUrl } from '../utils/image';
import { useWatchlistStore, type WatchlistItem } from '../store/watchlistStore';

type DetailNav = NativeStackNavigationProp<
  { Detail: { movieId: number } },
  'Detail'
>;
type DetailRoute = RouteProp<{ Detail: { movieId: number } }, 'Detail'>;

export function DetailScreen({
  navigation,
  route,
}: {
  navigation: DetailNav;
  route: DetailRoute;
}) {
  const { movieId } = route.params;
  const insets = useSafeAreaInsets();
  const { details, credits, similar } = useMovieDetail(movieId);
  const hydrated = useWatchlistStore(s => s.hydrated);
  const isSaved = useWatchlistStore(s => s.isInWatchlist(movieId));
  const addItem = useWatchlistStore(s => s.addItem);
  const removeItem = useWatchlistStore(s => s.removeItem);

  const [expanded, setExpanded] = useState(false);

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

  const chips: { label: string; value: string }[] = [];
  if (movie) {
    const y = formatYear(movie.release_date);
    if (y) {
      chips.push({ label: 'year', value: y });
    }
    if (movie.vote_average > 0) {
      chips.push({
        label: 'rating',
        value: `★ ${movie.vote_average.toFixed(1)}`,
      });
    }
    const g = movie.genres[0]?.name;
    if (g) {
      chips.push({ label: 'genre', value: g });
    }
    const rt = formatRuntime(movie.runtime);
    if (rt) {
      chips.push({ label: 'run', value: rt });
    }
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={{ height: 220 + insets.top }}>
          {details.loading && !movie ? (
            <Skeleton width="100%" height={220 + insets.top} borderRadius={0} />
          ) : backdropUri ? (
            <ImageBackground
              source={{ uri: backdropUri }}
              style={[styles.backdrop, { paddingTop: insets.top }]}>
              <LinearGradient
                colors={['transparent', colors.surface]}
                style={StyleSheet.absoluteFill}
              />
              <Pressable
                style={[styles.backBtn, { top: insets.top + spacing.xs }]}
                onPress={() => navigation.goBack()}
                hitSlop={12}>
                <Text style={styles.backTxt}>←</Text>
              </Pressable>
            </ImageBackground>
          ) : (
            <View
              style={[
                styles.placeholderBackdrop,
                { paddingTop: insets.top, height: 220 + insets.top },
              ]}>
              <Pressable
                style={[styles.backBtn, { top: insets.top + spacing.xs }]}
                onPress={() => navigation.goBack()}
                hitSlop={12}>
                <Text style={styles.backTxt}>←</Text>
              </Pressable>
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
              {chips.map(c => (
                <View key={c.label + c.value} style={styles.chip}>
                  <Text style={styles.chipTxt}>{c.value}</Text>
                </View>
              ))}
            </View>

            {hydrated ? (
              <Pressable
                onPress={toggleWatchlist}
                style={({ pressed }) => [
                  styles.watchBtn,
                  pressed ? { opacity: 0.9 } : null,
                ]}>
                {isSaved ? (
                  <View style={styles.watchSaved}>
                    <Text style={styles.watchSavedTxt}>In Watchlist</Text>
                  </View>
                ) : (
                  <LinearGradient
                    colors={[colors.primary, colors.primary_container]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradInner}>
                    <Text style={styles.watchAddTxt}>+ Add to Watchlist</Text>
                  </LinearGradient>
                )}
              </Pressable>
            ) : (
              <Skeleton width="90%" height={48} style={{ alignSelf: 'center' }} />
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
              <Text style={styles.headline}>More Like This</Text>
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
      </ScrollView>
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
  backBtn: {
    position: 'absolute',
    left: spacing.md,
    zIndex: 2,
  },
  backTxt: {
    ...typography.titleLg,
    color: colors.on_surface,
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
  watchBtn: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: spacing.xs,
    overflow: 'hidden',
  },
  gradInner: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  watchAddTxt: {
    ...typography.titleSm,
    color: colors.surface,
  },
  watchSaved: {
    backgroundColor: colors.surface_container_highest,
    borderWidth: 1,
    borderColor: colors.outline_variant,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  watchSavedTxt: {
    ...typography.titleSm,
    color: colors.primary_container,
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
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
