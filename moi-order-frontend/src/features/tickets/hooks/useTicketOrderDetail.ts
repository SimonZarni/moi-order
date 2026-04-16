import { useQuery } from '@tanstack/react-query';

import { fetchTicketOrder } from '@/shared/api/ticketOrders';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { TicketOrder } from '@/types/models';

export interface UseTicketOrderDetailResult {
  order: TicketOrder | undefined;
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  refetch: () => void;
}

export function useTicketOrderDetail(ticketOrderId: number): UseTicketOrderDetailResult {
  const query = useQuery({
    queryKey: QUERY_KEYS.TICKET_ORDERS.DETAIL(ticketOrderId),
    queryFn:  () => fetchTicketOrder(ticketOrderId),
    staleTime: CACHE_TTL.USER_DATA,
  });

  return {
    order:       query.data,
    isLoading:   query.isLoading,
    isError:     query.isError,
    isRefreshing: query.isRefetching,
    refetch:     query.refetch,
  };
}
