import { useCallback, useMemo } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useOrderDetail } from './useOrderDetail';
import { RootStackParamList } from '@/types/navigation';
import { ServiceSubmission } from '@/types/models';
import { SUBMISSION_STATUS } from '@/types/enums';

type RouteParams = RouteProp<RootStackParamList, 'OrderDetail'>;

export interface UseOrderDetailScreenResult {
  submission: ServiceSubmission | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  canPay: boolean;
  handleRefresh: () => void;
  handleBack: () => void;
  handlePayNow: () => void;
}

export function useOrderDetailScreen(): UseOrderDetailScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { submissionId } = route.params;

  const { submission, isLoading, isRefreshing, isError, refetch } = useOrderDetail(submissionId);

  const canPay = useMemo(
    () => submission?.status === SUBMISSION_STATUS.PendingPayment,
    [submission?.status],
  );

  const handleRefresh = useCallback((): void => { refetch(); }, [refetch]);

  const handleBack = useCallback((): void => { navigation.goBack(); }, [navigation]);

  const handlePayNow = useCallback((): void => {
    navigation.navigate('Payment', { kind: 'submission', submissionId });
  }, [navigation, submissionId]);

  return { submission, isLoading, isRefreshing, isError, canPay, handleRefresh, handleBack, handlePayNow };
}
