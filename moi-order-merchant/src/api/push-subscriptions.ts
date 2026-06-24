import { apiClient } from './client';

// ----------------------------------------------------------------------

type StorePushSubscriptionParams = {
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
};

export const pushSubscriptionsApi = {
  store: (params: StorePushSubscriptionParams): Promise<void> =>
    apiClient.post('/push-subscriptions', params).then(() => undefined),

  destroy: (endpoint: string, token: string): Promise<void> =>
    apiClient
      .delete('/push-subscriptions', {
        data: { endpoint },
        // Pass token explicitly: logout clears _token synchronously in the next tick,
        // but the axios request interceptor runs asynchronously. Explicit header ensures
        // the DELETE reaches the backend with a valid auth token.
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => undefined),
};
