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
  type NotificationGroup,
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

export function useMerchantNotifications(group: NotificationGroup = 'orders'): UseMerchantNotificationsResult {
  const queryClient = useQueryClient();

  const listKey   = group === 'chat' ? QUERY_KEYS.NOTIFICATIONS.CHAT_LIST   : QUERY_KEYS.NOTIFICATIONS.LIST;
  const countKey  = group === 'chat' ? QUERY_KEYS.NOTIFICATIONS.CHAT_UNREAD_COUNT : QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT;

  const {
    data: listData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey:  listKey,
    queryFn:   () => getNotifications(1, group),
    staleTime: CACHE_TTL.NOTIFICATIONS,
    gcTime:    GC_TIME.DEFAULT,
    retry:     QUERY_RETRY,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey:        countKey,
    queryFn:         () => getUnreadCount(group),
    staleTime:       CACHE_TTL.NOTIFICATIONS,
    gcTime:          GC_TIME.DEFAULT,
    retry:           QUERY_RETRY,
    refetchInterval: CACHE_TTL.NOTIFICATIONS,
  });

  const { mutate: mutateMarkRead } = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const { mutate: mutateMarkAll, isPending: isMarkingAllRead } = useMutation({
    mutationFn: () => markAllNotificationsRead(group),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
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
