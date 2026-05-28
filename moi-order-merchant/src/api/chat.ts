import type { OrderChatMessage } from '../types/models';
import { apiClient } from './client';

export async function fetchOrderChat(orderId: number): Promise<OrderChatMessage[]> {
  const response = await apiClient.get<{ data: OrderChatMessage[] }>(
    `/orders/${orderId}/chat`,
  );
  return response.data.data;
}

export async function sendOrderChatMessage(
  orderId: number,
  body: string | null,
  image: { uri: string; name: string; type: string } | null,
): Promise<OrderChatMessage> {
  const formData = new FormData();
  if (body !== null) formData.append('body', body);
  if (image !== null) {
    formData.append('image', {
      uri:  image.uri,
      name: image.name,
      type: image.type,
    } as unknown as Blob);
  }
  const response = await apiClient.post<{ data: OrderChatMessage }>(
    `/orders/${orderId}/chat`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}
