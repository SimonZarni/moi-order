/**
 * Principle: SRP — coordinator hook for NotificationsScreen.
 * Composes useMerchantNotifications and exposes only what the screen needs.
 *
 * onPressNotification: optional override for web, where NotificationsScreen is
 * rendered outside the MobileStack and useNavigation() resolves to the root
 * navigator (which has no OrderDetail/OrderChat). Web callers pass state setters
 * instead. On mobile the hook falls back to React Navigation.
 */
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMerchantNotifications } from './useMerchantNotifications';
import type { MerchantNotification } from '../../../types/models';
import type { MerchantStackParamList } from '../../../types/navigation';

interface UseNotificationsScreenParams {
  onPressNotification?: (notification: MerchantNotification) => void;
}

export interface UseNotificationsScreenResult {
  notifications: MerchantNotification[];
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  isMarkingAllRead: boolean;
  handlePressNotification: (notification: MerchantNotification) => void;
  handleMarkAllRead: () => void;
  handleRefresh: () => void;
}

export function useNotificationsScreen(
  { onPressNotification }: UseNotificationsScreenParams = {},
): UseNotificationsScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();

  const {
    notifications,
    unreadCount,
    isLoading,
    isError,
    isMarkingAllRead,
    markRead,
    markAllRead,
    refetch,
  } = useMerchantNotifications();

  const handlePressNotification = useCallback((notification: MerchantNotification) => {
    if (!notification.is_read) {
      markRead(notification.id);
    }

    if (onPressNotification) {
      onPressNotification(notification);
      return;
    }

    if (notification.order_id === null) return;

    if (notification.type === 'chat_message') {
      navigation.navigate('OrderChat', { orderId: notification.order_id });
    } else {
      navigation.navigate('OrderDetail', { orderId: notification.order_id });
    }
  }, [markRead, navigation, onPressNotification]);

  const handleMarkAllRead = useCallback(() => {
    markAllRead();
  }, [markAllRead]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    notifications,
    unreadCount,
    isLoading,
    isError,
    isMarkingAllRead,
    handlePressNotification,
    handleMarkAllRead,
    handleRefresh,
  };
}
