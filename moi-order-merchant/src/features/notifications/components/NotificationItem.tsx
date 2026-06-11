import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './NotificationItem.styles';
import { colours } from '../../../shared/theme/colours';
import { formatDate } from '../../../shared/utils/formatDate';
import type { MerchantNotification, MerchantNotificationType } from '../../../types/models';

interface NotificationItemProps {
  notification: MerchantNotification;
  onPress: (notification: MerchantNotification) => void;
}

const ICON_MAP: Record<MerchantNotificationType, keyof typeof Ionicons.glyphMap> = {
  new_order:    'receipt',
  order_status: 'checkmark-circle',
  chat_message: 'chatbubble-ellipses',
  system:       'information-circle',
};

const ICON_BG: Record<MerchantNotificationType, string> = {
  new_order:    colours.primary + '22',
  order_status: colours.success + '22',
  chat_message: colours.info    + '22',
  system:       colours.info    + '22',
};

const ICON_COLOUR: Record<MerchantNotificationType, string> = {
  new_order:    colours.primary,
  order_status: colours.success,
  chat_message: colours.info,
  system:       colours.info,
};

export function NotificationItem({ notification, onPress }: NotificationItemProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        !notification.is_read && styles.rowUnread,
        pressed && styles.rowPressed,
      ]}
      onPress={() => onPress(notification)}
      accessibilityRole="button"
      accessibilityLabel={notification.title}
    >
      {/* Unread dot */}
      <View style={[styles.dot, notification.is_read && styles.dotRead]} />

      {/* Icon badge */}
      <View style={[styles.iconBadge, { backgroundColor: ICON_BG[notification.type] }]}>
        <Ionicons
          name={ICON_MAP[notification.type]}
          size={18}
          color={ICON_COLOUR[notification.type]}
        />
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <Text style={[styles.title, notification.is_read && styles.titleRead]}>
          {notification.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>{notification.body}</Text>
        <Text style={styles.time}>{formatDate(notification.created_at)}</Text>
      </View>
    </Pressable>
  );
}
