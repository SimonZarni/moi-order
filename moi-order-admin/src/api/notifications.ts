import type { AdminNotification } from 'src/types';

import apiClient from './client';

export type NotificationsResponse = {
  data: AdminNotification[];
  meta: { unread_count: number };
};

export const notificationsApi = {
  list: (): Promise<NotificationsResponse> =>
    apiClient.get<NotificationsResponse>('/notifications').then((r) => r.data),

  markOneRead: (id: string): Promise<void> =>
    apiClient.patch(`/notifications/${id}/read`).then(() => undefined),

  markAllRead: (): Promise<void> =>
    apiClient.put('/notifications/read-all').then(() => undefined),
};
