import { useQuery } from '@tanstack/react-query';

import { fetchVerificationStatus } from '@/shared/api/verification';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { VerificationStatus } from '@/types/models';

export interface UseVerificationStatusResult {
  status: VerificationStatus | undefined;
  isLoading: boolean;
}

export function useVerificationStatus(): UseVerificationStatusResult {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.VERIFICATION.STATUS,
    queryFn:  fetchVerificationStatus,
    staleTime: 60 * 1000,
  });

  return { status: data, isLoading };
}
