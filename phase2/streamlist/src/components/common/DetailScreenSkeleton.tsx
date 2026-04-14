import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Skeleton } from './Skeleton';
import { spacing } from '../../theme/spacing';

const SIMILAR_CARD_W = 130;
const SIMILAR_POSTER_H = (SIMILAR_CARD_W * 3) / 2;
const CAST_CELL_W = 72;
const CAST_IMG = 60;

interface DetailScreenSkeletonProps {
  /** Matches `DetailScreen` backdrop container (`220 + insets.top`). Omit when the screen renders its own backdrop skeleton + chrome. */
  backdropHeight?: number;
}

/** Horizontal cast strip; matches `DetailScreen` cast cell width (`72`) and image (`60`). */
export function DetailCastRowSkeleton() {
  const cells = [0, 1, 2, 3, 4, 5];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.castScroll}>
      {cells.map(i => (
        <View key={i} style={styles.castCell}>
          <Skeleton width={CAST_IMG} height={CAST_IMG} borderRadius={CAST_IMG / 2} />
          <Skeleton width={CAST_CELL_W - 4} height={12} borderRadius={spacing.xxs} style={styles.castLine} />
          <Skeleton width={CAST_CELL_W - 12} height={12} borderRadius={spacing.xxs} style={styles.castLineSm} />
        </View>
      ))}
    </ScrollView>
  );
}

/** “More like this” horizontal strip; card width `130` matches `ContentCard` on detail. */
export function DetailSimilarRowSkeleton() {
  const cards = [0, 1, 2, 3];
  return (
    <View style={styles.similarStrip}>
      {cards.map(i => (
        <View key={i} style={styles.similarCard}>
          <Skeleton
            width={SIMILAR_CARD_W}
            height={SIMILAR_POSTER_H}
            borderRadius={spacing.md}
          />
          <Skeleton width={SIMILAR_CARD_W - spacing.sm} height={14} borderRadius={spacing.xxs} style={styles.similarLine} />
          <Skeleton width={72} height={12} borderRadius={spacing.xxs} />
        </View>
      ))}
    </View>
  );
}

/**
 * Initial load layout aligned with `DetailScreen` (backdrop, title, chips, watch CTA, synopsis, cast, similar).
 * Render inside the screen’s vertical `ScrollView`; horizontal strips use nested `ScrollView`s.
 */
export function DetailScreenSkeleton({ backdropHeight }: DetailScreenSkeletonProps) {
  return (
    <View>
      {backdropHeight != null ? (
        <Skeleton width="100%" height={backdropHeight} borderRadius={0} />
      ) : null}

      <View style={styles.body}>
        <Skeleton width="92%" height={36} borderRadius={spacing.xs} />
        <View style={styles.chipRow}>
          {[0, 1, 2, 3].map(i => (
            <Skeleton key={i} width={i === 0 ? 96 : 72} height={28} borderRadius={spacing.xs} />
          ))}
        </View>

        <Skeleton width="100%" height={48} borderRadius={spacing.xs} style={styles.watchBtn} />

        <Skeleton width={96} height={22} borderRadius={spacing.xs} style={styles.headline} />
        <Skeleton width="100%" height={16} borderRadius={spacing.xxs} style={styles.bodyLine} />
        <Skeleton width="100%" height={16} borderRadius={spacing.xxs} style={styles.bodyLine} />
        <Skeleton width="78%" height={16} borderRadius={spacing.xxs} style={styles.bodyLine} />

        <Skeleton width={64} height={22} borderRadius={spacing.xs} style={styles.sectionHead} />
        <DetailCastRowSkeleton />

        <View style={styles.rowHead}>
          <Skeleton width="48%" height={22} borderRadius={spacing.xs} />
          <Skeleton width={56} height={18} borderRadius={spacing.xs} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.similarScroll}>
          <DetailSimilarRowSkeleton />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  watchBtn: {
    marginTop: spacing.md,
  },
  headline: {
    marginTop: spacing.lg,
  },
  bodyLine: {
    marginTop: spacing.xs,
  },
  sectionHead: {
    marginTop: spacing.lg,
  },
  castScroll: {
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingRight: spacing.md,
  },
  castCell: {
    width: CAST_CELL_W,
  },
  castLine: {
    marginTop: spacing.xxs,
  },
  castLineSm: {
    marginTop: spacing.xxs,
  },
  rowHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  similarScroll: {
    paddingBottom: spacing.sm,
  },
  similarStrip: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  similarCard: {
    width: SIMILAR_CARD_W,
    marginRight: spacing.sm,
  },
  similarLine: {
    marginTop: spacing.xs,
    marginBottom: spacing.xxs,
  },
});
