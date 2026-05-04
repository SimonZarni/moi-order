import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { cancelTicketOrder, fetchTicketOrder } from '@/shared/api/ticketOrders';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { ApiError, TicketOrder } from '@/types/models';

export interface UseTicketOrderDetailResult {
  order: TicketOrder | undefined;
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  refetch: () => void;
  cancelMutation: ReturnType<typeof useMutation<TicketOrder, ApiError, void>>;
}

export function useTicketOrderDetail(ticketOrderId: number): UseTicketOrderDetailResult {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.TICKET_ORDERS.DETAIL(ticketOrderId),
    queryFn:  () => fetchTicketOrder(ticketOrderId),
    staleTime: CACHE_TTL.USER_DATA,
  });

  const cancelMutation = useMutation<TicketOrder, ApiError, void>({
    mutationFn: () => cancelTicketOrder(ticketOrderId),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.TICKET_ORDERS.DETAIL(ticketOrderId), updated);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_ORDERS.LIST });
    },
  });

  return {
    order:        query.data,
    isLoading:    query.isLoading,
    isError:      query.isError,
    isRefreshing: query.isRefetching,
    refetch:      query.refetch,
    cancelMutation,
  };
}
