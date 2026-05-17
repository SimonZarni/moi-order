import { useQuery } from '@tanstack/react-query';

import { fetchServices } from '@/shared/api/services';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { ServiceType } from '@/types/models';

export interface UseCompanyServicesResult {
  serviceId: number | undefined;
  types: ServiceType[];
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

  const companyService = (query.data ?? []).find((s) => s.slug === 'company-services');

  return {
    serviceId:    companyService?.id,
    types:        companyService?.types ?? [],
    isLoading:    query.isPending,
    isRefreshing: query.isFetching && !query.isPending,
    isError:      query.isError,
    refetch:      query.refetch,
  };
}
