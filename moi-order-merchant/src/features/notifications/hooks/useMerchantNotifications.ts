/**
 * Principle: SRP — data hook for merchant notification list + unread count.
 * Principle: DIP — all HTTP through typed api/ functions.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../../api/merchantNotifications';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME, QUERY_RETRY } from '../../../shared/constants/config';
import type { MerchantNotification, PaginationMeta } from '../../../types/models';

export interface UseMerchantNotificationsResult {
  notifications: MerchantNotification[];
  meta: PaginationMeta | undefined;
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  markRead: (id: number) => void;
  markAllRead: () => void;
  isMarkingAllRead: boolean;
}

export function useMerchantNotifications(): UseMerchantNotificationsResult {
  const queryClient = useQueryClient();

  const {
    data: listData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey:  QUERY_KEYS.NOTIFICATIONS.LIST,
    queryFn:   () => getNotifications(1),
    staleTime: CACHE_TTL.NOTIFICATIONS,
    gcTime:    GC_TIME.DEFAULT,
    retry:     QUERY_RETRY,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey:  QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT,
    queryFn:   getUnreadCount,
    staleTime: CACHE_TTL.NOTIFICATIONS,
    gcTime:    GC_TIME.DEFAULT,
    retry:     QUERY_RETRY,
    // Poll every 30s even without WebSocket so the bell stays accurate.
    refetchInterval: CACHE_TTL.NOTIFICATIONS,
  });

  const { mutate: mutateMarkRead } = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.LIST });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT });
    },
  });

  const { mutate: mutateMarkAll, isPending: isMarkingAllRead } = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.LIST });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT });
    },
  });

  return {
    notifications: listData?.data ?? [],
    meta:          listData?.meta,
    unreadCount,
    isLoading,
    isError,
    refetch:       () => { void refetch(); },
    markRead:      (id: number) => mutateMarkRead(id),
    markAllRead:   () => mutateMarkAll(),
    isMarkingAllRead,
  };
}
