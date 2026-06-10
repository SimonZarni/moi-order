import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { applyForMerchant, cancelMerchantApplication, fetchMerchantApplication } from '@/shared/api/merchant';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { ApiError, KycApplication } from '@/types/models';

export interface UseMerchantApplicationDataResult {
  application: KycApplication | null | undefined;
  isLoading: boolean;
  applyMutation: ReturnType<typeof useMutation<KycApplication, ApiError, void>>;
  cancelMutation: ReturnType<typeof useMutation<void, ApiError, void>>;
}

export function useMerchantApplicationData(): UseMerchantApplicationDataResult {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.MERCHANT_APPLICATION.STATUS,
    queryFn: fetchMerchantApplication,
    staleTime: CACHE_TTL.USER_DATA,
  });

  const applyMutation = useMutation<KycApplication, ApiError, void>({
    mutationFn: () => applyForMerchant(),
    onSuccess: (application) => {
      queryClient.setQueryData(QUERY_KEYS.MERCHANT_APPLICATION.STATUS, application);
    },
  });

  const cancelMutation = useMutation<void, ApiError, void>({
    mutationFn: () => cancelMerchantApplication(),
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.MERCHANT_APPLICATION.STATUS, null);
    },
  });

  return { application: data, isLoading, applyMutation, cancelMutation };
}
