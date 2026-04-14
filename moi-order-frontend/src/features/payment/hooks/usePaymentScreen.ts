import { useCallback } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { usePayment } from './usePayment';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { SUBMISSION_STATUS } from '@/types/enums';
import { ApiError, Payment, ServiceSubmission } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

type RouteParams = RouteProp<RootStackParamList, 'Payment'>;

export interface UsePaymentScreenResult {
  payment: Payment | undefined;
  submission: ServiceSubmission | undefined;
  isCreating: boolean;
  isLoadingSubmission: boolean;
  createError: ApiError | null;
  isPaid: boolean;
  isPaymentFailed: boolean;
  handleBack: () => void;
  handleGoToOrders: () => void;
}

/**
 * Principle: SRP — coordinator for PaymentScreen; composes usePayment + navigation.
 * Shows success state inline once payment is confirmed; user navigates to Orders manually.
 */
export function usePaymentScreen(): UsePaymentScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route      = useRoute<RouteParams>();
  const { submissionId } = route.params;
  const queryClient = useQueryClient();

  const {
    payment,
    submission,
    isCreating,
    isLoadingSubmission,
    createError,
  } = usePayment(submissionId);

  const isPaid          = submission?.status === SUBMISSION_STATUS.Processing
                       || submission?.status === SUBMISSION_STATUS.Completed;
  const isPaymentFailed = submission?.status === SUBMISSION_STATUS.PaymentFailed;

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  const handleGoToOrders = useCallback((): void => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBMISSIONS.LIST });
    navigation.navigate('Orders');
  }, [navigation, queryClient]);

  return {
    payment,
    submission,
    isCreating,
    isLoadingSubmission,
    createError,
    isPaid,
    isPaymentFailed,
    handleBack,
    handleGoToOrders,
  };
}
