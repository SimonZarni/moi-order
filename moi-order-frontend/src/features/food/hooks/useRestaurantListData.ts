import { useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchRestaurants } from '@/shared/api/restaurants';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { Restaurant } from '@/types/models';

export interface UseRestaurantListDataResult {
  restaurants: Restaurant[];
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
  handleRefresh: () => Promise<void>;
}

export function useRestaurantListData(search?: string, lat?: number, lng?: number): UseRestaurantListDataResult {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const query = useInfiniteQuery({
    queryKey:         QUERY_KEYS.RESTAURANTS.LIST(search, lat, lng),
    queryFn:          ({ pageParam }) => fetchRestaurants(pageParam as number, search, lat, lng),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.current_page < last.meta.last_page ? last.meta.current_page + 1 : undefined,
    staleTime: CACHE_TTL.LIVE_DATA,
  });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await query.refetch();
    setIsRefreshing(false);
  }, [query]);

  const restaurants: Restaurant[] = query.data?.pages.flatMap((p) => p.data) ?? [];

  return {
    restaurants,
    isLoading:          query.isLoading,
    isError:            query.isError,
    isRefreshing,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage:        query.hasNextPage,
    fetchNextPage:      query.fetchNextPage,
    refetch:            query.refetch,
    handleRefresh,
  };
}
