import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFoodOrders, fetchFoodOrderDetail, placeFoodOrder, PlaceFoodOrderInput } from '@/shared/api/foodOrders';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { FoodOrder } from '@/types/models';
import { FOOD_ORDER_STATUS } from '@/types/enums';
import { useAuthStore } from '@/shared/store/authStore';

export interface UseFoodOrdersDataResult {
  orders: FoodOrder[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useFoodOrdersData(): UseFoodOrdersDataResult {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const query = useQuery({
    queryKey: QUERY_KEYS.FOOD_ORDERS.LIST,
    queryFn:  () => fetchFoodOrders(),
    enabled:  isLoggedIn,
  });

  return {
    orders:    query.data?.data ?? [],
    isLoading: query.isLoading,
    isError:   query.isError,
    refetch:   query.refetch,
  };
}

export interface UseFoodOrderDetailDataResult {
  order: FoodOrder | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useFoodOrderDetailData(id: string): UseFoodOrderDetailDataResult {
  const isTerminal = (order?: FoodOrder) =>
    order?.status === FOOD_ORDER_STATUS.Completed || order?.status === FOOD_ORDER_STATUS.Cancelled;

  const query = useQuery({
    queryKey:       QUERY_KEYS.FOOD_ORDERS.DETAIL(id),
    queryFn:        () => fetchFoodOrderDetail(id),
    enabled:        id.length > 0,
    // Poll every 8 s while order is in a non-terminal state.
    refetchInterval: (q) => (isTerminal(q.state.data) ? false : 8000),
  });

  return {
    order:     query.data,
    isLoading: query.isLoading,
    isError:   query.isError,
    refetch:   query.refetch,
  };
}

export function usePlaceFoodOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PlaceFoodOrderInput) => placeFoodOrder(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOOD_ORDERS.LIST });
    },
  });
}
