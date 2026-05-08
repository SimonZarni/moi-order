import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNotificationsScreen } from '@/features/notifications/hooks/useNotificationsScreen';
import { NotificationItem } from '@/features/notifications/components/NotificationItem';
import { AppNotification } from '@/types/models';
import { useStrings } from '@/shared/i18n';
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
  const s = useStrings();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.hero}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityLabel={s.common.back} accessibilityRole="button">
          <Text style={styles.backLabel}>←</Text>
        </Pressable>
        <Text style={styles.heroTitle}>{s.notifs.title}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.actionsRow}>
          <Pressable onPress={handleMarkAllRead} accessibilityRole="button" accessibilityLabel={s.notifs.markAllRead}>
            <Text style={styles.actionText}>{isMarkingRead ? s.notifs.marking : s.notifs.markAllRead}</Text>
          </Pressable>
          <Pressable onPress={handleDeleteAll} accessibilityRole="button" accessibilityLabel={s.notifs.clearAll}>
            <Text style={[styles.actionText, styles.actionDanger]}>{s.notifs.clearAll}</Text>
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
            <Text style={styles.emptyText}>{isLoading ? s.notifs.loading : s.notifs.noNotifs}</Text>
          }
          accessibilityRole="list"
        />
      </View>
    </SafeAreaView>
  );
}
