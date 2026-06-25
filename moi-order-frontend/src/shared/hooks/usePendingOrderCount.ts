import { useQuery } from '@tanstack/react-query';

import { fetchActiveOrder } from '@/shared/api/foodOrders';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { useAuthStore } from '@/shared/store/authStore';

const POLL_INTERVAL_MS = 30_000;

export function usePendingOrderCount(): number {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const { data } = useQuery({
    queryKey:        QUERY_KEYS.FOOD_ORDERS.ACTIVE,
    queryFn:         fetchActiveOrder,
    enabled:         isLoggedIn,
    refetchInterval: POLL_INTERVAL_MS,
    staleTime:       POLL_INTERVAL_MS,
  });

  return data?.length ?? 0;
}
