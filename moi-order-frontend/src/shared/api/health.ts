import axios from 'axios';

export interface HealthResponse {
  status: 'ok';
  time:   string;
}

export async function checkHealth(): Promise<HealthResponse> {
  const res = await axios.get<HealthResponse>('/health', {
    baseURL: process.env['EXPO_PUBLIC_API_URL'],
    timeout: 30_000,
    headers: { Accept: 'application/json' },
  });
  return res.data;
}
