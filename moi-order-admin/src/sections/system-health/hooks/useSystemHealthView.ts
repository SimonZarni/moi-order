import type { ApiError } from 'src/types';
import type { SystemHealthData } from 'src/api/systemHealth';

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from 'src/api/queryKeys';
import { systemHealthApi } from 'src/api/systemHealth';

// ----------------------------------------------------------------------

export interface UseSystemHealthViewResult {
  data: SystemHealthData | undefined;
  isLoading: boolean;
  refetch: () => void;
}

// ----------------------------------------------------------------------

export function useSystemHealthView(): UseSystemHealthViewResult {
  const { data, isLoading, refetch: queryRefetch } = useQuery<
    { data: SystemHealthData },
    ApiError
  >({
    queryKey: QUERY_KEYS.systemHealth,
    queryFn:  systemHealthApi.get,
    refetchInterval: 30_000,
    staleTime:       10_000,
  });

  const refetch = useCallback(() => { queryRefetch(); }, [queryRefetch]);

  return {
    data:      data?.data,
    isLoading,
    refetch,
  };
}
