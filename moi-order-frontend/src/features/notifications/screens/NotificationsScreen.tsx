import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNotificationsScreen } from '@/features/notifications/hooks/useNotificationsScreen';
import { NotificationItem } from '@/features/notifications/components/NotificationItem';
import { AppNotification } from '@/types/models';
import { styles } from './NotificationsScreen.styles';

export function NotificationsScreen(): React.JSX.Element {
  const {
    notifications,
    isLoading,
    isMarkingRead,
    handleMarkAllRead,
    handleDeleteAll,
    handleDeleteOne,
    handleNotificationPress,
    handleBack,
  } = useNotificationsScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.hero}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityLabel="Go back" accessibilityRole="button">
          <Text style={styles.backLabel}>←</Text>
        </Pressable>
        <Text style={styles.heroTitle}>Notifications</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.actionsRow}>
          <Pressable onPress={handleMarkAllRead} accessibilityRole="button" accessibilityLabel="Mark all as read">
            <Text style={styles.actionText}>{isMarkingRead ? 'Marking…' : 'Mark all read'}</Text>
          </Pressable>
          <Pressable onPress={handleDeleteAll} accessibilityRole="button" accessibilityLabel="Clear all notifications">
            <Text style={[styles.actionText, styles.actionDanger]}>Clear all</Text>
          </Pressable>
        </View>

        <FlatList<AppNotification>
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onPress={handleNotificationPress}
              onDelete={handleDeleteOne}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{isLoading ? 'Loading…' : 'No notifications'}</Text>
          }
          accessibilityRole="list"
        />
      </View>
    </SafeAreaView>
  );
}
