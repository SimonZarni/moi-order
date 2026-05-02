import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrder, updateOrderStatus } from '../../../api/orders';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME } from '../../../shared/constants/config';
import type { FoodOrder } from '../../../types/models';

interface UseOrderDetailScreenResult {
  order: FoodOrder | undefined;
  isLoading: boolean;
  isError: boolean;
  isUpdating: boolean;
  handleUpdateStatus: (newStatus: string) => void;
}

export function useOrderDetailScreen(orderId: number): UseOrderDetailScreenResult {
  const queryClient = useQueryClient();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.ORDER_DETAIL(orderId),
    queryFn: () => getOrder(orderId),
    staleTime: CACHE_TTL.ORDERS,
    gcTime: GC_TIME.DEFAULT,
    retry: 0,   // fail fast — don't mask a real 404 with 3 retries + 7s delay
  });

  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: (status: string) => updateOrderStatus(orderId, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.ORDER_DETAIL(orderId), updated);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS() });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYTICS });
    },
  });

  const handleUpdateStatus = useCallback(
    (newStatus: string) => mutate(newStatus),
    [mutate],
  );

  return { order, isLoading, isError, isUpdating, handleUpdateStatus };
}
