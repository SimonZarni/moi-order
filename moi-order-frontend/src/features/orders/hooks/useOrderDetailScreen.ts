import { useCallback } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useOrderDetail } from './useOrderDetail';
import { RootStackParamList } from '@/types/navigation';
import { ServiceSubmission } from '@/types/models';

type RouteParams = RouteProp<RootStackParamList, 'OrderDetail'>;

export interface UseOrderDetailScreenResult {
  submission: ServiceSubmission | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  handleRefresh: () => void;
  handleBack: () => void;
}

export function useOrderDetailScreen(): UseOrderDetailScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { submissionId } = route.params;

  const { submission, isLoading, isRefreshing, isError, refetch } = useOrderDetail(submissionId);

  const handleRefresh = useCallback((): void => { refetch(); }, [refetch]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return { submission, isLoading, isRefreshing, isError, handleRefresh, handleBack };
}
