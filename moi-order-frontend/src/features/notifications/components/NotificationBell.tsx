import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { useNotificationStore } from '@/shared/store/notificationStore';
import { styles } from './NotificationBell.styles';

interface NotificationBellProps {
  onPress: () => void;
}

export function NotificationBell({ onPress }: NotificationBellProps): React.JSX.Element {
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      accessibilityLabel={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
      accessibilityRole="button"
    >
      <Feather name="bell" size={20} color={colours.textOnDark} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : String(unreadCount)}</Text>
        </View>
      )}
    </Pressable>
  );
}
