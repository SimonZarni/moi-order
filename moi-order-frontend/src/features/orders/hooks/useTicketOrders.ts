import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';

import { fetchTicketOrders, deleteTicketOrder } from '@/shared/api/ticketOrders';
import { useAuthStore } from '@/shared/store/authStore';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { PaginatedResponse, TicketOrder, ApiError } from '@/types/models';

export interface UseTicketOrdersResult {
  ticketOrders: TicketOrder[];
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
  deleteMutation: ReturnType<typeof useMutation<void, ApiError, string>>;
}

export function useTicketOrders(): UseTicketOrdersResult {
  const { isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.TICKET_ORDERS.LIST,
    queryFn: ({ pageParam }) => fetchTicketOrders(pageParam as number),
    enabled: isLoggedIn,
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

  const deleteMutation = useMutation<void, ApiError, string>({
    mutationFn: (id) => deleteTicketOrder(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(
        QUERY_KEYS.TICKET_ORDERS.LIST,
        (old: InfiniteData<PaginatedResponse<TicketOrder>> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((o) => o.id !== id),
            })),
          };
        },
      );
    },
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
    deleteMutation,
  };
}
