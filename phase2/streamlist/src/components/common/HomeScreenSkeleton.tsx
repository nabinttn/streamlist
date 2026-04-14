import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

/** Matches `HomeScreen` hero `minHeight` and horizontal row poster width (140). */
const HERO_MIN_H = 460;
const ROW_CARD_W = 140;
const ROW_POSTER_H = (ROW_CARD_W * 3) / 2;
const ROW_STRIP_H = ROW_POSTER_H + spacing.md * 2 + 40;

function RowStripSkeleton() {
  const placeholders = [0, 1, 2, 3, 4];
  return (
    <View style={styles.rowStrip}>
      {placeholders.map(i => (
        <View key={i} style={styles.rowCard}>
          <Skeleton
            width={ROW_CARD_W}
            height={ROW_POSTER_H}
            borderRadius={spacing.md}
          />
          <Skeleton
            width={ROW_CARD_W - spacing.sm}
            height={14}
            borderRadius={spacing.xs}
            style={styles.rowTitleLine}
          />
          <Skeleton width={96} height={12} borderRadius={spacing.xs} />
        </View>
      ))}
    </View>
  );
}

function HomeRowBlockSkeleton() {
  return (
    <View style={styles.rowBlock}>
      <View style={styles.rowHeader}>
        <Skeleton width="48%" height={22} borderRadius={spacing.xs} />
        <Skeleton width={56} height={18} borderRadius={spacing.xs} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowScroll}>
        <RowStripSkeleton />
      </ScrollView>
    </View>
  );
}

/**
 * Full-page skeleton aligned with `HomeScreen` layout (header, chips, hero, three rows).
 */
export function HomeScreenSkeleton() {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Skeleton width={160} height={28} borderRadius={spacing.xs} />
        <Skeleton width={28} height={28} borderRadius={spacing.sm} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipStrip}>
        {[0, 1, 2, 3, 4].map(i => (
          <Skeleton
            key={i}
            width={i === 0 ? 44 : 72}
            height={32}
            borderRadius={spacing.sm}
          />
        ))}
      </ScrollView>

      <View style={styles.heroWrap}>
        <Skeleton
          width="100%"
          height={HERO_MIN_H}
          borderRadius={spacing.md}
        />
        <View style={styles.heroOverlay} pointerEvents="none">
          <Skeleton width={112} height={22} borderRadius={spacing.xs} />
          <Skeleton width="92%" height={32} borderRadius={spacing.xs} style={styles.heroGap} />
          <Skeleton width="88%" height={16} borderRadius={spacing.xs} />
          <Skeleton width="72%" height={16} borderRadius={spacing.xs} style={styles.heroGapSm} />
          <View style={styles.heroBtns}>
            <Skeleton height={48} borderRadius={9999} style={styles.heroCta} />
            <Skeleton width={100} height={48} borderRadius={9999} />
          </View>
        </View>
      </View>

      <HomeRowBlockSkeleton />
      <HomeRowBlockSkeleton />
      <HomeRowBlockSkeleton />
    </View>
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
  chipStrip: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  heroWrap: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    position: 'relative',
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  heroGap: {
    marginTop: spacing.sm,
  },
  heroGapSm: {
    marginTop: spacing.xs,
  },
  heroBtns: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  heroCta: {
    flex: 1,
    minWidth: 148,
  },
  rowBlock: {
    marginBottom: spacing.lg,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  rowScroll: {
    paddingHorizontal: spacing.md,
  },
  rowStrip: {
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: ROW_STRIP_H,
  },
  rowCard: {
    width: ROW_CARD_W,
  },
  rowTitleLine: {
    marginTop: spacing.xs,
    marginBottom: spacing.xxs,
  },
});
