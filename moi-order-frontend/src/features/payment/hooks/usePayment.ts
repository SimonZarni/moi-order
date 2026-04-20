import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPayment, syncPaymentStatus } from '@/shared/api/payments';
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
}

export interface UsePaymentRefreshable extends UsePaymentResult {
  refreshPayment: () => void;
}

/**
 * Principle: SRP — creates the payment intent, polls submission status, and syncs
 *   with Stripe directly when the app returns to the foreground.
 *
 * Polling stops automatically when submission leaves pending_payment (success or failure).
 *
 * AppState sync: when the user returns from the banking app, we POST /payment/sync so
 *   the backend queries Stripe and applies any state transition — fallback for missed
 *   webhooks. After sync we invalidate the submission query so polling picks up the
 *   updated status immediately.
 */
export function usePayment(submissionId: number): UsePaymentResult {
  const queryClient = useQueryClient();

  const {
    mutate: create,
    data: payment,
    isPending: isCreating,
    error: createError,
  } = useMutation<Payment, ApiError>({
    mutationFn: () => createPayment(submissionId),
  });

  // Create payment intent on mount.
  useEffect(() => {
    create();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]);

  const { data: submission, isLoading: isLoadingSubmission } = useQuery({
    queryKey: QUERY_KEYS.SUBMISSIONS.DETAIL(submissionId),
    queryFn:  () => fetchSubmission(submissionId),
    // Poll every 3 seconds while awaiting payment; stop once status changes.
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === SUBMISSION_STATUS.PendingPayment ? 3000 : false;
    },
  });

  // Track whether payment is still pending so we skip sync after it's confirmed.
  const isPendingRef = useRef(submission?.status === SUBMISSION_STATUS.PendingPayment);
  useEffect(() => {
    isPendingRef.current = submission?.status === SUBMISSION_STATUS.PendingPayment;
  }, [submission?.status]);

  const handleAppStateChange = useCallback(async (nextState: AppStateStatus): Promise<void> => {
    // Only sync when coming to foreground and payment is still pending.
    if (nextState !== 'active' || !isPendingRef.current) return;

    try {
      await syncPaymentStatus(submissionId);
      // Invalidate the submission cache so the next poll picks up the updated status.
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBMISSIONS.DETAIL(submissionId) });
    } catch {
      // Sync failures are non-critical; regular polling continues as fallback.
    }
  }, [submissionId, queryClient]);

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
    refreshPayment: create,
  };
}
