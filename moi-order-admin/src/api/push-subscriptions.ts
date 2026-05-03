import apiClient from './client';

// ----------------------------------------------------------------------

type StorePushSubscriptionParams = {
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
};

export const pushSubscriptionsApi = {
  store: (params: StorePushSubscriptionParams): Promise<void> =>
    apiClient.post('/push-subscriptions', params).then(() => undefined),

  destroy: (endpoint: string): Promise<void> =>
    apiClient.delete('/push-subscriptions', { data: { endpoint } }).then(() => undefined),
};
