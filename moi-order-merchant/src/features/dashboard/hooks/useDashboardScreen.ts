import { useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnalytics, getTopData, type TopPeriod } from '../../../api/analytics';
import { getOrders, updateOrderStatus } from '../../../api/orders';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME, QUERY_RETRY } from '../../../shared/constants/config';
import { ORDER_STATUS } from '../../../types/enums';
import type { AnalyticsData, FoodOrder, TopData } from '../../../types/models';

const PENDING_STATUS_PARAM = 'order_placed,waiting_for_payment';
const PENDING_ORDERS_KEY   = ['orders', 'pending'] as const;

interface UseDashboardScreenResult {
  analytics: AnalyticsData | undefined;
  recentOrders: FoodOrder[];
  topData: TopData | undefined;
  topPeriod: TopPeriod;
  pendingOnly: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  handleUpdateStatus: (orderId: number, newStatus: string) => void;
  handleTopPeriodChange: (period: TopPeriod) => void;
  handlePendingToggle: () => void;
}

export function useDashboardScreen(): UseDashboardScreenResult {
  const queryClient = useQueryClient();
  const [topPeriod, setTopPeriod] = useState<TopPeriod>('today');
  const [pendingOnly, setPendingOnly] = useState(false);

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

  // Recent orders (last 5) — shown on the default dashboard view
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: QUERY_KEYS.ORDERS(),
    queryFn:  () => getOrders({ per_page: 10 }),
    staleTime: CACHE_TTL.ORDERS,
    gcTime:    GC_TIME.DEFAULT,
    retry:     QUERY_RETRY,
  });

  // Pending orders — fetched from backend with status filter, no count cap
  const {
    data: pendingOrdersData,
    isLoading: isPendingLoading,
    isError: isPendingError,
    refetch: refetchPending,
  } = useQuery({
    queryKey: PENDING_ORDERS_KEY,
    queryFn:  () => getOrders({ status: PENDING_STATUS_PARAM, per_page: 100 }),
    staleTime: CACHE_TTL.ORDERS,
    gcTime:    GC_TIME.DEFAULT,
    retry:     QUERY_RETRY,
    enabled:   pendingOnly,
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
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYTICS });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TOP_DATA(topPeriod) });
    },
  });

  const recentOrders = useMemo<FoodOrder[]>(
    () => {
      if (pendingOnly) return pendingOrdersData?.data ?? [];
      return (ordersData?.data ?? [])
        .filter((o) => o.status !== ORDER_STATUS.Cancelled)
        .slice(0, 5);
    },
    [pendingOnly, pendingOrdersData, ordersData],
  );

  const handlePendingToggle = useCallback(() => setPendingOnly((v) => !v), []);

  const refetch = useCallback(() => {
    void refetchAnalytics();
    void refetchOrders();
    void refetchTop();
    if (pendingOnly) void refetchPending();
  }, [refetchAnalytics, refetchOrders, refetchTop, refetchPending, pendingOnly]);

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
    pendingOnly,
    isLoading: isAnalyticsLoading || isOrdersLoading || (pendingOnly && isPendingLoading),
    isError:   isAnalyticsError   || isOrdersError   || (pendingOnly && isPendingError),
    refetch,
    handleUpdateStatus,
    handleTopPeriodChange,
    handlePendingToggle,
  };
}
