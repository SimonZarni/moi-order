import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { formatDate } from '@/shared/utils/formatDate';
import { AppNotification } from '@/types/models';
import { styles } from './NotificationItem.styles';

interface NotificationItemProps {
  notification: AppNotification;
  onPress: (notification: AppNotification) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({ notification, onPress, onDelete }: NotificationItemProps): React.JSX.Element {
  const isUnread = notification.read_at === null;

  return (
    <Pressable
      style={[styles.row, isUnread && styles.rowUnread]}
      onPress={() => onPress(notification)}
      accessibilityLabel={notification.title}
      accessibilityRole="button"
    >
      <View style={styles.indicator}>
        {isUnread && <View style={styles.unreadDot} />}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, isUnread && styles.titleUnread]} numberOfLines={1}>
          {notification.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={styles.time}>{formatDate(notification.created_at)}</Text>
      </View>

      <Pressable
        style={styles.deleteBtn}
        onPress={() => onDelete(notification.id)}
        accessibilityLabel="Delete notification"
        accessibilityRole="button"
        hitSlop={8}
      >
        <Feather name="trash-2" size={16} color={colours.textMuted} />
      </Pressable>
    </Pressable>
  );
}
