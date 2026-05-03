import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/types/navigation';
import { VerificationStatus } from '@/types/models';
import { useVerificationStatus } from './useVerificationStatus';

export interface UseMoiVerifiedScreenResult {
  status: VerificationStatus | undefined;
  isLoading: boolean;
  handleBack: () => void;
}

export function useMoiVerifiedScreen(): UseMoiVerifiedScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { status, isLoading } = useVerificationStatus();

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return { status, isLoading, handleBack };
}
