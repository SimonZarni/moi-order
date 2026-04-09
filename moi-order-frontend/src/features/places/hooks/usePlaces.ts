import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchPlaces } from '@/shared/api/places';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { Place, ApiError } from '@/types/models';
import { PaginatedResponse } from '@/types/models';

export interface UsePlacesResult {
  places: Place[];
  isLoading: boolean;
  isError: boolean;
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
  });

  const places = query.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    places,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as ApiError | null,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  };
}
