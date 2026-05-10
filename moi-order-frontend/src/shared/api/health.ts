import apiClient from './client';

export interface HealthResponse {
  status: 'ok';
  time:   string;
}

export async function checkHealth(): Promise<HealthResponse> {
  const res = await apiClient.get<HealthResponse>('/health');
  return res.data;
}
