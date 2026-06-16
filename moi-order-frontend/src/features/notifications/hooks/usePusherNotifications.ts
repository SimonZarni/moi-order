/**
 * Principle: SRP — owns the Pusher connection lifecycle exclusively.
 * Mounted at the auth root (AppShell in App.tsx) — active for the entire session,
 * not tied to any single screen. Disconnects automatically on logout (userId → null).
 *
 * Channels managed:
 *   private-App.Models.User.{id}  — in-app notifications (notification.created)
 *   private-user.{id}             — food-order status updates (food-order.status-updated)
 *   presence-online-users          — presence channel; joining signals the user is active
 *                                    (admin dashboard reads membership to show online status)
 */
import { useEffect } from 'react';
import { Alert, AppState } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
// pusher-js React Native bundle exports { Pusher: class } — not a default export.
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
const Pusher: typeof import('pusher-js').default = (require('pusher-js') as any).Pusher;

import apiClient from '@/shared/api/client';
import { PUSHER_APP_KEY, PUSHER_APP_CLUSTER } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { navigationRef } from '@/shared/navigation/navigationRef';
import { useAuthStore } from '@/shared/store/authStore';
import { useNotificationStore } from '@/shared/store/notificationStore';
import { FOOD_ORDER_STATUS } from '@/types/enums';

interface FoodOrderStatusPayload {
  order_id: number;
  order_uuid: string;
  status: string;
  status_label: string;
}

export function usePusherNotifications(): void {
  const userId          = useAuthStore((state) => state.user?.id ?? null);
  const queryClient     = useQueryClient();
  const incrementUnread = useNotificationStore((state) => state.incrementUnread);

  useEffect(() => {
    if (userId === null) return;

    const pusher = new Pusher(PUSHER_APP_KEY, {
      cluster: PUSHER_APP_CLUSTER,
      forceTLS: true,
      channelAuthorization: {
        customHandler: async ({ channelName, socketId }, callback) => {
          try {
            const res = await apiClient.post<{ auth: string }>('/api/v1/broadcasting/auth', {
              socket_id:    socketId,
              channel_name: channelName,
            });
            callback(null, res.data);
          } catch {
            callback(new Error('Channel auth failed'), null);
          }
        },
      },
    });

    // ── Notification bell channel ───────────────────────────────────────────
    const notifChannelName = `private-App.Models.User.${userId}`;
    const notifChannel     = pusher.subscribe(notifChannelName);

    notifChannel.bind('notification.created', (payload: { type?: string; food_order_id?: string }) => {
      incrementUnread();
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.LIST });
      // When a merchant sends a chat message the payload carries the order UUID —
      // invalidate immediately so the chat screen refreshes without waiting for the poll.
      if (payload?.type === 'chat_message' && payload.food_order_id) {
        void queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.FOOD_ORDERS.CHAT(payload.food_order_id),
        });
      }
    });

    // ── Food-order status channel ───────────────────────────────────────────
    // Invalidate rather than patch cache — the broadcast payload is partial;
    // patching would corrupt the full FoodOrder objects stored in TanStack Query.
    const orderChannelName = `private-user.${userId}`;
    const orderChannel     = pusher.subscribe(orderChannelName);

    orderChannel.bind('food-order.status-updated', (payload: FoodOrderStatusPayload) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOOD_ORDERS.DETAIL(payload.order_uuid) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOOD_ORDERS.LIST });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOOD_ORDERS.ACTIVE });
      // Badge increment because a status notification is also written to the database channel.
      incrementUnread();

      if (payload.status === FOOD_ORDER_STATUS.Completed) {
        const route = navigationRef.isReady() ? navigationRef.getCurrentRoute() : null;
        const alreadyOnThisOrder =
          route?.name === 'FoodOrderDetail' &&
          (route.params as { orderId?: string } | undefined)?.orderId === payload.order_uuid;

        if (!alreadyOnThisOrder) {
          Alert.alert(
            'Order Complete',
            'Your order has been completed. Would you like to leave a review?',
            [
              { text: 'Later', style: 'cancel' },
              {
                text: 'Leave a Review',
                onPress: () => {
                  if (navigationRef.isReady()) {
                    navigationRef.navigate('FoodOrderDetail', { orderId: payload.order_uuid });
                  }
                },
              },
            ],
          );
        }
      }
    });

    // ── Presence channel — signals this user is online to the admin dashboard ─
    const presenceChannelName = 'presence-online-users';
    const presenceChannel     = pusher.subscribe(presenceChannelName);
    // No event bindings needed — membership itself is the signal.
    void presenceChannel;

    // ── Reconnect on foreground restore ────────────────────────────────────
    const appStateSub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && pusher.connection.state !== 'connected') {
        pusher.connect();
      }
    });

    return () => {
      appStateSub.remove();
      notifChannel.unbind_all();
      orderChannel.unbind_all();
      pusher.unsubscribe(notifChannelName);
      pusher.unsubscribe(orderChannelName);
      pusher.unsubscribe(presenceChannelName);
      pusher.disconnect();
    };
  }, [userId, queryClient, incrementUnread]);
}
