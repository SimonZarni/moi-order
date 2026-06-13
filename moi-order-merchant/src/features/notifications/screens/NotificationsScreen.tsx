import React from 'react';
import {
  View, Text, FlatList, ActivityIndicator, Pressable, ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotificationsScreen } from '../hooks/useNotificationsScreen';
import { NotificationItem } from '../components/NotificationItem';
import { styles } from './NotificationsScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { MerchantNotification } from '../../../types/models';

interface NotificationsScreenProps {
  onPressNotification?: (notification: MerchantNotification) => void;
}

export function NotificationsScreen({ onPressNotification }: NotificationsScreenProps = {}): React.JSX.Element {
  const t = useTranslation();
  const {
    notifications, unreadCount, isLoading, isError, isMarkingAllRead,
    handlePressNotification, handleMarkAllRead, handleRefresh,
  } = useNotificationsScreen({ onPressNotification });

  const renderItem: ListRenderItem<MerchantNotification> = ({ item, index }) => (
    <>
      <NotificationItem notification={item} onPress={handlePressNotification} />
      {index < notifications.length - 1 && <View style={styles.divider} />}
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.eyebrow}>{t('notif_inbox')}</Text>
          <Text style={styles.pageTitle}>
            {t('notif_title')}{unreadCount > 0 ? ` · ${unreadCount}` : ''}
          </Text>
        </View>
        {unreadCount > 0 && (
          <Pressable
            style={[styles.markAllBtn, isMarkingAllRead && styles.markAllBtnDisabled]}
            onPress={handleMarkAllRead}
            disabled={isMarkingAllRead}
            accessibilityRole="button"
            accessibilityLabel="Mark all as read"
          >
            <Text style={styles.markAllText}>{t('notif_mark_all_read')}</Text>
          </Pressable>
        )}
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colours.primary} />
        </View>
      )}

      {!isLoading && isError && (
        <View style={styles.centered}>
          <Ionicons name="warning-outline" size={32} color={colours.error} />
          <Text style={styles.emptyTitle}>{t('notif_failed_load')}</Text>
          <Pressable onPress={handleRefresh} accessibilityRole="button" accessibilityLabel="Retry">
            <Text style={{ color: colours.primary }}>{t('notif_retry')}</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && !isError && (
        <FlatList
          style={styles.flex}
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          onRefresh={handleRefresh}
          refreshing={false}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons name="notifications-off-outline" size={40} color={colours.textSubtle} />
              <Text style={styles.emptyTitle}>{t('notif_no_notifications')}</Text>
              <Text style={styles.emptySubtitle}>{t('notif_subtitle')}</Text>
            </View>
          }
          accessibilityRole="list"
        />
      )}
    </SafeAreaView>
  );
}
