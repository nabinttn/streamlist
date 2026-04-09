import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Profile</Text>
      <Pressable
        onPress={() => Alert.alert('StreamList', 'Coming Soon')}
        style={styles.box}>
        <Text style={styles.body}>More settings coming soon.</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.headlineMd,
    color: colors.on_surface,
    marginBottom: spacing.md,
  },
  box: {
    padding: spacing.md,
    backgroundColor: colors.surface_container,
    borderRadius: spacing.sm,
  },
  body: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
  },
});
