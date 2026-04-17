import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/types/navigation';

export interface UseTermsScreenResult {
  handleBack: () => void;
}

export function useTermsScreen(): UseTermsScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return { handleBack };
}
