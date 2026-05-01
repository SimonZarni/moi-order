import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getKycApplication } from '../../../api/kyc';
import { useAuthStore } from '../../../store/authStore';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL } from '../../../shared/constants/config';
import type { KycApplication } from '../../../types/models';

interface UseKycPendingScreenResult {
  application: KycApplication | null;
  isLoading: boolean;
  error: string | null;
  handleLogout: () => void;
}

export function useKycPendingScreen(): UseKycPendingScreenResult {
  const logout = useAuthStore((s) => s.logout);

  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.KYC_APPLICATION,
    queryFn: getKycApplication,
    staleTime: CACHE_TTL.USER,
  });

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return {
    application: data ?? null,
    isLoading,
    error: error ? 'Failed to load application status.' : null,
    handleLogout,
  };
}
