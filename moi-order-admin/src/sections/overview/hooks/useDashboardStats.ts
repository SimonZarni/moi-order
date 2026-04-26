import type { DashboardStats } from 'src/api/dashboard';

import { useState, useEffect } from 'react';

import { dashboardApi } from 'src/api/dashboard';

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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    dashboardApi
      .get()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load dashboard data');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, isLoading, error };
}
