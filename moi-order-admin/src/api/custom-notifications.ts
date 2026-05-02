import type { CustomNotification } from 'src/types';

import apiClient from './client';

// ----------------------------------------------------------------------

export type SendCustomNotificationPayload = {
  title: string;
  body: string;
  target_type: 'all' | 'single';
  user_email?: string;
};

export type CustomNotificationsListResponse = {
  data: CustomNotification[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
};

export const customNotificationsApi = {
  list: (page = 1): Promise<CustomNotificationsListResponse> =>
    apiClient
      .get<CustomNotificationsListResponse>('/custom-notifications', { params: { page, per_page: 20 } })
      .then((r) => r.data),

  send: (payload: SendCustomNotificationPayload): Promise<CustomNotification> =>
    apiClient
      .post<CustomNotification>('/custom-notifications', payload)
      .then((r) => r.data),
};
