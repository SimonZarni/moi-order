import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrder, updateOrderStatus, cancelOrderWithReason, CancelOrderPayload } from '../../../api/orders';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME, PUSHER_APP_KEY, PUSHER_APP_CLUSTER, BROADCAST_AUTH_URL } from '../../../shared/constants/config';
import { useAuthStore } from '../../../store/authStore';
import { ORDER_STATUS } from '../../../types/enums';
import type { FoodOrder } from '../../../types/models';

const TERMINAL_STATUSES = new Set([
  ORDER_STATUS.Completed,
  ORDER_STATUS.Cancelled,
  ORDER_STATUS.Expired,
]);

// ── Pusher type shims (avoids hard dep on @types/pusher-js) ──────────────────

interface PusherChannel {
  bind(event: string, callback: (data: unknown) => void): void;
  unbind_all(): void;
}
interface PusherInstance {
  subscribe(channel: string): PusherChannel;
  unsubscribe(channel: string): void;
  disconnect(): void;
}
type PusherConstructorFn = new (key: string, options: object) => PusherInstance;

// ─────────────────────────────────────────────────────────────────────────────

interface UseOrderDetailScreenResult {
  order: FoodOrder | undefined;
  isLoading: boolean;
  isError: boolean;
  isUpdating: boolean;
  cancelModalVisible: boolean;
  cancelReason: string;
  cancelDescription: string;
  handleUpdateStatus: (newStatus: string) => void;
  handleCancelPress: () => void;
  handleCancelModalClose: () => void;
  handleCancelReasonChange: (v: string) => void;
  handleCancelDescriptionChange: (v: string) => void;
  handleCancelConfirm: () => void;
}

export function useOrderDetailScreen(orderId: string): UseOrderDetailScreenResult {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('closing_soon');
  const [cancelDescription, setCancelDescription] = useState('');
  const pusherRef = useRef<PusherInstance | null>(null);

  const { data: order, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.ORDER_DETAIL(orderId),
    queryFn: () => getOrder(orderId),
    staleTime: CACHE_TTL.ORDERS,
    gcTime: GC_TIME.DEFAULT,
    retry: 0,
    // Poll every 5 s until the order reaches a terminal state so the merchant
    // sees payment confirmation and status changes without refreshing.
    // Pusher (private-order.{id}) will supersede this once the server is deployed.
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === undefined || TERMINAL_STATUSES.has(status)) return false;
      return 5_000;
    },
  });

  // Real-time status updates via private-order.{orderId} channel.
  // FoodOrderStatusUpdated now broadcasts on this channel so the merchant
  // sees payment confirmation and status changes without refreshing.
  useEffect(() => {
    if (!token || !PUSHER_APP_KEY) return;
    let pusher: PusherInstance | null = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
      const mod = require('pusher-js') as any;
      const PusherClass: PusherConstructorFn = mod.Pusher ?? mod.default ?? mod;
      pusher = new PusherClass(PUSHER_APP_KEY, {
        cluster: PUSHER_APP_CLUSTER,
        forceTLS: true,
        channelAuthorization: {
          customHandler: async (
            { channelName, socketId }: { channelName: string; socketId: string },
            callback: (err: Error | null, data: { auth: string } | null) => void,
          ) => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              const { apiClient } = require('../../../shared/api/client') as {
                apiClient: { post: <T>(url: string, data: unknown) => Promise<{ data: T }> };
              };
              const res = await apiClient.post<{ auth: string }>(
                BROADCAST_AUTH_URL.replace(_getApiBase(), ''),
                { socket_id: socketId, channel_name: channelName },
              );
              callback(null, res.data);
            } catch {
              callback(new Error('Channel auth failed'), null);
            }
          },
        },
      });
      const channel = pusher.subscribe(`private-order.${orderId}`);
      channel.bind('food-order.status-updated', () => {
        // Re-fetch the full order so all timestamps and status fields update.
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER_DETAIL(orderId) });
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS() });
      });
      pusherRef.current = pusher;
    } catch { /* pusher-js not installed or network error — REST polling via staleTime continues */ }
    return () => {
      try {
        pusherRef.current?.unsubscribe(`private-order.${orderId}`);
        pusherRef.current?.disconnect();
      } catch { /* silent */ }
      pusherRef.current = null;
    };
  }, [token, orderId, queryClient]);

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS() });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYTICS });
  }, [queryClient]);

  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: (status: string) => updateOrderStatus(orderId, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.ORDER_DETAIL(orderId), updated);
      invalidate();
    },
  });

  const { mutate: mutateCancel, isPending: isCancelling } = useMutation({
    mutationFn: (payload: CancelOrderPayload) => cancelOrderWithReason(orderId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.ORDER_DETAIL(orderId), updated);
      invalidate();
      setCancelModalVisible(false);
    },
  });

  const handleUpdateStatus = useCallback(
    (newStatus: string) => mutate(newStatus),
    [mutate],
  );

  const handleCancelPress = useCallback(() => {
    setCancelReason('closing_soon');
    setCancelDescription('');
    setCancelModalVisible(true);
  }, []);

  const handleCancelModalClose = useCallback(() => setCancelModalVisible(false), []);
  const handleCancelReasonChange = useCallback((v: string) => setCancelReason(v), []);
  const handleCancelDescriptionChange = useCallback((v: string) => setCancelDescription(v), []);

  const handleCancelConfirm = useCallback(() => {
    mutateCancel({
      cancel_reason: cancelReason,
      cancel_description: cancelDescription.trim() || null,
    });
  }, [mutateCancel, cancelReason, cancelDescription]);

  return {
    order,
    isLoading,
    isError,
    isUpdating: isUpdating || isCancelling,
    cancelModalVisible,
    cancelReason,
    cancelDescription,
    handleUpdateStatus,
    handleCancelPress,
    handleCancelModalClose,
    handleCancelReasonChange,
    handleCancelDescriptionChange,
    handleCancelConfirm,
  };
}

function _getApiBase(): string {
  return (process.env.EXPO_PUBLIC_API_URL as string | undefined) ??
    'https://api.moiorder.com/api/merchant/v1';
}
