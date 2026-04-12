import { useQuery } from '@tanstack/react-query';

import { fetchPlaceDetail } from '@/shared/api/places';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { Place, ApiError } from '@/types/models';

export interface UsePlaceDetailResult {
  place: Place | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export function usePlaceDetail(placeId: number): UsePlaceDetailResult {
  const query = useQuery({
    queryKey: QUERY_KEYS.PLACES.DETAIL(placeId),
    queryFn: () => fetchPlaceDetail(placeId),
    staleTime: CACHE_TTL.USER_DATA,
  });

  return {
    place: query.data ?? null,
    // Show spinner during first fetch (isPending) AND during retries after a cached
    // error (isError && isFetching). Without the second condition, TanStack serves
    // the cached error state instantly on remount while the retry is already in
    // flight — causing a false "failed to load" flash before the retry succeeds.
    isLoading: query.isPending || (query.isError && query.isFetching),
    // True during a background refetch (data already loaded) — drives RefreshControl.
    isRefreshing: query.isFetching && !query.isPending,
    // Only surface the error once all retries are exhausted (not actively fetching).
    isError: query.isError && !query.isFetching,
    error: query.error as ApiError | null,
    refetch: query.refetch,
  };
}
