import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrderStatus } from '../../../api/orders';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME, QUERY_RETRY } from '../../../shared/constants/config';
import { ORDER_STATUS, type OrderStatus } from '../../../types/enums';
import type { FoodOrder } from '../../../types/models';

export type StatusFilter = 'all' | 'new' | 'in_progress' | 'done';

export interface OrderSection {
  title: string;
  data: FoodOrder[];
}

interface UseOrdersScreenResult {
  sections: OrderSection[];
  isLoading: boolean;
  isError: boolean;
  statusFilter: StatusFilter;
  dateFilter: string | null;
  handleUpdateStatus: (orderId: number, newStatus: string) => void;
  handleStatusFilterChange: (filter: StatusFilter) => void;
  handleDatePrev: () => void;
  handleDateNext: () => void;
  handleDateToday: () => void;
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
  ORDER_STATUS.Delivered,
]);
const DONE_STATUSES: ReadonlySet<OrderStatus> = new Set<OrderStatus>([
  ORDER_STATUS.Completed,
  ORDER_STATUS.Cancelled,
]);

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

export function useOrdersScreen(): UseOrdersScreenResult {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.ORDERS(dateFilter ?? undefined),
    queryFn: () => getOrders(dateFilter !== null ? { date: dateFilter } : undefined),
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

  const sections = useMemo<OrderSection[]>(() => {
    if (statusFilter === 'new') {
      const filtered = orders.filter((o) => NEW_STATUSES.has(o.status));
      return filtered.length > 0 ? [{ title: 'New Orders', data: filtered }] : [];
    }
    if (statusFilter === 'in_progress') {
      const filtered = orders.filter((o) => IN_PROGRESS_STATUSES.has(o.status));
      return filtered.length > 0 ? [{ title: 'In Progress', data: filtered }] : [];
    }
    if (statusFilter === 'done') {
      const filtered = orders.filter((o) => DONE_STATUSES.has(o.status));
      return filtered.length > 0 ? [{ title: 'Completed & Cancelled', data: filtered }] : [];
    }
    return [
      { title: 'New Orders', data: orders.filter((o) => NEW_STATUSES.has(o.status)) },
      { title: 'In Progress', data: orders.filter((o) => IN_PROGRESS_STATUSES.has(o.status)) },
      { title: 'Completed & Cancelled', data: orders.filter((o) => DONE_STATUSES.has(o.status)) },
    ].filter((s) => s.data.length > 0);
  }, [orders, statusFilter]);

  const handleUpdateStatus = useCallback(
    (orderId: number, newStatus: string) => {
      mutateStatus({ id: orderId, status: newStatus });
    },
    [mutateStatus],
  );

  const handleStatusFilterChange = useCallback((filter: StatusFilter) => {
    setStatusFilter(filter);
  }, []);

  const handleDatePrev = useCallback(() => {
    setDateFilter((prev) => shiftDate(prev ?? toDateString(new Date()), -1));
  }, []);

  const handleDateNext = useCallback(() => {
    setDateFilter((prev) => {
      const next = shiftDate(prev ?? toDateString(new Date()), 1);
      const today = toDateString(new Date());
      return next > today ? null : next;
    });
  }, []);

  const handleDateToday = useCallback(() => {
    setDateFilter(null);
  }, []);

  return {
    sections,
    isLoading,
    isError,
    statusFilter,
    dateFilter,
    handleUpdateStatus,
    handleStatusFilterChange,
    handleDatePrev,
    handleDateNext,
    handleDateToday,
  };
}
