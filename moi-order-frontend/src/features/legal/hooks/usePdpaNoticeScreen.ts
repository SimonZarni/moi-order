import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/types/navigation';

export interface UsePdpaNoticeScreenResult {
  handleBack: () => void;
}

export function usePdpaNoticeScreen(): UsePdpaNoticeScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return { handleBack };
}
