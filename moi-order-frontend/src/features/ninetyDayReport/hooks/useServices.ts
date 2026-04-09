import { useQuery } from '@tanstack/react-query';

import { fetchServices } from '@/shared/api/services';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { CACHE_TTL } from '@/shared/constants/config';
import { Service } from '@/types/models';

export interface UseServicesResult {
  services: Service[];
  isLoading: boolean;
  isError: boolean;
}

export function useServices(): UseServicesResult {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.SERVICES.LIST,
    queryFn:  fetchServices,
    staleTime: CACHE_TTL.STATIC_DATA, // service catalog rarely changes
  });

  return {
    services:  data ?? [],
    isLoading,
    isError,
  };
}
