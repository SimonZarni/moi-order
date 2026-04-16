import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createTicketOrderPayment,
  fetchTicketOrder,
  syncTicketOrderPaymentStatus,
} from '@/shared/api/ticketOrders';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { TICKET_ORDER_STATUS } from '@/types/enums';
import { ApiError, Payment, TicketOrder } from '@/types/models';

export interface UseTicketOrderPaymentResult {
  payment: Payment | undefined;
  ticketOrder: TicketOrder | undefined;
  isCreating: boolean;
  isLoadingOrder: boolean;
  createError: ApiError | null;
}

/**
 * Mirrors usePayment but for TicketOrder — same polling + AppState sync pattern.
 * Principle: OCP — new payable type adds a new hook instead of modifying usePayment.
 */
export function useTicketOrderPayment(ticketOrderId: number): UseTicketOrderPaymentResult {
  const queryClient = useQueryClient();

  const {
    mutate: create,
    data: payment,
    isPending: isCreating,
    error: createError,
  } = useMutation<Payment, ApiError>({
    mutationFn: () => createTicketOrderPayment(ticketOrderId),
  });

  useEffect(() => {
    create();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketOrderId]);

  const { data: ticketOrder, isLoading: isLoadingOrder } = useQuery({
    queryKey: QUERY_KEYS.TICKET_ORDERS.DETAIL(ticketOrderId),
    queryFn:  () => fetchTicketOrder(ticketOrderId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === TICKET_ORDER_STATUS.PendingPayment ? 3000 : false;
    },
  });

  const isPendingRef = useRef(ticketOrder?.status === TICKET_ORDER_STATUS.PendingPayment);
  useEffect(() => {
    isPendingRef.current = ticketOrder?.status === TICKET_ORDER_STATUS.PendingPayment;
  }, [ticketOrder?.status]);

  const handleAppStateChange = useCallback(async (nextState: AppStateStatus): Promise<void> => {
    if (nextState !== 'active' || !isPendingRef.current) return;
    try {
      await syncTicketOrderPaymentStatus(ticketOrderId);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_ORDERS.DETAIL(ticketOrderId) });
    } catch {
      // Non-critical; polling continues as fallback.
    }
  }, [ticketOrderId, queryClient]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [handleAppStateChange]);

  return { payment, ticketOrder, isCreating, isLoadingOrder, createError };
}
