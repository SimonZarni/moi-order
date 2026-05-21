import type { ApiError } from 'src/types';
import type { PaymentSettings } from 'src/api/settings';
import type { PaymentData, PaymentStats } from 'src/api/payments';

import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import { paymentsApi } from 'src/api/payments';
import { settingsApi } from 'src/api/settings';
import { QUERY_KEYS } from 'src/api/queryKeys';

// ----------------------------------------------------------------------

type SummaryItem = {
  label: string;
  value: string;
  color: 'primary' | 'success' | 'warning' | 'error';
};

export interface UsePaymentsViewResult {
  payments: PaymentData[];
  stats: PaymentStats | null;
  total: number;
  isLoading: boolean;
  autoPayment: boolean | null;
  togglingAutoPayment: boolean;
  page: number;
  rowsPerPage: number;
  filterStatus: string;
  filterSearch: string;
  summary: SummaryItem[];
  updateParams: (updates: Record<string, string>) => void;
  navigateToPayment: (id: number) => void;
  handleToggleAutoPayment: () => void;
  handleExport: () => void;
}

// ----------------------------------------------------------------------

export function usePaymentsView(): UsePaymentsViewResult {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const page        = Number(searchParams.get('page')     ?? '0');
  const rowsPerPage = Number(searchParams.get('per_page') ?? '10');
  const filterStatus = searchParams.get('status') ?? 'all';
  const filterSearch = searchParams.get('search') ?? '';

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      setSearchParams(
        (prev) => { Object.entries(updates).forEach(([k, v]) => prev.set(k, v)); return prev; },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const listParams = {
    page: page + 1,
    per_page: rowsPerPage,
    status: filterStatus !== 'all' ? filterStatus : undefined,
    search: filterSearch.trim() || undefined,
  };

  const { data: listData, isLoading } = useQuery<
    { data: PaymentData[]; meta: { total: number } },
    ApiError
  >({
    queryKey: QUERY_KEYS.payments.list(listParams),
    queryFn: () => paymentsApi.list(listParams),
    staleTime: 30_000,
  });

  const { data: statsData } = useQuery<PaymentStats, ApiError>({
    queryKey: QUERY_KEYS.payments.stats,
    queryFn: paymentsApi.stats,
    staleTime: 5 * 60_000,
  });

  const { data: settingsData } = useQuery<PaymentSettings, ApiError>({
    queryKey: QUERY_KEYS.payments.settings,
    queryFn: settingsApi.getPaymentSettings,
    staleTime: 5 * 60_000,
  });

  const toggleAutoPaymentMutation = useMutation<PaymentSettings, ApiError>({
    mutationFn: settingsApi.toggleAutoPayment,
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.payments.settings, updated);
    },
  });

  const summary = useMemo<SummaryItem[]>(
    () => [
      { label: 'Total Revenue', value: fCurrency((statsData?.total_revenue ?? 0) / 100), color: 'primary' },
      { label: 'Succeeded',     value: String(statsData?.succeeded_count ?? 0),           color: 'success' },
      { label: 'Pending',       value: String(statsData?.pending_count   ?? 0),           color: 'warning' },
      { label: 'Failed',        value: String(statsData?.failed_count    ?? 0),           color: 'error'   },
    ],
    [statsData]
  );

  const navigateToPayment = useCallback(
    (id: number) => { router.push(`/payments/${id}`); },
    [router]
  );

  const handleToggleAutoPayment = useCallback(
    () => { toggleAutoPaymentMutation.mutate(); },
    [toggleAutoPaymentMutation]
  );

  const handleExport = useCallback(() => {
    paymentsApi.export({
      status: filterStatus !== 'all' ? filterStatus : undefined,
      search: filterSearch.trim() || undefined,
    }).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }, [filterStatus, filterSearch]);

  return {
    payments: listData?.data ?? [],
    stats: statsData ?? null,
    total: listData?.meta.total ?? 0,
    isLoading,
    autoPayment: settingsData?.auto_payment_enabled ?? null,
    togglingAutoPayment: toggleAutoPaymentMutation.isPending,
    page,
    rowsPerPage,
    filterStatus,
    filterSearch,
    summary,
    updateParams,
    navigateToPayment,
    handleToggleAutoPayment,
    handleExport,
  };
}
