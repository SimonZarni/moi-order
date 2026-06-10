/**
 * Principle: SRP — coordinator hook for NotificationsScreen.
 * Composes useMerchantNotifications and exposes only what the screen needs.
 */
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMerchantNotifications } from './useMerchantNotifications';
import type { MerchantNotification } from '../../../types/models';
import type { MerchantStackParamList } from '../../../types/navigation';

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

export function useNotificationsScreen(): UseNotificationsScreenResult {
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

    if (notification.order_id !== null) {
      navigation.navigate('OrderDetail', { orderId: notification.order_id });
    }
  }, [markRead, navigation]);

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
