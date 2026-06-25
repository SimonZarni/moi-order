import { useQueries } from '@tanstack/react-query';

import { fetchActiveSubmissions } from '@/shared/api/submissions';
import { fetchActiveTicketOrders } from '@/shared/api/ticketOrders';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { useAuthStore } from '@/shared/store/authStore';

const POLL_INTERVAL_MS = 30_000;

export function usePendingOrderCount(): number {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const [submissions, ticketOrders] = useQueries({
    queries: [
      {
        queryKey:        QUERY_KEYS.SUBMISSIONS.ACTIVE,
        queryFn:         fetchActiveSubmissions,
        enabled:         isLoggedIn,
        refetchInterval: POLL_INTERVAL_MS,
        staleTime:       POLL_INTERVAL_MS,
      },
      {
        queryKey:        QUERY_KEYS.TICKET_ORDERS.ACTIVE,
        queryFn:         fetchActiveTicketOrders,
        enabled:         isLoggedIn,
        refetchInterval: POLL_INTERVAL_MS,
        staleTime:       POLL_INTERVAL_MS,
      },
    ],
  });

  return (
    (submissions.data?.length ?? 0) +
    (ticketOrders.data?.length ?? 0)
  );
}
