import { useState, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrderStatus } from '../../../api/orders';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME, QUERY_RETRY } from '../../../shared/constants/config';
import { ORDER_STATUS, type OrderStatus } from '../../../types/enums';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import type { FoodOrder } from '../../../types/models';

export type StatusFilter = 'all' | 'new' | 'in_progress' | 'done';
export type DatePreset   = 'today' | 'yesterday' | 'last7' | 'last30' | 'custom';

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
  dateFrom: string | null;
  dateTo: string | null;
  datePreset: DatePreset;
  searchQuery: string;
  totalVisible: number;
  handleUpdateStatus: (orderId: number, newStatus: string) => void;
  handleStatusFilterChange: (filter: StatusFilter) => void;
  handleDatePreset: (preset: DatePreset) => void;
  handleDatePrev: () => void;
  handleDateNext: () => void;
  handleDateToday: () => void;
  handleSearchChange: (q: string) => void;
  handleExportCsv: () => void;
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
  const headers = ['Order #', 'Customer', 'Phone', 'Status', 'Payment', 'Total (THB)', 'Items', 'Address', 'Notes', 'Created At'];
  const rows = orders.map((o) => [
    o.order_number ?? o.id,
    o.user.name,
    o.user.phone ?? '',
    o.status_label,
    o.payment_method,
    (o.total_cents / 100).toFixed(2),
    o.items.map((i) => `${i.quantity}x ${i.name}`).join(' | '),
    (o.delivery_address ?? '').replace(/,/g, ' '),
    (o.customer_notes ?? '').replace(/,/g, ' '),
    formatDateTime(o.created_at),
  ]);
  return [headers, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

export function useOrdersScreen(): UseOrdersScreenResult {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [datePreset, setDatePreset]     = useState<DatePreset>('today');
  // Single-day (custom nav) — null = today
  const [dateFilter, setDateFilter]     = useState<string | null>(null);
  // Date range (used by presets last7 / last30)
  const [dateFrom, setDateFrom]         = useState<string | null>(null);
  const [dateTo, setDateTo]             = useState<string | null>(null);
  const [searchQuery, setSearchQuery]   = useState('');

  // Build API params from current preset state
  const queryParams = useMemo(() => {
    if (datePreset === 'today')     return { date: undefined };
    if (datePreset === 'yesterday') return { date: shiftDate(toDateString(new Date()), -1) };
    if (datePreset === 'last7' || datePreset === 'last30') {
      return { date_from: dateFrom ?? undefined, date_to: dateTo ?? undefined };
    }
    // custom: single-day nav
    return { date: dateFilter ?? undefined };
  }, [datePreset, dateFilter, dateFrom, dateTo]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [...QUERY_KEYS.ORDERS(), datePreset, dateFilter, dateFrom, dateTo],
    queryFn:  () => getOrders(queryParams),
    staleTime: CACHE_TTL.ORDERS,
    gcTime:    GC_TIME.DEFAULT,
    retry:     QUERY_RETRY,
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

  // Client-side search filter
  const matchesSearch = useCallback((o: FoodOrder): boolean => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      (o.order_number ?? '').toLowerCase().includes(q) ||
      o.user.name.toLowerCase().includes(q) ||
      (o.user.phone ?? '').includes(q)
    );
  }, [searchQuery]);

  const sections = useMemo<OrderSection[]>(() => {
    const filtered = orders.filter(matchesSearch);
    if (statusFilter === 'new') {
      const d = filtered.filter((o) => NEW_STATUSES.has(o.status));
      return d.length > 0 ? [{ title: 'New Orders', data: d }] : [];
    }
    if (statusFilter === 'in_progress') {
      const d = filtered.filter((o) => IN_PROGRESS_STATUSES.has(o.status));
      return d.length > 0 ? [{ title: 'In Progress', data: d }] : [];
    }
    if (statusFilter === 'done') {
      const d = filtered.filter((o) => DONE_STATUSES.has(o.status));
      return d.length > 0 ? [{ title: 'Completed & Cancelled', data: d }] : [];
    }
    return [
      { title: 'New Orders',              data: filtered.filter((o) => NEW_STATUSES.has(o.status)) },
      { title: 'In Progress',             data: filtered.filter((o) => IN_PROGRESS_STATUSES.has(o.status)) },
      { title: 'Completed & Cancelled',   data: filtered.filter((o) => DONE_STATUSES.has(o.status)) },
    ].filter((s) => s.data.length > 0);
  }, [orders, statusFilter, matchesSearch]);

  const totalVisible = useMemo(
    () => sections.reduce((sum, s) => sum + s.data.length, 0),
    [sections],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleUpdateStatus = useCallback(
    (orderId: number, newStatus: string) => {
      mutateStatus({ id: orderId, status: newStatus });
    },
    [mutateStatus],
  );

  const handleStatusFilterChange = useCallback((filter: StatusFilter) => {
    setStatusFilter(filter);
  }, []);

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
  }, []);

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
    if (Platform.OS !== 'web') return; // export is web-only
    const allOrders = sections.flatMap((s) => s.data);
    if (allOrders.length === 0) return;

    const csv      = buildCsv(allOrders);
    const dateStr  = toDateString(new Date());
    const filename = `orders-${dateStr}.csv`;

    // Trigger browser download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [sections]);

  return {
    sections,
    isLoading,
    isError,
    statusFilter,
    dateFilter,
    dateFrom,
    dateTo,
    datePreset,
    searchQuery,
    totalVisible,
    handleUpdateStatus,
    handleStatusFilterChange,
    handleDatePreset,
    handleDatePrev,
    handleDateNext,
    handleDateToday,
    handleSearchChange,
    handleExportCsv,
  };
}
