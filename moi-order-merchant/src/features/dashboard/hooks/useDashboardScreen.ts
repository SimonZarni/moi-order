import { useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnalytics, getTopData, type TopPeriod } from '../../../api/analytics';
import { getOrders, updateOrderStatus } from '../../../api/orders';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME, QUERY_RETRY } from '../../../shared/constants/config';
import type { AnalyticsData, FoodOrder, TopData } from '../../../types/models';

interface UseDashboardScreenResult {
  analytics: AnalyticsData | undefined;
  recentOrders: FoodOrder[];
  topData: TopData | undefined;
  topPeriod: TopPeriod;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  handleUpdateStatus: (orderId: number, newStatus: string) => void;
  handleTopPeriodChange: (period: TopPeriod) => void;
}

export function useDashboardScreen(): UseDashboardScreenResult {
  const queryClient = useQueryClient();
  const [topPeriod, setTopPeriod] = useState<TopPeriod>('today');

  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: QUERY_KEYS.ANALYTICS,
    queryFn:  getAnalytics,
    staleTime: CACHE_TTL.ANALYTICS,
    gcTime:    GC_TIME.DEFAULT,
    retry:     QUERY_RETRY,
  });

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: QUERY_KEYS.ORDERS(),
    queryFn:  () => getOrders(),
    staleTime: CACHE_TTL.ORDERS,
    gcTime:    GC_TIME.DEFAULT,
    retry:     QUERY_RETRY,
  });

  const { data: topData, refetch: refetchTop } = useQuery({
    queryKey: QUERY_KEYS.TOP_DATA(topPeriod),
    queryFn:  () => getTopData(topPeriod),
    staleTime: CACHE_TTL.ANALYTICS,
    gcTime:    GC_TIME.DEFAULT,
    retry:     QUERY_RETRY,
  });

  const { mutate: mutateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS() });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYTICS });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TOP_DATA(topPeriod) });
    },
  });

  const recentOrders = useMemo(
    () => (ordersData?.data ?? []).slice(0, 5),
    [ordersData],
  );

  const refetch = useCallback(() => {
    void refetchAnalytics();
    void refetchOrders();
    void refetchTop();
  }, [refetchAnalytics, refetchOrders, refetchTop]);

  const handleUpdateStatus = useCallback(
    (orderId: number, newStatus: string) => {
      mutateStatus({ id: orderId, status: newStatus });
    },
    [mutateStatus],
  );

  const handleTopPeriodChange = useCallback((period: TopPeriod) => {
    setTopPeriod(period);
  }, []);

  return {
    analytics: analyticsData,
    recentOrders,
    topData,
    topPeriod,
    isLoading: isAnalyticsLoading || isOrdersLoading,
    isError:   isAnalyticsError   || isOrdersError,
    refetch,
    handleUpdateStatus,
    handleTopPeriodChange,
  };
}
