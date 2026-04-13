import React, { memo } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { ApiMovieListItem } from '../../api/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { posterUrl } from '../../utils/image';
import { formatYear } from '../../utils/format';

export interface ContentCardProps {
  movie: ApiMovieListItem;
  onPress: () => void;
  genreLabel?: string;
  showRating?: boolean;
  width?: number;
}

function ContentCardInner({
  movie,
  onPress,
  genreLabel,
  showRating = true,
  width: widthOverride,
}: ContentCardProps) {
  const { width: screenW } = useWindowDimensions();
  const colWidth = (screenW - spacing.md * 3) / 2;
  const width = widthOverride ?? colWidth;
  const height = (width * 3) / 2;
  const uri = posterUrl(movie.poster_path, 'w342');
  const year = formatYear(movie.release_date);

  return (
    <Pressable onPress={onPress} style={[styles.wrap, { width }]}>
      <View style={[styles.poster, { width, height }]}>
        {uri ? (
          <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <View style={[styles.placeholder, { width, height }]}>
            <Text style={styles.placeholderText}>SL</Text>
          </View>
        )}
        {showRating && movie.vote_average > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeStar}>★</Text>
            <Text style={styles.badgeVal}>
              {movie.vote_average.toFixed(1)}
            </Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {movie.title}
      </Text>
      <Text style={styles.meta} numberOfLines={1}>
        {[year, genreLabel].filter(Boolean).join(' • ')}
      </Text>
    </Pressable>
  );
}

export const ContentCard = memo(ContentCardInner);

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  poster: {
    borderRadius: spacing.md,
    overflow: 'hidden',
    backgroundColor: colors.surface_container_high,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface_container_high,
  },
  placeholderText: {
    ...typography.headlineMd,
    color: colors.on_surface_variant,
  },
  badge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface_container_highest,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.xs,
  },
  badgeStar: {
    ...typography.labelSm,
    color: colors.primary_container,
    marginRight: 2,
  },
  badgeVal: {
    ...typography.labelSm,
    color: colors.on_surface,
  },
  title: {
    ...typography.titleLg,
    color: colors.on_surface,
    marginTop: spacing.xs,
  },
  meta: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    marginTop: 2,
  },
});
