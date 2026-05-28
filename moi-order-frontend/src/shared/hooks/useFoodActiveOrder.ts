import { useQuery } from '@tanstack/react-query';
import { fetchActiveOrder } from '@/shared/api/foodOrders';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { useAuthStore } from '@/shared/store/authStore';
import { FoodOrder } from '@/types/models';

export function useFoodActiveOrder(): FoodOrder[] {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const { data } = useQuery({
    queryKey:       QUERY_KEYS.FOOD_ORDERS.ACTIVE,
    queryFn:        fetchActiveOrder,
    enabled:        isLoggedIn,
    refetchInterval: 30_000,
    staleTime:       10_000,
  });

  return data ?? [];
}
