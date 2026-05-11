import type { ApiError } from 'src/types';
import type { DashboardStats } from 'src/api/dashboard';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from 'src/api/queryKeys';
import { dashboardApi } from 'src/api/dashboard';

// ----------------------------------------------------------------------

export type UseDashboardStatsResult = {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getLastEightMonthLabels(): string[] {
  const now = new Date();
  return Array.from({ length: 8 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 7 + i);
    return MONTH_LABELS[d.getMonth()];
  });
}

export function useDashboardStats(): UseDashboardStatsResult {
  const { data, isLoading, isError } = useQuery<DashboardStats, ApiError>({
    queryKey: QUERY_KEYS.dashboard.stats,
    queryFn: dashboardApi.get,
    staleTime: 5 * 60_000,
  });

  return {
    stats: data ?? null,
    isLoading,
    error: isError ? 'Failed to load dashboard data' : null,
  };
}
