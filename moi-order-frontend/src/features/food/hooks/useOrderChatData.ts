import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrderChat, sendOrderChatMessage, markOrderChatRead } from '@/shared/api/foodOrders';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { PUSHER_APP_KEY, PUSHER_APP_CLUSTER } from '@/shared/constants/config';
import apiClient from '@/shared/api/client';
import { OrderChatMessage } from '@/types/models';

// Minimal Pusher types — avoids importing the full pusher-js namespace.
interface PusherChannel {
  bind(event: string, callback: (data: unknown) => void): void;
}
interface PusherInstance {
  subscribe(channel: string): PusherChannel;
  unsubscribe(channel: string): void;
  disconnect(): void;
}
type PusherConstructorFn = new (key: string, options: object) => PusherInstance;

export interface UseOrderChatDataResult {
  messages: OrderChatMessage[];
  isLoading: boolean;
  isError: boolean;
}

export function useOrderChatData(orderId: string): UseOrderChatDataResult {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.FOOD_ORDERS.CHAT(orderId),
    queryFn:  () => fetchOrderChat(orderId),
    enabled:  orderId.length > 0,
  });

  // Mark incoming messages as read when chat first loads.
  useEffect(() => {
    if (query.data && query.data.length > 0) {
      void markOrderChatRead(orderId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, !!query.data]);

  // Real-time updates via Pusher private-order.{orderId} channel.
  useEffect(() => {
    if (!PUSHER_APP_KEY || !orderId) return;

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
              const res = await apiClient.post<{ auth: string }>(
                '/api/v1/broadcasting/auth',
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
      channel.bind('chat.message-sent', (data: unknown) => {
        const msg = data as OrderChatMessage;
        queryClient.setQueryData<OrderChatMessage[]>(
          QUERY_KEYS.FOOD_ORDERS.CHAT(orderId),
          (prev) => {
            const existing = prev ?? [];
            // Dedup: mutation onSuccess already adds the customer's own sent messages.
            if (existing.some((m) => m.id === msg.id)) return existing;
            return [...existing, msg];
          },
        );
        // Mark incoming merchant/admin messages as read immediately.
        if (msg.sender_type !== 'customer') {
          void markOrderChatRead(orderId);
        }
      });
      // When merchant/admin reads our messages → update read_at so 2 ticks show.
      channel.bind('chat.messages-read', (data: unknown) => {
        const evt = data as { reader_type: string; message_ids: number[]; read_at: string };
        if (evt.reader_type === 'customer') return;
        const idSet = new Set(evt.message_ids);
        queryClient.setQueryData<OrderChatMessage[]>(
          QUERY_KEYS.FOOD_ORDERS.CHAT(orderId),
          (prev) => prev?.map((m) => idSet.has(m.id) ? { ...m, read_at: evt.read_at } : m),
        );
      });
    } catch { /* pusher-js unavailable or network error */ }

    return () => {
      try {
        pusher?.unsubscribe(`private-order.${orderId}`);
        pusher?.disconnect();
      } catch { /* silent */ }
    };
  }, [orderId, queryClient]);

  return {
    messages:  query.data ?? [],
    isLoading: query.isLoading,
    isError:   query.isError,
  };
}

export interface SendMessageInput {
  orderId: string;
  body: string | null;
  image: { uri: string; name: string; type: string } | null;
  replyToId?: number;
  replyingToMsg?: OrderChatMessage | null;
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, body, image, replyToId }: SendMessageInput) =>
      sendOrderChatMessage(orderId, body, image, replyToId),
    onSuccess: (newMsg, { orderId, replyingToMsg }) => {
      // Optimistically attach reply snapshot so the quoted block appears immediately
      // without waiting for a Pusher broadcast or cache refetch.
      const withReply: OrderChatMessage = replyingToMsg != null
        ? {
            ...newMsg,
            reply_to_id:          replyingToMsg.id,
            reply_to_body:        replyingToMsg.body,
            reply_to_sender_name: replyingToMsg.sender_name,
          }
        : newMsg;
      queryClient.setQueryData<OrderChatMessage[]>(
        QUERY_KEYS.FOOD_ORDERS.CHAT(orderId),
        (prev) => {
          const existing = prev ?? [];
          // ShouldBroadcastNow fires Pusher before the HTTP response is sent, so
          // Pusher often wins and inserts the message first — WITHOUT reply_to_*
          // fields if the backend broadcastWith hasn't been deployed yet.
          // MERGE so the reply quote block always appears on the sender's side.
          const idx = existing.findIndex((m) => m.id === withReply.id);
          if (idx !== -1) {
            const updated = [...existing];
            updated[idx] = { ...existing[idx], ...withReply };
            return updated;
          }
          return [...existing, withReply];
        },
      );
    },
  });
}
