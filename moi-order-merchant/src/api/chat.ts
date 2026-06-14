import { Platform } from 'react-native';
import type { OrderChatMessage } from '../types/models';
import { apiClient } from './client';

export async function fetchOrderChat(orderId: string): Promise<OrderChatMessage[]> {
  const response = await apiClient.get<{ data: OrderChatMessage[] }>(
    `/orders/${orderId}/chat`,
  );
  return response.data.data;
}

export async function sendOrderChatMessage(
  orderId: string,
  body: string | null,
  image: { uri: string; name: string; type: string } | null,
  replyToId?: number,
): Promise<OrderChatMessage> {
  const formData = new FormData();
  if (body !== null) formData.append('body', body);
  if (replyToId !== undefined) formData.append('reply_to_id', String(replyToId));
  if (image !== null) {
    if (Platform.OS === 'web') {
      const blob = await fetch(image.uri).then((r) => r.blob());
      formData.append('image', new File([blob], image.name, { type: image.type }));
    } else {
      formData.append('image', { uri: image.uri, name: image.name, type: image.type } as unknown as Blob);
    }
  }
  // On web the browser must set Content-Type (it appends the boundary automatically).
  // On React Native, RN's XHR does the same when we declare multipart/form-data.
  const response = await apiClient.post<{ data: OrderChatMessage }>(
    `/orders/${orderId}/chat`,
    formData,
    Platform.OS === 'web'
      ? undefined
      : { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}

export async function markOrderChatRead(orderId: string): Promise<void> {
  await apiClient.post(`/orders/${orderId}/chat/read`);
}
