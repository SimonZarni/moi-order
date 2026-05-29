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
import type { MerchantNotification } from '../../../types/models';

export function NotificationsScreen(): React.JSX.Element {
  const {
    notifications, unreadCount, isLoading, isError, isMarkingAllRead,
    handleMarkRead, handleMarkAllRead, handleRefresh,
  } = useNotificationsScreen();

  const renderItem: ListRenderItem<MerchantNotification> = ({ item, index }) => (
    <>
      <NotificationItem notification={item} onPress={handleMarkRead} />
      {index < notifications.length - 1 && <View style={styles.divider} />}
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.eyebrow}>INBOX</Text>
          <Text style={styles.pageTitle}>
            Notifications{unreadCount > 0 ? ` · ${unreadCount}` : ''}
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
            <Text style={styles.markAllText}>Mark all read</Text>
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
          <Text style={styles.emptyTitle}>Failed to load notifications</Text>
          <Pressable onPress={handleRefresh} accessibilityRole="button" accessibilityLabel="Retry">
            <Text style={{ color: colours.primary }}>Tap to retry</Text>
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
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySubtitle}>
                New orders and updates will appear here.
              </Text>
            </View>
          }
          accessibilityRole="list"
        />
      )}
    </SafeAreaView>
  );
}
