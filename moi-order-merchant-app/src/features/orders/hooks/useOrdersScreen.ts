import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrderStatus } from '../../../api/orders';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME, QUERY_RETRY } from '../../../shared/constants/config';
import { ORDER_STATUS, type OrderStatus } from '../../../types/enums';
import type { FoodOrder } from '../../../types/models';

interface OrderGroups {
  newOrders: FoodOrder[];
  inProgressOrders: FoodOrder[];
  doneOrders: FoodOrder[];
}

interface UseOrdersScreenResult extends OrderGroups {
  isLoading: boolean;
  isError: boolean;
  handleUpdateStatus: (orderId: number, newStatus: string) => void;
}

const NEW_STATUSES: ReadonlySet<OrderStatus> = new Set<OrderStatus>([
  ORDER_STATUS.OrderPlaced,
  ORDER_STATUS.WaitingForPayment,
]);
const IN_PROGRESS_STATUSES: ReadonlySet<OrderStatus> = new Set<OrderStatus>([
  ORDER_STATUS.PaymentConfirmed,
  ORDER_STATUS.PreparingFood,
  ORDER_STATUS.WaitingForDelivery,
  ORDER_STATUS.DeliveryOnTheWay,
]);
const DONE_STATUSES: ReadonlySet<OrderStatus> = new Set<OrderStatus>([
  ORDER_STATUS.Delivered,
  ORDER_STATUS.Completed,
  ORDER_STATUS.Cancelled,
]);

export function useOrdersScreen(): UseOrdersScreenResult {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.ORDERS(),
    queryFn: () => getOrders(),
    staleTime: CACHE_TTL.ORDERS,
    gcTime: GC_TIME.DEFAULT,
    refetchInterval: CACHE_TTL.ORDERS,
    retry: QUERY_RETRY,
  });

  const { mutate: mutateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS() });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYTICS });
    },
  });

  const orders = useMemo(() => data?.data ?? [], [data]);

  const newOrders = useMemo(
    () => orders.filter((o) => NEW_STATUSES.has(o.status)),
    [orders],
  );

  const inProgressOrders = useMemo(
    () => orders.filter((o) => IN_PROGRESS_STATUSES.has(o.status)),
    [orders],
  );

  const doneOrders = useMemo(
    () => orders.filter((o) => DONE_STATUSES.has(o.status)),
    [orders],
  );

  const handleUpdateStatus = useCallback(
    (orderId: number, newStatus: string) => {
      mutateStatus({ id: orderId, status: newStatus });
    },
    [mutateStatus],
  );

  return {
    newOrders,
    inProgressOrders,
    doneOrders,
    isLoading,
    isError,
    handleUpdateStatus,
  };
}
