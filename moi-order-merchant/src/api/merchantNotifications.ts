import type { MerchantNotification, PaginatedResponse } from '../types/models';
import { apiClient } from './client';

export type NotificationGroup = 'orders' | 'chat';

export async function getNotifications(
  page = 1,
  group: NotificationGroup = 'orders',
): Promise<PaginatedResponse<MerchantNotification>> {
  const response = await apiClient.get<PaginatedResponse<MerchantNotification>>('/notifications', {
    params: { page, per_page: 20, group },
  });
  return response.data;
}

export async function getUnreadCount(group: NotificationGroup = 'orders'): Promise<number> {
  const response = await apiClient.get<{ data: { unread_count: number } }>(
    '/notifications/unread-count',
    { params: { group } },
  );
  return response.data.data.unread_count;
}

export async function markNotificationRead(id: number): Promise<MerchantNotification> {
  const response = await apiClient.post<{ data: MerchantNotification }>(
    `/notifications/${id}/read`,
  );
  return response.data.data;
}

export async function markAllNotificationsRead(group: NotificationGroup = 'orders'): Promise<void> {
  await apiClient.post('/notifications/read-all', null, { params: { group } });
}

export async function markReadByOrder(orderUuid: string): Promise<void> {
  await apiClient.post(`/notifications/read-by-order/${orderUuid}`);
}
