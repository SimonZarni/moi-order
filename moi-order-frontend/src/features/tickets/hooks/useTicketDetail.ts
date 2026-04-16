import { useQuery } from '@tanstack/react-query';

import { fetchTicket } from '@/shared/api/tickets';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { Ticket } from '@/types/models';

export interface UseTicketDetailResult {
  ticket: Ticket | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useTicketDetail(ticketId: number): UseTicketDetailResult {
  const { data: ticket, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.TICKETS.DETAIL(ticketId),
    queryFn:  () => fetchTicket(ticketId),
    staleTime: CACHE_TTL.USER_DATA,
  });

  return { ticket, isLoading, isError, refetch };
}
