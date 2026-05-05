import { RouteProp, useRoute } from '@react-navigation/native';

import { useEmailOtpAuth, UseEmailOtpAuthResult } from '@/features/auth/hooks/useEmailOtpAuth';
import { RootStackParamList } from '@/types/navigation';

type EmailOtpRouteProp = RouteProp<RootStackParamList, 'EmailOtp'>;

export interface UseEmailOtpScreenResult extends Omit<UseEmailOtpAuthResult, 'bannerError'> {
  purpose: 'login' | 'register';
  bannerError: string;
}

export function useEmailOtpScreen(): UseEmailOtpScreenResult {
  const route = useRoute<EmailOtpRouteProp>();
  const { purpose } = route.params;
  const auth = useEmailOtpAuth({ purpose });

  return { ...auth, purpose, bannerError: auth.bannerError ?? '' };
}
