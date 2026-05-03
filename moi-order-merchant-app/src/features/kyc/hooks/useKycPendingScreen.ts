import { useCallback, useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { getKycApplication } from '../../../api/kyc';
import { getMe } from '../../../api/auth';
import { useAuthStore } from '../../../store/authStore';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { KYC_STATUS } from '../../../types/enums';
import type { KycStackParamList } from '../../../types/navigation';
import type { KycApplication } from '../../../types/models';

const SUPPORT_EMAIL = 'support@moiorder.app';
const POLL_INTERVAL_MS = 30_000;

interface UseKycPendingScreenResult {
  application: KycApplication | null;
  isLoading: boolean;
  error: string | null;
  handleLogout: () => void;
  handleResubmit: () => void;
  handleContactSupport: () => void;
}

type Nav = NativeStackNavigationProp<KycStackParamList, 'KycPending'>;

export function useKycPendingScreen(): UseKycPendingScreenResult {
  const navigation = useNavigation<Nav>();
  const logout = useAuthStore((s) => s.logout);
  const setUser = useAuthStore((s) => s.setUser);

  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.KYC_APPLICATION,
    queryFn: getKycApplication,
    refetchInterval: POLL_INTERVAL_MS,
  });

  // When the admin approves the application, refresh the user object so
  // AppNavigator detects is_merchant=true and switches to MerchantTabsNavigator.
  useEffect(() => {
    if (data?.status === KYC_STATUS.Approved) {
      getMe().then(setUser).catch(() => {});
    }
  }, [data?.status, setUser]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  // Navigate back to the wizard; getOrCreateApplication on the backend creates
  // a fresh draft because the Rejected application is excluded by status filter.
  const handleResubmit = useCallback(() => {
    navigation.navigate('KycWizard');
  }, [navigation]);

  const handleContactSupport = useCallback(() => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {});
  }, []);

  return {
    application: data ?? null,
    isLoading,
    error: error ? 'Failed to load application status.' : null,
    handleLogout,
    handleResubmit,
    handleContactSupport,
  };
}
