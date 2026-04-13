import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createPayment } from '@/shared/api/payments';
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

/**
 * Principle: SRP — creates the payment intent and polls the submission status.
 * Polling stops automatically when submission leaves pending_payment (success or failure).
 */
export function usePayment(submissionId: number): UsePaymentResult {
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

  return {
    payment,
    submission,
    isCreating,
    isLoadingSubmission,
    createError,
  };
}
