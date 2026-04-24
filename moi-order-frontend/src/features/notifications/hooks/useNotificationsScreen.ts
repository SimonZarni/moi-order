import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useNotificationsData } from '@/features/notifications/hooks/useNotificationsData';
import { AppNotification } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

export interface UseNotificationsScreenResult {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  isMarkingRead: boolean;
  handleMarkAllRead: () => void;
  handleDeleteOne: (id: string) => void;
  handleDeleteAll: () => void;
  handleNotificationPress: (notification: AppNotification) => void;
  handleBack: () => void;
}

export function useNotificationsScreen(): UseNotificationsScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    notifications,
    unreadCount,
    isLoading,
    isError,
    isMarkingRead,
    markAllRead,
    deleteOne,
    deleteAll,
  } = useNotificationsData();

  const handleMarkAllRead = useCallback((): void => {
    markAllRead();
  }, [markAllRead]);

  const handleDeleteOne = useCallback((id: string): void => {
    deleteOne(id);
  }, [deleteOne]);

  const handleDeleteAll = useCallback((): void => {
    deleteAll();
  }, [deleteAll]);

  const handleNotificationPress = useCallback((notification: AppNotification): void => {
    if (notification.data.submission_id !== undefined) {
      navigation.navigate('OrderDetail', { submissionId: notification.data.submission_id });
    } else if (notification.data.ticket_order_id !== undefined) {
      navigation.navigate('TicketOrderDetail', { ticketOrderId: notification.data.ticket_order_id });
    }
  }, [navigation]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return {
    notifications,
    unreadCount,
    isLoading,
    isError,
    isMarkingRead,
    handleMarkAllRead,
    handleDeleteOne,
    handleDeleteAll,
    handleNotificationPress,
    handleBack,
  };
}
