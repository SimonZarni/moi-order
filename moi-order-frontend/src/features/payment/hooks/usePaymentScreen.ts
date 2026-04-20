import { useCallback, useMemo } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import { usePayment } from './usePayment';
import { useTicketOrderPayment } from './useTicketOrderPayment';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { SUBMISSION_STATUS, TICKET_ORDER_STATUS } from '@/types/enums';
import { ApiError, Payment } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

type RouteParams = RouteProp<RootStackParamList, 'Payment'>;

export interface UsePaymentScreenResult {
  payment: Payment | undefined;
  payableName: string;
  isCreating: boolean;
  createError: ApiError | null;
  isPaid: boolean;
  isPaymentFailed: boolean;
  isQrExpired: boolean;
  handleBack: () => void;
  handleGoToOrders: () => void;
  handleRefreshQr: () => void;
}

export function usePaymentScreen(): UsePaymentScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const queryClient = useQueryClient();
  const params = route.params;

  // ── Submission path ───────────────────────────────────────────────────────
  const submissionId = params.kind === 'submission' ? params.submissionId : 0;
  const {
    payment: submissionPayment,
    submission,
    isCreating: isCreatingSubmission,
    createError: submissionCreateError,
    refreshPayment: refreshSubmissionPayment,
  } = usePayment(submissionId);

  // ── Ticket order path ─────────────────────────────────────────────────────
  const ticketOrderId = params.kind === 'ticket_order' ? params.ticketOrderId : 0;
  const {
    payment: ticketPayment,
    ticketOrder,
    isCreating: isCreatingTicket,
    createError: ticketCreateError,
    refreshPayment: refreshTicketPayment,
  } = useTicketOrderPayment(ticketOrderId);

  // ── Derive unified values ─────────────────────────────────────────────────
  const payment = params.kind === 'submission' ? submissionPayment : ticketPayment;

  const isPaid = params.kind === 'submission'
    ? (submission?.status === SUBMISSION_STATUS.Processing || submission?.status === SUBMISSION_STATUS.Completed)
    : (ticketOrder?.status === TICKET_ORDER_STATUS.Processing || ticketOrder?.status === TICKET_ORDER_STATUS.Completed);

  const isPaymentFailed = params.kind === 'submission'
    ? submission?.status === SUBMISSION_STATUS.PaymentFailed
    : ticketOrder?.status === TICKET_ORDER_STATUS.PaymentFailed;

  const payableName = params.kind === 'submission'
    ? (submission?.service_type?.name ?? '')
    : (ticketOrder?.ticket?.name ?? '');

  const isCreating = params.kind === 'submission' ? isCreatingSubmission : isCreatingTicket;
  const createError = params.kind === 'submission' ? submissionCreateError : ticketCreateError;

  const isQrExpired = useMemo((): boolean => {
    if (!payment?.expires_at) return false;
    return new Date(payment.expires_at) < new Date();
  }, [payment?.expires_at]);

  const handleBack = useCallback((): void => { navigation.goBack(); }, [navigation]);

  const handleGoToOrders = useCallback((): void => {
    if (params.kind === 'submission') {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBMISSIONS.LIST });
    } else {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TICKET_ORDERS.LIST });
    }
    navigation.navigate('Orders');
  }, [navigation, queryClient, params.kind]);

  const handleRefreshQr = useCallback((): void => {
    if (params.kind === 'submission') {
      refreshSubmissionPayment();
    } else {
      refreshTicketPayment();
    }
  }, [params.kind, refreshSubmissionPayment, refreshTicketPayment]);

  return {
    payment, payableName, isCreating,
    createError: createError ?? null,
    isPaid, isPaymentFailed, isQrExpired,
    handleBack, handleGoToOrders, handleRefreshQr,
  };
}
