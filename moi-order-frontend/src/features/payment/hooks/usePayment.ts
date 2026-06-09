import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPayment, fetchPayment, syncPaymentStatus } from '@/shared/api/payments';
import { fetchSubmission } from '@/shared/api/submissions';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { SUBMISSION_STATUS } from '@/types/enums';
import { ApiError, Payment, ServiceSubmission } from '@/types/models';

export interface UsePaymentResult {
  payment: Payment | undefined;
  submission: ServiceSubmission | undefined;
  isCreating: boolean;
  isLoadingSubmission: boolean;
  createError: ApiError | null;
  isWaitingForQr: boolean;
}

export interface UsePaymentRefreshable extends UsePaymentResult {
  refreshPayment: () => void;
}

/**
 * Principle: SRP — creates payment intent, polls submission + payment status.
 *
 * Stripe mode: polls submission every 3s; AppState triggers /sync fallback.
 * PromptPay modes: no AppState sync. Polls payment record when waiting for QR
 *   (manual_qr: admin uploads per-payment; qr_image_url starts null).
 * isWaitingForQr: payment exists, pending, and has neither qr_data nor qr_image_url.
 */
export function usePayment(submissionId: string): UsePaymentRefreshable {
  const queryClient = useQueryClient();

  const {
    mutate: create,
    data: mutationPayment,
    isPending: isCreating,
    error: createError,
  } = useMutation<Payment, ApiError>({
    mutationFn: () => createPayment(submissionId),
  });

  useEffect(() => {
    if (!submissionId) return;
    create();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]);

  const { data: submission, isLoading: isLoadingSubmission } = useQuery({
    queryKey: QUERY_KEYS.SUBMISSIONS.DETAIL(submissionId),
    queryFn:  () => fetchSubmission(submissionId),
    enabled:  submissionId.length > 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === SUBMISSION_STATUS.PendingPayment ? 3000 : false;
    },
  });

  // After mutation resolves, the payment lives here.
  const isWaitingForQr =
    mutationPayment !== undefined &&
    mutationPayment.qr_image_url === null &&
    mutationPayment.qr_data === null &&
    mutationPayment.status === 'pending';

  // Poll the payment record itself when waiting for admin to upload QR.
  const { data: polledPayment } = useQuery({
    queryKey: QUERY_KEYS.PAYMENTS.DETAIL(submissionId),
    queryFn:  () => fetchPayment(submissionId),
    enabled:  isWaitingForQr,
    refetchInterval: isWaitingForQr ? 5000 : false,
  });

  // Merge: prefer polled data (has the uploaded QR) over mutation snapshot.
  const payment = polledPayment ?? mutationPayment;

  // Stripe-only: sync with Stripe on foreground return.
  const isStripePayment = payment?.qr_data !== null;
  const isPendingRef = useRef(submission?.status === SUBMISSION_STATUS.PendingPayment);
  useEffect(() => {
    isPendingRef.current = submission?.status === SUBMISSION_STATUS.PendingPayment;
  }, [submission?.status]);

  const handleAppStateChange = useCallback(async (nextState: AppStateStatus): Promise<void> => {
    if (nextState !== 'active' || !isPendingRef.current || !isStripePayment) return;
    try {
      await syncPaymentStatus(submissionId);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBMISSIONS.DETAIL(submissionId) });
    } catch {
      // Sync failures are non-critical; regular polling continues as fallback.
    }
  }, [submissionId, queryClient, isStripePayment]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [handleAppStateChange]);

  return {
    payment,
    submission,
    isCreating,
    isLoadingSubmission,
    createError,
    isWaitingForQr: payment?.qr_image_url === null &&
      payment?.qr_data === null &&
      payment?.status === 'pending',
    refreshPayment: create,
  };
}
