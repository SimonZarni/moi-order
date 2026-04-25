import apiClient from '@/shared/api/client';

export async function registerDeviceToken(token: string, platform: 'android' | 'ios'): Promise<void> {
  await apiClient.post('/api/v1/device-tokens', { token, platform });
}

export async function unregisterDeviceToken(token: string): Promise<void> {
  await apiClient.delete('/api/v1/device-tokens', { data: { token } });
}
