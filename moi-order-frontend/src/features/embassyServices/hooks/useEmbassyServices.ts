import { useQuery } from '@tanstack/react-query';

import { fetchServiceCategory } from '@/shared/api/serviceCategories';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { EMBASSY_CATEGORY_SLUG } from '@/shared/constants/serviceCategories';
import { Service } from '@/types/models';

export interface UseEmbassyServicesResult {
  services: Service[];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useEmbassyServices(): UseEmbassyServicesResult {
  const query = useQuery({
    queryKey: QUERY_KEYS.SERVICE_CATEGORIES.BY_SLUG(EMBASSY_CATEGORY_SLUG),
    queryFn:  () => fetchServiceCategory(EMBASSY_CATEGORY_SLUG),
    staleTime: CACHE_TTL.STATIC_DATA,
  });

  return {
    services:     query.data?.services ?? [],
    isLoading:    query.isPending,
    isRefreshing: query.isFetching && !query.isPending,
    isError:      query.isError,
    refetch:      query.refetch,
  };
}
