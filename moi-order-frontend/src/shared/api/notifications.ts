import apiClient from '@/shared/api/client';
import { NotificationsResponse } from '@/types/models';

export async function fetchNotifications(): Promise<NotificationsResponse> {
  const res = await apiClient.get<NotificationsResponse>('/api/v1/notifications');
  return res.data;
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.put('/api/v1/notifications/read-all');
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/notifications/${id}`);
}

export async function deleteAllNotifications(): Promise<void> {
  await apiClient.delete('/api/v1/notifications');
}
