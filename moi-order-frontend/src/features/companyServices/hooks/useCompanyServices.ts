import { useQuery } from '@tanstack/react-query';

import { fetchServices } from '@/shared/api/services';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { Service } from '@/types/models';

const COMPANY_SLUGS = new Set(['company-registration']);

export interface UseCompanyServicesResult {
  services: Service[];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useCompanyServices(): UseCompanyServicesResult {
  const query = useQuery({
    queryKey: QUERY_KEYS.SERVICES.LIST,
    queryFn:  fetchServices,
    staleTime: CACHE_TTL.STATIC_DATA,
  });

  const services = (query.data ?? []).filter((s) => COMPANY_SLUGS.has(s.slug));

  return {
    services,
    isLoading:    query.isPending,
    isRefreshing: query.isFetching && !query.isPending,
    isError:      query.isError,
    refetch:      query.refetch,
  };
}
