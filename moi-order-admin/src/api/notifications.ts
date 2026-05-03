import type { AdminNotification, AdminNotificationMeta, AdminNotificationType } from 'src/types';

import apiClient from './client';

export type NotificationsResponse = {
  data: AdminNotification[];
  meta: { unread_count: number };
};

export type NotificationsPageResponse = {
  data: AdminNotification[];
  meta: AdminNotificationMeta;
};

export type NotificationsPageParams = {
  page?: number;
  per_page?: number;
  type?: AdminNotificationType | 'all';
};

export const notificationsApi = {
  list: (): Promise<NotificationsResponse> =>
    apiClient.get<NotificationsResponse>('/notifications').then((r) => r.data),

  listAll: (params: NotificationsPageParams): Promise<NotificationsPageResponse> => {
    const query: Record<string, string | number> = {
      page:     params.page     ?? 1,
      per_page: params.per_page ?? 20,
    };
    if (params.type && params.type !== 'all') query.type = params.type;
    return apiClient.get<NotificationsPageResponse>('/notifications/all', { params: query }).then((r) => r.data);
  },

  markOneRead: (id: string): Promise<void> =>
    apiClient.patch(`/notifications/${id}/read`).then(() => undefined),

  markAllRead: (): Promise<void> =>
    apiClient.put('/notifications/read-all').then(() => undefined),

  deleteOne: (id: string): Promise<void> =>
    apiClient.delete(`/notifications/${id}`).then(() => undefined),

  deleteAll: (): Promise<void> =>
    apiClient.delete('/notifications').then(() => undefined),
};
