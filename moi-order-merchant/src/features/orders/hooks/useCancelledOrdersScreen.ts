import { useState, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getOrders, updateOrderStatus } from '../../../api/orders';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME, QUERY_RETRY } from '../../../shared/constants/config';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import type { FoodOrder } from '../../../types/models';

export type DatePreset = 'today' | 'yesterday' | 'last7' | 'last30' | 'custom';

const CANCELLED_ORDERS_KEY = ['orders', 'cancelled'] as const;

interface UseCancelledOrdersScreenResult {
  orders: FoodOrder[];
  isLoading: boolean;
  isError: boolean;
  dateFilter: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  datePreset: DatePreset;
  searchQuery: string;
  totalVisible: number;
  handleUpdateStatus: (orderId: number, newStatus: string) => void;
  handleDatePreset: (preset: DatePreset) => void;
  handleDatePrev: () => void;
  handleDateNext: () => void;
  handleDateToday: () => void;
  handleSearchChange: (q: string) => void;
  handleExportCsv: () => void;
}

function toDateString(d: Date): string {
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

function buildCsv(orders: FoodOrder[]): string {
  const headers = ['Order #', 'Customer', 'Phone', 'Payment', 'Total', 'Items', 'Address', 'Notes', 'Created At', 'Cancelled At'];
  const rows = orders.map((o) => [
    o.order_number ?? o.id,
    o.user.name,
    o.user.phone ?? '',
    o.payment_method,
    (o.total_cents / 100).toFixed(2),
    o.items.map((i) => `${i.quantity}x ${i.name}`).join(' | '),
    (o.delivery_address ?? '').replace(/,/g, ' '),
    (o.customer_notes ?? '').replace(/,/g, ' '),
    formatDateTime(o.created_at),
    o.cancelled_at ?? '',
  ]);
  return [headers, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

export function useCancelledOrdersScreen(): UseCancelledOrdersScreenResult {
  const queryClient = useQueryClient();
  const [datePreset, setDatePreset] = useState<DatePreset>('today');
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [dateFrom, setDateFrom]     = useState<string | null>(null);
  const [dateTo, setDateTo]         = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const queryParams = useMemo(() => {
    const base: Record<string, string | undefined> = { status: 'cancelled', per_page: '100' };
    if (datePreset === 'yesterday') return { ...base, date: shiftDate(toDateString(new Date()), -1) };
    if (datePreset === 'last7' || datePreset === 'last30') {
      return { ...base, date_from: dateFrom ?? undefined, date_to: dateTo ?? undefined };
    }
    if (datePreset === 'custom') return { ...base, date: dateFilter ?? undefined };
    return base; // today = no date param (backend defaults to today)
  }, [datePreset, dateFilter, dateFrom, dateTo]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [...CANCELLED_ORDERS_KEY, datePreset, dateFilter, dateFrom, dateTo],
    queryFn:  () => getOrders(queryParams),
    staleTime: CACHE_TTL.ORDERS,
    gcTime:    GC_TIME.DEFAULT,
    retry:     QUERY_RETRY,
  });

  const { mutate: mutateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CANCELLED_ORDERS_KEY });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS() });
    },
  });

  const allOrders = useMemo(() => data?.data ?? [], [data]);

  const matchesSearch = useCallback((o: FoodOrder): boolean => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      (o.order_number ?? '').toLowerCase().includes(q) ||
      o.user.name.toLowerCase().includes(q) ||
      (o.user.phone ?? '').includes(q)
    );
  }, [searchQuery]);

  const orders = useMemo(() => allOrders.filter(matchesSearch), [allOrders, matchesSearch]);
  const totalVisible = orders.length;

  const handleUpdateStatus = useCallback(
    (orderId: number, newStatus: string) => mutateStatus({ id: orderId, status: newStatus }),
    [mutateStatus],
  );

  const handleSearchChange = useCallback((q: string) => setSearchQuery(q), []);

  const handleDatePreset = useCallback((preset: DatePreset) => {
    setDatePreset(preset);
    setSearchQuery('');
    const today = toDateString(new Date());
    if (preset === 'last7') {
      setDateFrom(shiftDate(today, -6));
      setDateTo(today);
    } else if (preset === 'last30') {
      setDateFrom(shiftDate(today, -29));
      setDateTo(today);
    } else {
      setDateFrom(null);
      setDateTo(null);
      setDateFilter(null);
    }
  }, []);

  const handleDatePrev = useCallback(() => {
    setDatePreset('custom');
    setDateFrom(null);
    setDateTo(null);
    setDateFilter((prev) => shiftDate(prev ?? toDateString(new Date()), -1));
  }, []);

  const handleDateNext = useCallback(() => {
    setDatePreset('custom');
    setDateFrom(null);
    setDateTo(null);
    setDateFilter((prev) => {
      const next  = shiftDate(prev ?? toDateString(new Date()), 1);
      const today = toDateString(new Date());
      return next > today ? null : next;
    });
  }, []);

  const handleDateToday = useCallback(() => {
    setDatePreset('today');
    setDateFilter(null);
    setDateFrom(null);
    setDateTo(null);
  }, []);

  const handleExportCsv = useCallback(() => {
    if (Platform.OS !== 'web' || orders.length === 0) return;
    const csv      = buildCsv(orders);
    const dateStr  = toDateString(new Date());
    const filename = `cancelled-orders-${dateStr}.csv`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [orders]);

  return {
    orders,
    isLoading,
    isError,
    dateFilter,
    dateFrom,
    dateTo,
    datePreset,
    searchQuery,
    totalVisible,
    handleUpdateStatus,
    handleDatePreset,
    handleDatePrev,
    handleDateNext,
    handleDateToday,
    handleSearchChange,
    handleExportCsv,
  };
}
