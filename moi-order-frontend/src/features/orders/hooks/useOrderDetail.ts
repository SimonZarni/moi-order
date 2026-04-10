import { useQuery } from '@tanstack/react-query';

import { fetchSubmission } from '@/shared/api/submissions';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { ServiceSubmission } from '@/types/models';

export interface UseOrderDetailResult {
  submission: ServiceSubmission | null;
  isLoading: boolean;
  isError: boolean;
}

export function useOrderDetail(submissionId: number): UseOrderDetailResult {
  const query = useQuery({
    queryKey: QUERY_KEYS.SUBMISSIONS.DETAIL(submissionId),
    queryFn:  () => fetchSubmission(submissionId),
    staleTime: CACHE_TTL.USER_DATA,
  });

  return {
    submission: query.data ?? null,
    isLoading:  query.isLoading,
    isError:    query.isError,
  };
}
