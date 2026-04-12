import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchPlaces } from '@/shared/api/places';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { Place, ApiError } from '@/types/models';
import { PaginatedResponse } from '@/types/models';

export interface UsePlacesResult {
  places: Place[];
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  error: ApiError | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
}

export function usePlaces(): UsePlacesResult {
  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.PLACES.LIST,
    queryFn: ({ pageParam }) => fetchPlaces(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResponse<Place>) => {
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    // Places change infrequently — avoid refetching on every screen visit.
    staleTime: CACHE_TTL.USER_DATA,
    // Memoised flat array — only recomputed when pages actually change.
    select: (data) => ({
      ...data,
      places: data.pages.flatMap((page) => page.data),
    }),
  });

  return {
    places:             query.data?.places ?? [],
    isLoading:          query.isLoading,
    isError:            query.isError,
    // True only during a pull-to-refresh, not while paginating.
    isRefreshing:       query.isRefetching && !query.isFetchingNextPage,
    error:              query.error as ApiError | null,
    hasNextPage:        query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage:      query.fetchNextPage,
    refetch:            query.refetch,
  };
}
