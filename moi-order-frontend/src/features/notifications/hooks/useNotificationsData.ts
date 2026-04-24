import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteAllNotifications,
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/shared/api/notifications';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { useAuthStore } from '@/shared/store/authStore';
import { useNotificationStore } from '@/shared/store/notificationStore';
import { AppNotification } from '@/types/models';

export interface UseNotificationsDataResult {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  isMarkingRead: boolean;
  markOneRead: (id: string) => void;
  markAllRead: () => void;
  deleteOne: (id: string) => void;
  deleteAll: () => void;
}

export function useNotificationsData(): UseNotificationsDataResult {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const { setUnreadCount, decrementUnread, resetUnread } = useNotificationStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.LIST,
    queryFn: fetchNotifications,
    staleTime: 0,
    enabled: userId !== null,
  });

  // Seed Zustand unreadCount from the API response so the bell badge is accurate
  // both on app start (when AppShell mounts this hook) and after any refetch.
  useEffect(() => {
    if (data !== undefined) {
      setUnreadCount(data.meta.unread_count);
    }
  }, [data, setUnreadCount]);

  const markOneReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onMutate: () => {
      // Optimistically decrement the badge so it updates the moment the user taps.
      decrementUnread();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.LIST });
    },
  });

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
    markOneRead:    (id: string) => markOneReadMutation.mutate(id),
    markAllRead:    () => markAllReadMutation.mutate(),
    deleteOne:      (id: string) => deleteOneMutation.mutate(id),
    deleteAll:      () => deleteAllMutation.mutate(),
  };
}
