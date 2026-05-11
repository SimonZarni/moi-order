import { apiClient } from './client';

export async function registerDeviceToken(token: string): Promise<void> {
  await apiClient.post('/device-tokens', { token, platform: 'merchant' });
}

export async function unregisterDeviceToken(token: string): Promise<void> {
  await apiClient.delete('/device-tokens', { data: { token } });
}
