/**
 * Self-contained bell icon with unread badge.
 * Principle: SRP — renders the bell + badge; data fetched from hook; navigation owned by parent.
 * Principle: DIP — receives onPress from parent (navigation context varies: web vs mobile).
 */
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './NotificationBell.styles';
import { useQuery } from '@tanstack/react-query';
import { getUnreadCount } from '../../../api/merchantNotifications';
// Bell shows order notifications only; chat notifications have a separate icon in NotificationsScreen.
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME, QUERY_RETRY } from '../../../shared/constants/config';

interface NotificationBellProps {
  onPress: () => void;
  /** Icon colour — pass 'rgba(255,255,255,0.6)' for dark sidebar */
  iconColour?: string;
}

export function NotificationBell({ onPress, iconColour = 'rgba(255,255,255,0.6)' }: NotificationBellProps): React.JSX.Element {
  const { data: unreadCount = 0 } = useQuery({
    queryKey:        QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT,
    queryFn:         () => getUnreadCount('orders'),
    staleTime:       CACHE_TTL.NOTIFICATIONS,
    gcTime:          GC_TIME.DEFAULT,
    retry:           QUERY_RETRY,
    refetchInterval: CACHE_TTL.NOTIFICATIONS,
  });

  const displayCount = unreadCount > 99 ? '99+' : String(unreadCount);

  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
    >
      <Ionicons name="notifications-outline" size={20} color={iconColour} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{displayCount}</Text>
        </View>
      )}
    </Pressable>
  );
}
