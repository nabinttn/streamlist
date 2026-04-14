import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconArrowBack } from '../components/icons/StreamlistIcons';
import type { NotificationsScreenProps } from '../navigation/types';
import { colors } from '../theme/colors';
import { iconSize } from '../theme/iconSizes';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { DummyNotification } from '../utils/notificationDummy';
import {
  bucketNotifications,
  createInitialDummyNotifications,
  formatNotificationTime,
  generateOlderNotificationsPage,
  MAX_DUMMY_PAGES,
} from '../utils/notificationDummy';

type ListRow =
  | {
      kind: 'header';
      id: string;
      title: string;
      count: number;
    }
  | { kind: 'item'; notification: DummyNotification };

function buildRows(notifications: DummyNotification[]): ListRow[] {
  const { today, thisWeek, earlier } = bucketNotifications(notifications);
  const rows: ListRow[] = [];

  if (today.length > 0) {
    rows.push({
      kind: 'header',
      id: 'section-today',
      title: 'Today',
      count: today.length,
    });
    for (const n of today) {
      rows.push({ kind: 'item', notification: n });
    }
  }

  if (thisWeek.length > 0) {
    rows.push({
      kind: 'header',
      id: 'section-week',
      title: 'This week',
      count: thisWeek.length,
    });
    for (const n of thisWeek) {
      rows.push({ kind: 'item', notification: n });
    }
  }

  if (earlier.length > 0) {
    rows.push({
      kind: 'header',
      id: 'section-earlier',
      title: 'Earlier',
      count: earlier.length,
    });
    for (const n of earlier) {
      rows.push({ kind: 'item', notification: n });
    }
  }

  return rows;
}

type Props = NotificationsScreenProps;

export function NotificationsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<DummyNotification[]>(() =>
    createInitialDummyNotifications(),
  );
  const [nextPage, setNextPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const listRows = useMemo(() => buildRows(notifications), [notifications]);
  const totalCount = notifications.length;

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) {
      return;
    }
    if (nextPage >= MAX_DUMMY_PAGES) {
      setHasMore(false);
      return;
    }
    setLoadingMore(true);
    const page = nextPage;
    setTimeout(() => {
      setNotifications(prev => [
        ...prev,
        ...generateOlderNotificationsPage(page),
      ]);
      setNextPage(p => p + 1);
      setLoadingMore(false);
      if (page + 1 >= MAX_DUMMY_PAGES) {
        setHasMore(false);
      }
    }, 400);
  }, [loadingMore, hasMore, nextPage]);

  const renderItem: ListRenderItem<ListRow> = ({ item }) => {
    if (item.kind === 'header') {
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <Text style={styles.sectionCount}>{item.count}</Text>
        </View>
      );
    }
    const { notification: n } = item;
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{n.title}</Text>
        <Text style={styles.cardBody}>{n.body}</Text>
        <Text style={styles.cardTime}>{formatNotificationTime(n.at)}</Text>
      </View>
    );
  };

  const keyExtractor = (row: ListRow) =>
    row.kind === 'header' ? row.id : row.notification.id;

  const ListHeader = (
    <View style={styles.listHeader}>
      <Text style={styles.totalLine}>
        {totalCount} notification{totalCount === 1 ? '' : 's'} total
      </Text>
    </View>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          accessibilityLabel="Back">
          <IconArrowBack size={iconSize.detailBack} color={colors.on_surface} />
        </Pressable>
        <Text style={styles.screenTitle} numberOfLines={1}>
          Notifications
        </Text>
        <View style={{ width: iconSize.detailBack }} />
      </View>

      <FlatList
        data={listRows}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
        onEndReached={loadMore}
        onEndReachedThreshold={0.35}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              style={styles.footerSpinner}
              color={colors.primary}
            />
          ) : null
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No notifications yet.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  screenTitle: {
    ...typography.titleLg,
    color: colors.on_surface,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.md,
  },
  listHeader: {
    marginBottom: spacing.md,
  },
  totalLine: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.titleSm,
    color: colors.on_surface_variant,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionCount: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
  },
  card: {
    backgroundColor: colors.surface_container_low,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  cardTitle: {
    ...typography.titleSm,
    color: colors.on_surface,
  },
  cardBody: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
  },
  cardTime: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    marginTop: spacing.sm,
  },
  footerSpinner: {
    marginVertical: spacing.lg,
  },
  empty: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
