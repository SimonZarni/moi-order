import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchTicketOrders } from '@/shared/api/ticketOrders';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { PaginatedResponse, TicketOrder } from '@/types/models';

export interface UseTicketOrdersResult {
  ticketOrders: TicketOrder[];
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
}

export function useTicketOrders(): UseTicketOrdersResult {
  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.TICKET_ORDERS.LIST,
    queryFn: ({ pageParam }) => fetchTicketOrders(pageParam as number),
    getNextPageParam: (last: PaginatedResponse<TicketOrder>) =>
      last.meta.current_page < last.meta.last_page
        ? last.meta.current_page + 1
        : undefined,
    initialPageParam: 1,
    staleTime: CACHE_TTL.USER_DATA,
    select: (data) => ({
      ...data,
      ticketOrders: data.pages.flatMap((p) => p.data),
    }),
  });

  return {
    ticketOrders:       query.data?.ticketOrders ?? [],
    isLoading:          query.isLoading,
    isError:            query.isError,
    isRefreshing:       query.isRefetching && !query.isFetchingNextPage,
    hasNextPage:        query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage:      query.fetchNextPage,
    refetch:            query.refetch,
  };
}
