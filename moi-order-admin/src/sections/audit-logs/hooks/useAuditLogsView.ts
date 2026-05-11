import type { ApiError } from 'src/types';
import type { AuditLogData } from 'src/api/auditLogs';

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { QUERY_KEYS } from 'src/api/queryKeys';
import { auditLogsApi } from 'src/api/auditLogs';

// ----------------------------------------------------------------------

export interface UseAuditLogsViewResult {
  logs: AuditLogData[];
  total: number;
  isLoading: boolean;
  page: number;
  rowsPerPage: number;
  filterAction: string;
  filterEntityType: string;
  filterDateFrom: string;
  filterDateTo: string;
  filterSearch: string;
  updateParams: (updates: Record<string, string>) => void;
  handleExport: () => void;
}

// ----------------------------------------------------------------------

export function useAuditLogsView(): UseAuditLogsViewResult {
  const [searchParams, setSearchParams] = useSearchParams();

  const page            = Number(searchParams.get('page')        ?? '0');
  const rowsPerPage     = Number(searchParams.get('per_page')    ?? '20');
  const filterAction    = searchParams.get('action')      ?? 'all';
  const filterEntityType = searchParams.get('entity_type') ?? 'all';
  const filterDateFrom  = searchParams.get('date_from')    ?? '';
  const filterDateTo    = searchParams.get('date_to')      ?? '';
  const filterSearch    = searchParams.get('search')       ?? '';

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      setSearchParams(
        (prev) => {
          Object.entries(updates).forEach(([k, v]) => prev.set(k, v));
          return prev;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const listParams = {
    page: page + 1,
    per_page: rowsPerPage,
    action:      filterAction      !== 'all' ? filterAction      : undefined,
    entity_type: filterEntityType  !== 'all' ? filterEntityType  : undefined,
    date_from:   filterDateFrom    || undefined,
    date_to:     filterDateTo      || undefined,
    search:      filterSearch.trim() || undefined,
  };

  const { data: listData, isLoading } = useQuery<
    { data: AuditLogData[]; meta: { total: number } },
    ApiError
  >({
    queryKey: QUERY_KEYS.auditLogs.list(listParams),
    queryFn:  () => auditLogsApi.list(listParams),
    staleTime: 30_000,
  });

  const handleExport = useCallback(() => {
    const exportParams = {
      action:      filterAction      !== 'all' ? filterAction      : undefined,
      entity_type: filterEntityType  !== 'all' ? filterEntityType  : undefined,
      date_from:   filterDateFrom    || undefined,
      date_to:     filterDateTo      || undefined,
      search:      filterSearch.trim() || undefined,
    };

    auditLogsApi.export(exportParams).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  }, [filterAction, filterEntityType, filterDateFrom, filterDateTo, filterSearch]);

  return {
    logs:            listData?.data ?? [],
    total:           listData?.meta.total ?? 0,
    isLoading,
    page,
    rowsPerPage,
    filterAction,
    filterEntityType,
    filterDateFrom,
    filterDateTo,
    filterSearch,
    updateParams,
    handleExport,
  };
}
