import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBusinessProfile,
  updateBusinessPhone,
  uploadBusinessProfileDocument,
} from '../../../api/businessProfile';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL } from '../../../shared/constants/config';
import type { BusinessProfile, KycDocument } from '../../../types/models';
import type { KycDocType } from '../../../types/enums';
import type { UploadFileRef } from '../../../api/kyc';
import type { UseMutationResult } from '@tanstack/react-query';

export interface UseBusinessProfileDataResult {
  profile: BusinessProfile | null;
  isLoading: boolean;
  isError: boolean;
  updatePhone: UseMutationResult<BusinessProfile, Error, string | null>;
  uploadDocument: UseMutationResult<KycDocument, Error, { type: KycDocType; file: UploadFileRef }>;
}

export function useBusinessProfileData(): UseBusinessProfileDataResult {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.BUSINESS_PROFILE,
    queryFn: getBusinessProfile,
    staleTime: CACHE_TTL.USER,
  });

  const updatePhone = useMutation<BusinessProfile, Error, string | null>({
    mutationFn: (phone) => updateBusinessPhone(phone),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.BUSINESS_PROFILE, updated);
    },
  });

  const uploadDocument = useMutation<KycDocument, Error, { type: KycDocType; file: UploadFileRef }>({
    mutationFn: ({ type, file }) => uploadBusinessProfileDocument(type, file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BUSINESS_PROFILE });
    },
  });

  return {
    profile: data ?? null,
    isLoading,
    isError,
    updatePhone,
    uploadDocument,
  };
}
