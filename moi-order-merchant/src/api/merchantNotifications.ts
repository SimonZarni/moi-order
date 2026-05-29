import type { MerchantNotification, PaginatedResponse } from '../types/models';
import { apiClient } from './client';

export async function getNotifications(page = 1): Promise<PaginatedResponse<MerchantNotification>> {
  const response = await apiClient.get<PaginatedResponse<MerchantNotification>>('/notifications', {
    params: { page, per_page: 20 },
  });
  return response.data;
}

export async function getUnreadCount(): Promise<number> {
  const response = await apiClient.get<{ data: { unread_count: number } }>(
    '/notifications/unread-count',
  );
  return response.data.data.unread_count;
}

export async function markNotificationRead(id: number): Promise<MerchantNotification> {
  const response = await apiClient.post<{ data: MerchantNotification }>(
    `/notifications/${id}/read`,
  );
  return response.data.data;
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.post('/notifications/read-all');
}
