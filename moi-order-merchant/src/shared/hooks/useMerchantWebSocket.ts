import { useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { QUERY_KEYS } from '../constants/queryKeys';
import { PUSHER_APP_KEY, PUSHER_APP_CLUSTER, BROADCAST_AUTH_URL } from '../constants/config';

// ── Pusher type shims ─────────────────────────────────────────────────────────

interface PusherConnection {
  state: string;
  bind(event: string, callback: (data: unknown) => void): void;
}

interface PusherChannel {
  bind(event: string, callback: (data: unknown) => void): void;
  unbind_all(): void;
}

interface PusherInstance {
  subscribe(channel: string): PusherChannel;
  unsubscribe(channel: string): void;
  disconnect(): void;
  connection: PusherConnection;
}

type PusherOptions = {
  cluster: string;
  forceTLS: boolean;
  channelAuthorization: {
    endpoint: string;
    transport: 'ajax' | 'jsonp';
    headers?: Record<string, string>;
    customHandler?: (
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

interface OrderStatusUpdatedPayload {
  order_uuid: string;
  status: string;
}

// ── Module-level status (shared across all hook instances) ────────────────────

export type WsStatus = 'idle' | 'connecting' | 'connected' | 'unavailable' | 'failed' | 'disconnected';
export type ChannelStatus = 'idle' | 'pending' | 'subscribed' | 'auth_failed' | 'error';

let _wsStatus: WsStatus     = 'idle';
let _wsError: string | null = null;
let _channelStatus: ChannelStatus   = 'idle';
let _channelError: string | null    = null;

const _statusListeners = new Set<() => void>();

function _notify(): void { _statusListeners.forEach((fn) => fn()); }

function _setWs(status: WsStatus, error: string | null = null): void {
  _wsStatus = status; _wsError = error; _notify();
}

function _setChannel(status: ChannelStatus, error: string | null = null): void {
  _channelStatus = status; _channelError = error; _notify();
}

function _subscribe(cb: () => void): () => void {
  _statusListeners.add(cb);
  return () => { _statusListeners.delete(cb); };
}

// ── Read-only hook (safe to call from any component) ─────────────────────────

export interface WsStatusResult {
  wsStatus: WsStatus;
  wsError: string | null;
  channelStatus: ChannelStatus;
  channelError: string | null;
  pusherKey: string;
}

export function useWsStatus(): WsStatusResult {
  const wsStatus     = useSyncExternalStore(_subscribe, () => _wsStatus,     () => 'idle' as WsStatus);
  const wsError      = useSyncExternalStore(_subscribe, () => _wsError,      () => null);
  const channelStatus = useSyncExternalStore(_subscribe, () => _channelStatus, () => 'idle' as ChannelStatus);
  const channelError = useSyncExternalStore(_subscribe, () => _channelError, () => null);
  return { wsStatus, wsError, channelStatus, channelError, pusherKey: PUSHER_APP_KEY };
}

// ── Connection hook (call once in WebSocketManager) ───────────────────────────

interface CashOutConfirmedPayload {
  invoice_id: number;
  date: string;
  payout_cents: number;
  paid_at: string;
}

interface UseMerchantWebSocketOptions {
  onNewOrder?: () => void;
  onNewChatMessage?: () => void;
  onCashOutConfirmed?: () => void;
}

export function useMerchantWebSocket(options?: UseMerchantWebSocketOptions): void {
  const queryClient = useQueryClient();
  const token  = useAuthStore((s) => s.token);
  // int_id is the integer PK — backend broadcasts to merchant.{user_id} (integer FK).
  // user.id is the UUID and PHP casts it to 0, so it never matches.
  const userId = useAuthStore((s) => s.user?.int_id ?? null);

  // Store callbacks in refs so they can update between renders without causing
  // the Pusher useEffect to tear down and rebuild the connection. Previously,
  // including onNewOrder (= triggerAlarm) in handleNewOrder's useCallback deps
  // caused a full Pusher reconnect every time isEnabled changed in useOrderAlarm.
  const onNewOrderRef        = useRef(options?.onNewOrder);
  const onNewChatMessageRef  = useRef(options?.onNewChatMessage);
  const onCashOutConfirmedRef = useRef(options?.onCashOutConfirmed);
  onNewOrderRef.current        = options?.onNewOrder;
  onNewChatMessageRef.current  = options?.onNewChatMessage;
  onCashOutConfirmedRef.current = options?.onCashOutConfirmed;

  const pusherRef  = useRef<PusherInstance | null>(null);
  const channelRef = useRef<PusherChannel | null>(null);

  const handleNewOrder = useCallback(
    (_data: NewOrderPayload) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS() });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYTICS });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT });
      onNewOrderRef.current?.();
    },
    [queryClient],
  );

  const handleNotificationCreated = useCallback(
    (data: NotificationCreatedPayload) => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      if (data.type === 'chat_message') {
        onNewChatMessageRef.current?.();
      }
    },
    [queryClient],
  );

  const handleOrderStatusUpdated = useCallback(
    (data: OrderStatusUpdatedPayload) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER_DETAIL(data.order_uuid) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS() });
    },
    [queryClient],
  );

  const handleCashOutConfirmed = useCallback(
    (_data: CashOutConfirmedPayload) => {
      void queryClient.invalidateQueries({ queryKey: ['invoices'] });
      onCashOutConfirmedRef.current?.();
    },
    [queryClient],
  );

  useEffect(() => {
    if (!token) { _setWs('idle', 'No auth token'); return; }
    if (!userId) { _setWs('idle', 'No user id'); return; }
    if (!PUSHER_APP_KEY) { _setWs('idle', 'EXPO_PUBLIC_PUSHER_KEY is not set'); return; }

    let pusher: PusherInstance | null = null;

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
      const mod = require('pusher-js') as any;
      const PusherClass: PusherConstructorFn = mod.Pusher ?? mod.default ?? mod;

      _setWs('connecting');
      _setChannel('pending');

      pusher = new PusherClass(PUSHER_APP_KEY, {
        cluster:  PUSHER_APP_CLUSTER,
        forceTLS: true,
        channelAuthorization: {
          // token is non-null here — we guard `if (!token) return` above.
          // Using endpoint+headers is simpler and avoids any apiClient/_token sync issues.
          endpoint:  BROADCAST_AUTH_URL,
          transport: 'ajax',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:        'application/json',
          },
        },
      });

      pusher.connection.bind('state_change', (data: unknown) => {
        const { current } = data as { current: string };
        _setWs(current as WsStatus);
      });
      pusher.connection.bind('error', (err: unknown) => {
        const msg = err instanceof Error ? err.message : JSON.stringify(err);
        _setWs('failed', `Connection error: ${msg}`);
      });

      const channel = pusher.subscribe(`private-merchant.${userId}`);

      channel.bind('pusher:subscription_succeeded', () => {
        _setChannel('subscribed');
      });
      channel.bind('pusher:subscription_error', (data: unknown) => {
        const msg = data instanceof Error ? data.message : JSON.stringify(data);
        _setChannel('error', `Subscription error: ${msg}`);
      });
      channel.bind('food-order.new', (data: unknown) => {
        handleNewOrder(data as NewOrderPayload);
      });
      channel.bind('notification.created', (data: unknown) => {
        handleNotificationCreated(data as NotificationCreatedPayload);
      });
      channel.bind('food-order.status-updated', (data: unknown) => {
        handleOrderStatusUpdated(data as OrderStatusUpdatedPayload);
      });
      channel.bind('cashout.confirmed', (data: unknown) => {
        handleCashOutConfirmed(data as CashOutConfirmedPayload);
      });

      pusherRef.current  = pusher;
      channelRef.current = channel;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      _setWs('failed', `Pusher init failed: ${msg}`);
    }

    return () => {
      try {
        channelRef.current?.unbind_all();
        pusherRef.current?.unsubscribe(`private-merchant.${userId}`);
        pusherRef.current?.disconnect();
      } catch { /* silent */ }
      pusherRef.current  = null;
      channelRef.current = null;
      _setWs('idle');
      _setChannel('idle');
    };
  }, [token, userId, handleNewOrder, handleNotificationCreated, handleOrderStatusUpdated, handleCashOutConfirmed]);
}

function _getBase(): string {
  return (process.env.EXPO_PUBLIC_API_URL as string | undefined) ??
    'https://api.moiorder.com/api/merchant/v1';
}
