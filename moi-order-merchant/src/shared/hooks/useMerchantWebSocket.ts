/**
 * Principle: SRP — manages the Pusher WebSocket connection for real-time merchant updates.
 * Principle: DIP — abstracts Pusher behind this hook; no component imports pusher-js directly.
 *
 * Uses the same Pusher account as the user frontend (usePusherNotifications) and admin
 * dashboard (NotificationsProvider) — key from EXPO_PUBLIC_PUSHER_KEY.
 *
 * Graceful degradation: if EXPO_PUBLIC_PUSHER_KEY is not set or pusher-js is not installed,
 * the hook is a no-op. Polling via TanStack Query refetchInterval continues regardless.
 *
 * Install: npm install pusher-js  (same package already used by moi-order-frontend)
 */
import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { QUERY_KEYS } from '../constants/queryKeys';
import { PUSHER_APP_KEY, PUSHER_APP_CLUSTER, BROADCAST_AUTH_URL } from '../constants/config';

// ── Local Pusher type shims (avoids hard dep on @types/pusher-js) ─────────────

interface PusherChannel {
  bind(event: string, callback: (data: unknown) => void): void;
  unbind_all(): void;
}

interface PusherInstance {
  subscribe(channel: string): PusherChannel;
  unsubscribe(channel: string): void;
  disconnect(): void;
  connection: { state: string };
}

type PusherOptions = {
  cluster: string;
  forceTLS: boolean;
  channelAuthorization: {
    customHandler: (
      params: { channelName: string; socketId: string },
      callback: (err: Error | null, data: { auth: string } | null) => void,
    ) => void;
  };
};

type PusherConstructorFn = new (key: string, options: PusherOptions) => PusherInstance;

interface NewOrderPayload {
  order_id: number;
  restaurant_id: number;
  status: string;
  total_cents: number;
  created_at: string;
}

interface NotificationCreatedPayload {
  id: number;
  type: string;
  order_id: number | null;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useMerchantWebSocket(): void {
  const queryClient = useQueryClient();
  const token  = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id ?? null);

  const pusherRef  = useRef<PusherInstance | null>(null);
  const channelRef = useRef<PusherChannel | null>(null);

  const handleNewOrder = useCallback(
    (_data: NewOrderPayload) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS() });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYTICS });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT });
    },
    [queryClient],
  );

  const handleNotificationCreated = useCallback(
    (_data: NotificationCreatedPayload) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.LIST });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT });
    },
    [queryClient],
  );

  useEffect(() => {
    if (!token || !userId || !PUSHER_APP_KEY) return;

    let pusher: PusherInstance | null = null;

    try {
      // Dynamic require: gracefully handles case where pusher-js is not installed.
      // Note: pusher-js React Native bundle exports { Pusher: class }, not a default export.
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
      const mod = require('pusher-js') as any;
      const PusherClass: PusherConstructorFn = mod.Pusher ?? mod.default ?? mod;

      pusher = new PusherClass(PUSHER_APP_KEY, {
        cluster:  PUSHER_APP_CLUSTER,
        forceTLS: true,
        // Mirror the channelAuthorization pattern used by usePusherNotifications
        // in the user frontend — custom handler attaches the Bearer token.
        channelAuthorization: {
          customHandler: async (
            { channelName, socketId }: { channelName: string; socketId: string },
            callback: (err: Error | null, data: { auth: string } | null) => void,
          ) => {
            try {
              // Use the same apiClient so the interceptor attaches the Bearer token.
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              const { apiClient } = require('../api/client') as { apiClient: { post: <T>(url: string, data: unknown) => Promise<{ data: T }> } };
              const res = await apiClient.post<{ auth: string }>(
                BROADCAST_AUTH_URL.replace(_getBase(), ''),
                { socket_id: socketId, channel_name: channelName },
              );
              callback(null, res.data);
            } catch {
              callback(new Error('Channel auth failed'), null);
            }
          },
        },
      });

      const channel = pusher.subscribe(`private-merchant.${userId}`);
      channel.bind('food-order.new', (data: unknown) => {
        handleNewOrder(data as NewOrderPayload);
      });
      channel.bind('notification.created', (data: unknown) => {
        handleNotificationCreated(data as NotificationCreatedPayload);
      });

      pusherRef.current  = pusher;
      channelRef.current = channel;
    } catch {
      // pusher-js not installed or connection failed — silent degradation.
    }

    return () => {
      try {
        channelRef.current?.unbind_all();
        pusherRef.current?.unsubscribe(`private-merchant.${userId}`);
        pusherRef.current?.disconnect();
      } catch { /* silent */ }
      pusherRef.current  = null;
      channelRef.current = null;
    };
  }, [token, userId, handleNewOrder, handleNotificationCreated]);
}

/** Strips the path suffix to get the API origin for the auth endpoint. */
function _getBase(): string {
  return (process.env.EXPO_PUBLIC_API_URL as string | undefined) ??
    'https://api.moiorder.com/api/merchant/v1';
}
