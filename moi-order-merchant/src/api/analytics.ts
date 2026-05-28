import type { AnalyticsData } from '../types/models';
import { apiClient } from './client';

export async function getAnalytics(): Promise<AnalyticsData> {
  const response = await apiClient.get<{ data: AnalyticsData }>('/analytics');
  return response.data.data;
}
