import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchTickets } from '@/shared/api/tickets';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { PaginatedResponse, Ticket } from '@/types/models';

export interface UseTicketsResult {
  tickets: Ticket[];
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
}

export function useTickets(): UseTicketsResult {
  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.TICKETS.LIST,
    queryFn: ({ pageParam }) => fetchTickets(pageParam as number),
    getNextPageParam: (last: PaginatedResponse<Ticket>) =>
      last.meta.current_page < last.meta.last_page
        ? last.meta.current_page + 1
        : undefined,
    initialPageParam: 1,
    staleTime: CACHE_TTL.USER_DATA,
    select: (data) => ({
      ...data,
      tickets: data.pages.flatMap((p) => p.data),
    }),
  });

  return {
    tickets:            query.data?.tickets ?? [],
    isLoading:          query.isLoading,
    isError:            query.isError,
    isRefreshing:       query.isRefetching && !query.isFetchingNextPage,
    hasNextPage:        query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage:      query.fetchNextPage,
    refetch:            query.refetch,
  };
}
