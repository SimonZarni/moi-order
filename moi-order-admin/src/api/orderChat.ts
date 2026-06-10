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
  created_at: string;
};

export const orderChatApi = {
  list: (orderId: string | number) =>
    apiClient
      .get<{ data: OrderChatMessage[] }>(`/food-orders/${orderId}/chat`)
      .then((r) => r.data.data),
  send: (orderId: string | number, body: string) =>
    apiClient
      .post<{ data: OrderChatMessage }>(`/food-orders/${orderId}/chat`, { body })
      .then((r) => r.data.data),
};
