import { useQuery } from '@tanstack/react-query';

import { fetchServices } from '@/shared/api/services';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { Service } from '@/types/models';

// Slugs with dedicated Home cards are excluded from this general list.
const EXCLUDED_SLUGS = new Set(['90-day-report', 'airport-fast-track']);

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

  const services = (query.data ?? []).filter(
    (s) => !EXCLUDED_SLUGS.has(s.slug) && s.service_category_slug == null,
  );

  return {
    services,
    isLoading:    query.isPending,
    isRefreshing: query.isFetching && !query.isPending,
    isError:      query.isError,
    refetch:      query.refetch,
  };
}
