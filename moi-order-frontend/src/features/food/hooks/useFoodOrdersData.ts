import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFoodOrders, fetchFoodOrderDetail, placeFoodOrder, PlaceFoodOrderInput } from '@/shared/api/foodOrders';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { FoodOrder, PaginatedResponse } from '@/types/models';
import { FOOD_ORDER_STATUS } from '@/types/enums';
import { useAuthStore } from '@/shared/store/authStore';

const isTerminalStatus = (status: string) =>
  status === FOOD_ORDER_STATUS.Completed || status === FOOD_ORDER_STATUS.Cancelled;

const hasActiveInList = (data?: PaginatedResponse<FoodOrder>) =>
  data?.data.some((o) => !isTerminalStatus(o.status)) ?? false;

export interface UseFoodOrdersDataResult {
  orders: FoodOrder[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useFoodOrdersData(): UseFoodOrdersDataResult {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const query = useQuery({
    queryKey:        QUERY_KEYS.FOOD_ORDERS.LIST,
    queryFn:         () => fetchFoodOrders(),
    enabled:         isLoggedIn,
    // Poll while any order in the list is still active; stop once all are terminal.
    refetchInterval: (q) => (hasActiveInList(q.state.data) ? 12_000 : false),
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
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const query = useQuery({
    queryKey:        QUERY_KEYS.FOOD_ORDERS.DETAIL(id),
    queryFn:         () => fetchFoodOrderDetail(id),
    enabled:         isLoggedIn && id.length > 0,
    // Poll every 5 s while the order is still active; stop once terminal.
    refetchInterval: (q) => (q.state.data && isTerminalStatus(q.state.data.status) ? false : 5_000),
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
