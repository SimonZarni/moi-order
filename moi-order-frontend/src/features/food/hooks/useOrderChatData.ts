import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrderChat, sendOrderChatMessage } from '@/shared/api/foodOrders';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { OrderChatMessage } from '@/types/models';

export interface UseOrderChatDataResult {
  messages: OrderChatMessage[];
  isLoading: boolean;
  isError: boolean;
}

export function useOrderChatData(orderId: string): UseOrderChatDataResult {
  const query = useQuery({
    queryKey: QUERY_KEYS.FOOD_ORDERS.CHAT(orderId),
    queryFn:  () => fetchOrderChat(orderId),
    enabled:  orderId.length > 0,
    refetchInterval: 10_000,
  });

  return {
    messages:  query.data ?? [],
    isLoading: query.isLoading,
    isError:   query.isError,
  };
}

export interface SendMessageInput {
  orderId: string;
  body: string | null;
  image: { uri: string; name: string; type: string } | null;
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, body, image }: SendMessageInput) =>
      sendOrderChatMessage(orderId, body, image),
    onSuccess: (newMsg, { orderId }) => {
      queryClient.setQueryData<OrderChatMessage[]>(
        QUERY_KEYS.FOOD_ORDERS.CHAT(orderId),
        (prev) => [...(prev ?? []), newMsg],
      );
    },
  });
}
