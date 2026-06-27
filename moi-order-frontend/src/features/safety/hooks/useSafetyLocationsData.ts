import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getSafetyLocation, listSafetyLocations } from '@/shared/api/safety';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { SafetyCategoryValue, SafetyLocation } from '@/types/models';

// ── List hook ─────────────────────────────────────────────────────────────────

export interface UseSafetyLocationsResult {
  locations:          SafetyLocation[];
  isLoading:          boolean;
  isError:            boolean;
  isRefreshing:       boolean;
  hasNextPage:        boolean;
  isFetchingNextPage: boolean;
  fetchNextPage:      () => void;
  refetch:            () => void;
}

export function useSafetyLocations(category: SafetyCategoryValue): UseSafetyLocationsResult {
  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.SAFETY_LOCATIONS.LIST(category),
    queryFn:  ({ pageParam }) =>
      listSafetyLocations({ category, page: pageParam as number, per_page: 50 }),
    getNextPageParam: (last) =>
      last.meta.current_page < last.meta.last_page ? last.meta.current_page + 1 : undefined,
    initialPageParam: 1,
    staleTime: CACHE_TTL.STATIC_DATA,
    select: (data) => ({ ...data, locations: data.pages.flatMap((p) => p.data) }),
  });

  return {
    locations:          query.data?.locations ?? [],
    isLoading:          query.isLoading,
    isError:            query.isError,
    isRefreshing:       query.isRefetching && !query.isFetchingNextPage,
    hasNextPage:        query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage:      query.fetchNextPage,
    refetch:            query.refetch,
  };
}

// ── Detail hook ───────────────────────────────────────────────────────────────

export interface UseSafetyLocationDetailResult {
  location:  SafetyLocation | null;
  isLoading: boolean;
  isError:   boolean;
}

export function useSafetyLocationDetail(id: number): UseSafetyLocationDetailResult {
  const query = useQuery({
    queryKey: QUERY_KEYS.SAFETY_LOCATIONS.DETAIL(id),
    queryFn:  () => getSafetyLocation(id),
    staleTime: CACHE_TTL.STATIC_DATA,
  });

  return {
    location:  query.data ?? null,
    isLoading: query.isLoading,
    isError:   query.isError,
  };
}
