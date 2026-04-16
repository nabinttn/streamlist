import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  IconMovie,
  IconNotificationsOutline,
} from '../icons/StreamlistIcons';
import { colors } from '../../theme/colors';
import { iconSize } from '../../theme/iconSizes';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type MainTabHeaderProps = {
  onPressNotifications: () => void;
};

/**
 * Shared top bar for main tab roots: brand mark + StreamList wordmark, notifications affordance.
 * Matches the Home screen header pattern.
 */
export function MainTabHeader({ onPressNotifications }: MainTabHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <IconMovie size={iconSize.topBarLogo} color={colors.brand} />
        <Text style={styles.logo}>StreamList</Text>
      </View>
      <Pressable
        hitSlop={12}
        accessibilityLabel="Notifications"
        accessibilityRole="button"
        onPress={onPressNotifications}>
        <IconNotificationsOutline
          size={iconSize.topBar}
          color={colors.on_surface_variant}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
