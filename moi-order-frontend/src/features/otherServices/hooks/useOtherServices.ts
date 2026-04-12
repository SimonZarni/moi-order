import { useQuery } from '@tanstack/react-query';

import { fetchServices } from '@/shared/api/services';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { Service } from '@/types/models';

const FEATURED_SLUG = '90-day-report';

export interface UseOtherServicesResult {
  services: Service[];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useOtherServices(): UseOtherServicesResult {
  const query = useQuery({
    queryKey: QUERY_KEYS.SERVICES.LIST,
    queryFn:  fetchServices,
    staleTime: CACHE_TTL.STATIC_DATA,
  });

  // Filter out the featured 90-day-report which has its own card on Home.
  const services = (query.data ?? []).filter((s) => s.slug !== FEATURED_SLUG);

  return {
    services,
    isLoading:    query.isPending,
    isRefreshing: query.isFetching && !query.isPending,
    isError:      query.isError,
    refetch:      query.refetch,
  };
}
