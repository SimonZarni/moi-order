import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '../../../api/analytics';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME, QUERY_RETRY } from '../../../shared/constants/config';
import type { AnalyticsData } from '../../../types/models';

interface UseAnalyticsScreenResult {
  analytics: AnalyticsData | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useAnalyticsScreen(): UseAnalyticsScreenResult {
  const { data: analytics, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.ANALYTICS,
    queryFn: getAnalytics,
    staleTime: CACHE_TTL.ANALYTICS,
    gcTime: GC_TIME.DEFAULT,
    refetchInterval: CACHE_TTL.ANALYTICS,
    retry: QUERY_RETRY,
  });

  return {
    analytics,
    isLoading,
    isError,
    refetch: () => { void refetch(); },
  };
}
