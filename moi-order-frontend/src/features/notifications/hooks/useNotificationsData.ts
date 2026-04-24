import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteAllNotifications,
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead,
} from '@/shared/api/notifications';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { useNotificationStore } from '@/shared/store/notificationStore';
import { AppNotification } from '@/types/models';

export interface UseNotificationsDataResult {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  isMarkingRead: boolean;
  markAllRead: () => void;
  deleteOne: (id: string) => void;
  deleteAll: () => void;
}

export function useNotificationsData(): UseNotificationsDataResult {
  const queryClient = useQueryClient();
  const { setUnreadCount, resetUnread } = useNotificationStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.LIST,
    queryFn: fetchNotifications,
    staleTime: 0,
  });

  useEffect(() => {
    if (data !== undefined) {
      setUnreadCount(data.meta.unread_count);
    }
  }, [data, setUnreadCount]);

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.LIST });
      resetUnread();
    },
  });

  const deleteOneMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.LIST });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.LIST });
      resetUnread();
    },
  });

  return {
    notifications:  data?.data ?? [],
    unreadCount:    data?.meta.unread_count ?? 0,
    isLoading,
    isError,
    isMarkingRead:  markAllReadMutation.isPending,
    markAllRead:    () => markAllReadMutation.mutate(),
    deleteOne:      (id: string) => deleteOneMutation.mutate(id),
    deleteAll:      () => deleteAllMutation.mutate(),
  };
}
