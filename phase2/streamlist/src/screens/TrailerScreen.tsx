import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconArrowBack } from '../components/icons/StreamlistIcons';
import type { TrailerScreenProps } from '../navigation/types';
import { colors } from '../theme/colors';
import { iconSize } from '../theme/iconSizes';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export function TrailerScreen({ navigation, route }: TrailerScreenProps) {
  const { youtubeVideoId, title } = route.params;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const playerWidth = width - spacing.md * 2;
  const playerHeight = Math.max(Math.round((playerWidth * 9) / 16), 200);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPlayerReady = useCallback(() => {
    setReady(true);
  }, []);

  const onClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Back">
          <IconArrowBack size={iconSize.detailBack} color={colors.on_surface} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title ?? 'Trailer'}
        </Text>
        <View style={{ width: iconSize.detailBack }} />
      </View>

      <View style={styles.playerWrap}>
        {error ? (
          <Text style={styles.err}>{error}</Text>
        ) : (
          <View style={[styles.playerBox, { width: playerWidth, height: playerHeight }]}>
            <YoutubePlayer
              height={playerHeight}
              width={playerWidth}
              videoId={youtubeVideoId}
              onReady={onPlayerReady}
              onError={(err: string) => setError(err)}
            />
            {!ready ? (
              <View style={styles.spinnerOverlay} pointerEvents="none">
                <View style={styles.spinnerAboveCenter}>
                  <ActivityIndicator color={colors.primary} size="large" />
                </View>
              </View>
            ) : null}
          </View>
        )}
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.titleLg,
    color: colors.on_surface,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  playerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  playerBox: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface_container_lowest,
  },
  /** Nudges the loader slightly above the midpoint so it matches the focal point of the frame. */
  spinnerAboveCenter: {
    transform: [{ translateY: -spacing.xl }],
  },
  err: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
