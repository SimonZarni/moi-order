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
  // Setting 'multipart/form-data' signals Axios to stop its default JSON serialization.
  // On web, Axios's XHR adapter then strips Content-Type so the browser re-adds it
  // with the correct boundary. On native, RN's XHR handles FormData the same way.
  const response = await apiClient.post<{ data: OrderChatMessage }>(
    `/orders/${orderId}/chat`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' }, transformRequest: [(data: FormData) => data] },
  );
  return response.data.data;
}

export async function markOrderChatRead(orderId: string): Promise<void> {
  await apiClient.post(`/orders/${orderId}/chat/read`);
}
