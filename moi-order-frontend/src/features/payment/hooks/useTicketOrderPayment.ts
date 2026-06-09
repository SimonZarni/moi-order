import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createTicketOrderPayment,
  fetchTicketOrder,
  fetchTicketOrderPayment,
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
  isWaitingForQr: boolean;
}

export interface UseTicketOrderPaymentRefreshable extends UseTicketOrderPaymentResult {
  refreshPayment: () => void;
}

/**
 * Mirrors usePayment — same polling + QR-wait pattern for TicketOrder.
 * Principle: OCP — new payable type adds a new hook instead of modifying usePayment.
 */
export function useTicketOrderPayment(ticketOrderId: string): UseTicketOrderPaymentRefreshable {
  const queryClient = useQueryClient();

  const {
    mutate: create,
    data: mutationPayment,
    isPending: isCreating,
    error: createError,
  } = useMutation<Payment, ApiError>({
    mutationFn: () => createTicketOrderPayment(ticketOrderId),
  });

  useEffect(() => {
    if (!ticketOrderId) return;
    create();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketOrderId]);

  const { data: ticketOrder, isLoading: isLoadingOrder } = useQuery({
    queryKey: QUERY_KEYS.TICKET_ORDERS.DETAIL(ticketOrderId),
    queryFn:  () => fetchTicketOrder(ticketOrderId),
    enabled:  ticketOrderId.length > 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === TICKET_ORDER_STATUS.PendingPayment ? 3000 : false;
    },
  });

  const isWaitingForQr =
    mutationPayment !== undefined &&
    mutationPayment.qr_image_url === null &&
    mutationPayment.qr_data === null &&
    mutationPayment.status === 'pending';

  const { data: polledPayment } = useQuery({
    queryKey: QUERY_KEYS.PAYMENTS.DETAIL(ticketOrderId),
    queryFn:  () => fetchTicketOrderPayment(ticketOrderId),
    enabled:  isWaitingForQr,
    refetchInterval: isWaitingForQr ? 5000 : false,
  });

  const payment = polledPayment ?? mutationPayment;

  const isStripePayment = payment?.qr_data !== null;
  const isPendingRef = useRef(ticketOrder?.status === TICKET_ORDER_STATUS.PendingPayment);
  useEffect(() => {
    isPendingRef.current = ticketOrder?.status === TICKET_ORDER_STATUS.PendingPayment;
  }, [ticketOrder?.status]);

  const handleAppStateChange = useCallback(async (nextState: AppStateStatus): Promise<void> => {
    if (nextState !== 'active' || !isPendingRef.current || !isStripePayment) return;
    try {
      await syncTicketOrderPaymentStatus(ticketOrderId);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_ORDERS.DETAIL(ticketOrderId) });
    } catch {
      // Non-critical; polling continues as fallback.
    }
  }, [ticketOrderId, queryClient, isStripePayment]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [handleAppStateChange]);

  return {
    payment,
    ticketOrder,
    isCreating,
    isLoadingOrder,
    createError,
    isWaitingForQr: payment?.qr_image_url === null &&
      payment?.qr_data === null &&
      payment?.status === 'pending',
    refreshPayment: create,
  };
}
