import type { AnalyticsChartData, AnalyticsData, TopData } from '../types/models';
import { apiClient } from './client';

export type TopPeriod = 'today' | 'week' | 'month';

export async function getAnalytics(): Promise<AnalyticsData> {
  const response = await apiClient.get<{ data: AnalyticsData }>('/analytics');
  return response.data.data;
}

export async function getTopData(period: TopPeriod): Promise<TopData> {
  const response = await apiClient.get<{ data: TopData }>('/analytics/tops', {
    params: { period },
  });
  return response.data.data;
}

/** Time-series chart data: hourly (today) or daily (week/month). */
export async function getAnalyticsChart(
  period: 'today' | 'week' | 'month',
): Promise<AnalyticsChartData> {
  const response = await apiClient.get<{ data: AnalyticsChartData }>('/analytics/chart', {
    params: { period },
  });
  return response.data.data;
}
