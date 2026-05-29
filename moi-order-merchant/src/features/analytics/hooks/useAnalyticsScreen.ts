/**
 * Principle: SRP — coordinator for AnalyticsScreen.
 * Owns period filter state, fetches aggregate (all) or time-series (today/week/month).
 * Returns flat typed result — screen only renders.
 */
import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnalytics, getAnalyticsChart } from '../../../api/analytics';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME, QUERY_RETRY } from '../../../shared/constants/config';
import type { AnalyticsChartData, AnalyticsData, AnalyticsPeriod } from '../../../types/models';

export interface AnalyticsKpiCard {
  label: string;
  value: string;
  sub: string;
  accent: string;
  highlight: boolean;
}

export interface UseAnalyticsScreenResult {
  period: AnalyticsPeriod;
  analytics: AnalyticsData | undefined;
  chartData: AnalyticsChartData | undefined;
  isLoading: boolean;
  isChartLoading: boolean;
  isError: boolean;
  handlePeriodChange: (p: AnalyticsPeriod) => void;
  refetch: () => void;
}

const PERIODS: AnalyticsPeriod[] = ['all', 'today', 'week', 'month'];
export { PERIODS };

export function useAnalyticsScreen(): UseAnalyticsScreenResult {
  const [period, setPeriod] = useState<AnalyticsPeriod>('all');

  const {
    data: analytics,
    isLoading,
    isError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey:       QUERY_KEYS.ANALYTICS,
    queryFn:        getAnalytics,
    staleTime:      CACHE_TTL.ANALYTICS,
    gcTime:         GC_TIME.DEFAULT,
    refetchInterval: CACHE_TTL.ANALYTICS,
    retry:          QUERY_RETRY,
  });

  const chartPeriod = period !== 'all' ? period : null;

  const {
    data: chartData,
    isLoading: isChartLoading,
    refetch: refetchChart,
  } = useQuery({
    queryKey: QUERY_KEYS.ANALYTICS_CHART(chartPeriod ?? 'today'),
    queryFn:  () => getAnalyticsChart(chartPeriod!),
    enabled:  chartPeriod !== null,
    staleTime: CACHE_TTL.ANALYTICS,
    gcTime:    GC_TIME.DEFAULT,
    retry:     QUERY_RETRY,
  });

  const handlePeriodChange = useCallback((p: AnalyticsPeriod) => {
    setPeriod(p);
  }, []);

  const refetch = useCallback(() => {
    void refetchAnalytics();
    if (chartPeriod !== null) void refetchChart();
  }, [refetchAnalytics, refetchChart, chartPeriod]);

  return {
    period,
    analytics,
    chartData,
    isLoading,
    isChartLoading,
    isError,
    handlePeriodChange,
    refetch,
  };
}
