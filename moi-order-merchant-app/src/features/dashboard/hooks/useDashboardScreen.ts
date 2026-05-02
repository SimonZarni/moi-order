import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '../../../api/analytics';
import { getOrders } from '../../../api/orders';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME, QUERY_RETRY } from '../../../shared/constants/config';
import type { AnalyticsData, FoodOrder } from '../../../types/models';

interface UseDashboardScreenResult {
  analytics: AnalyticsData | undefined;
  recentOrders: FoodOrder[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useDashboardScreen(): UseDashboardScreenResult {
  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: QUERY_KEYS.ANALYTICS,
    queryFn: getAnalytics,
    staleTime: CACHE_TTL.ANALYTICS,
    gcTime: GC_TIME.DEFAULT,
    refetchInterval: CACHE_TTL.ANALYTICS,
    retry: QUERY_RETRY,
  });

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: QUERY_KEYS.ORDERS(),
    queryFn: () => getOrders(),
    staleTime: CACHE_TTL.ORDERS,
    gcTime: GC_TIME.DEFAULT,
    refetchInterval: CACHE_TTL.ORDERS,
    retry: QUERY_RETRY,
  });

  const recentOrders = useMemo(
    () => (ordersData?.data ?? []).slice(0, 5),
    [ordersData],
  );

  const refetch = () => {
    void refetchAnalytics();
    void refetchOrders();
  };

  return {
    analytics: analyticsData,
    recentOrders,
    isLoading: isAnalyticsLoading || isOrdersLoading,
    isError: isAnalyticsError || isOrdersError,
    refetch,
  };
}
