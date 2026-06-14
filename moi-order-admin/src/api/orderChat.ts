import apiClient from './client';

export type OrderChatSenderType = 'customer' | 'merchant' | 'admin' | 'system';

export type OrderChatMessage = {
  id: number;
  sender_type: OrderChatSenderType;
  sender_id: number;
  sender_name: string;
  body: string | null;
  image_url: string | null;
  read_at: string | null;
  reply_to_id: number | null;
  reply_to_body: string | null;
  reply_to_sender_name: string | null;
  created_at: string;
};

export const orderChatApi = {
  list: (orderId: string | number) =>
    apiClient
      .get<{ data: OrderChatMessage[] }>(`/food-orders/${orderId}/chat`)
      .then((r) => r.data.data),
  send: (orderId: string | number, body: string, replyToId?: number) =>
    apiClient
      .post<{ data: OrderChatMessage }>(`/food-orders/${orderId}/chat`, {
        body,
        ...(replyToId !== undefined ? { reply_to_id: replyToId } : {}),
      })
      .then((r) => r.data.data),
};
