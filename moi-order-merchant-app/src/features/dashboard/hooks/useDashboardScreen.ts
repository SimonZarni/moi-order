import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '../../../api/analytics';
import { getOrders } from '../../../api/orders';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL } from '../../../shared/constants/config';
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
    staleTime: CACHE_TTL.ORDERS,
    refetchInterval: CACHE_TTL.ORDERS,
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
    refetchInterval: CACHE_TTL.ORDERS,
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
