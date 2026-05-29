/**
 * Principle: SRP — coordinator hook for NotificationsScreen.
 * Composes useMerchantNotifications and exposes only what the screen needs.
 */
import { useCallback } from 'react';
import { useMerchantNotifications } from './useMerchantNotifications';
import type { MerchantNotification } from '../../../types/models';

export interface UseNotificationsScreenResult {
  notifications: MerchantNotification[];
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  isMarkingAllRead: boolean;
  handleMarkRead: (id: number) => void;
  handleMarkAllRead: () => void;
  handleRefresh: () => void;
}

export function useNotificationsScreen(): UseNotificationsScreenResult {
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

  const handleMarkRead = useCallback((id: number) => {
    markRead(id);
  }, [markRead]);

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
    handleMarkRead,
    handleMarkAllRead,
    handleRefresh,
  };
}
