import { useCallback } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useOrderDetail, UseOrderDetailResult } from './useOrderDetail';
import { RootStackParamList } from '@/types/navigation';
import { ServiceSubmission } from '@/types/models';

type RouteParams = RouteProp<RootStackParamList, 'OrderDetail'>;

export interface UseOrderDetailScreenResult {
  submission: ServiceSubmission | null;
  isLoading: boolean;
  isError: boolean;
  handleBack: () => void;
}

export function useOrderDetailScreen(): UseOrderDetailScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { submissionId } = route.params;

  const { submission, isLoading, isError }: UseOrderDetailResult =
    useOrderDetail(submissionId);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return { submission, isLoading, isError, handleBack };
}
