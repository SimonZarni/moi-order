import { useQuery } from '@tanstack/react-query';

import { fetchServices } from '@/shared/api/services';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';

const AIRPORT_SLUG = 'airport-fast-track';

export interface UseAirportFastTrackCardResult {
  serviceTypeId: number | null;
  price: number | null;
  isReady: boolean;
}

export function useAirportFastTrackCard(): UseAirportFastTrackCardResult {
  const query = useQuery({
    queryKey:  QUERY_KEYS.SERVICES.LIST,
    queryFn:   fetchServices,
    staleTime: CACHE_TTL.STATIC_DATA,
  });

  const service = query.data?.find((s) => s.slug === AIRPORT_SLUG);
  const firstType = service?.types[0] ?? null;

  return {
    serviceTypeId: firstType?.id ?? null,
    price:         firstType?.price ?? null,
    isReady:       firstType !== null,
  };
}
