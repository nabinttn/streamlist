import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconPersonOutline } from '../components/icons/StreamlistIcons';
import { colors } from '../theme/colors';
import { iconSize } from '../theme/iconSizes';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const DUMMY_STATS = [
  { label: 'Rated', value: '24' },
  { label: 'Lists', value: '3' },
  { label: 'Hours', value: '48' },
] as const;

const MENU_ROWS = [
  { title: 'Account settings', detail: 'Email, password, region' },
  { title: 'Notifications', detail: 'Push and email' },
  { title: 'Privacy', detail: 'Data and visibility' },
  { title: 'Help & support', detail: 'FAQs and contact' },
  { title: 'About StreamList', detail: 'Version and credits' },
] as const;

export function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.root, { paddingTop: insets.top }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Profile</Text>

      <View style={styles.hero}>
        <View style={styles.avatar}>
          <IconPersonOutline size={iconSize.topBar + 8} color={colors.on_surface_variant} />
        </View>
        <Text style={styles.displayName}>Alex Rivera</Text>
        <Text style={styles.email}>alex.rivera@example.com</Text>
        <Text style={styles.memberSince}>Member since 2024</Text>
      </View>

      <View style={styles.statsRow}>
        {DUMMY_STATS.map(s => (
          <View key={s.label} style={styles.statCell}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Settings</Text>
      <View style={styles.menuCard}>
        {MENU_ROWS.map((row, i) => (
          <Pressable
            key={row.title}
            onPress={() =>
              Alert.alert(row.title, 'This is placeholder content for the demo.')
            }
            style={({ pressed }) => [
              styles.menuRow,
              i < MENU_ROWS.length - 1 && styles.menuRowBorder,
              pressed && styles.menuRowPressed,
            ]}>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>{row.title}</Text>
              <Text style={styles.menuDetail}>{row.detail}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.footerNote}>
        StreamList demo — preferences and streaming providers would appear here.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  screenTitle: {
    ...typography.headlineMd,
    color: colors.on_surface,
    marginBottom: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surface_container_high,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  displayName: {
    ...typography.titleLg,
    color: colors.on_surface,
  },
  email: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    marginTop: spacing.xxs,
  },
  memberSince: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCell: {
    flex: 1,
    backgroundColor: colors.surface_container,
    borderRadius: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
  },
  statValue: {
    ...typography.headlineMd,
    color: colors.on_surface,
  },
  statLabel: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    marginTop: spacing.xxs,
  },
  sectionLabel: {
    ...typography.titleSm,
    color: colors.on_surface_variant,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuCard: {
    backgroundColor: colors.surface_container_low,
    borderRadius: spacing.md,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outline_variant,
  },
  menuRowPressed: {
    backgroundColor: colors.surface_container_high,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    ...typography.titleSm,
    color: colors.on_surface,
  },
  menuDetail: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    marginTop: spacing.xxs,
  },
  chevron: {
    ...typography.headlineMd,
    color: colors.on_surface_variant,
    marginLeft: spacing.sm,
  },
  footerNote: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    textAlign: 'center',
    lineHeight: 18,
  },
});
