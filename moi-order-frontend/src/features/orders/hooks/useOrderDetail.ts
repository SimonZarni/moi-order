import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { cancelSubmission, fetchSubmission } from '@/shared/api/submissions';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { ApiError, ServiceSubmission } from '@/types/models';

export interface UseOrderDetailResult {
  submission: ServiceSubmission | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  refetch: () => void;
  cancelMutation: ReturnType<typeof useMutation<ServiceSubmission, ApiError, void>>;
}

export function useOrderDetail(submissionId: number): UseOrderDetailResult {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.SUBMISSIONS.DETAIL(submissionId),
    queryFn:  () => fetchSubmission(submissionId),
    staleTime: CACHE_TTL.USER_DATA,
  });

  const cancelMutation = useMutation<ServiceSubmission, ApiError, void>({
    mutationFn: () => cancelSubmission(submissionId),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.SUBMISSIONS.DETAIL(submissionId), updated);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBMISSIONS.LIST });
    },
  });

  return {
    submission:   query.data ?? null,
    isLoading:    query.isPending,
    isRefreshing: query.isFetching && !query.isPending,
    isError:      query.isError,
    refetch:      query.refetch,
    cancelMutation,
  };
}
