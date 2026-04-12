import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/shared/store/authStore';
import { useOrders, UseOrdersResult } from './useOrders';
import { fetchSubmission } from '@/shared/api/submissions';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { ServiceSubmission } from '@/types/models';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';

export interface UseOrdersScreenResult {
  submissions: ServiceSubmission[];
  isLoading: boolean;
  isError: boolean;
  isLoggedIn: boolean;
  isRefreshing: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  handleEndReached: () => void;
  handleRefresh: () => void;
  handleOrderPress: (submissionId: number) => void;
  handleNavigateToLogin: () => void;
  handleBack: () => void;
}

export function useOrdersScreen(): UseOrdersScreenResult {
  const { isLoggedIn } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();

  // Only fetch when authenticated — avoids a 401 on mount
  const {
    submissions,
    isLoading,
    isError,
    isRefreshing,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  }: UseOrdersResult = useOrders();

  const handleEndReached = useCallback((): void => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback((): void => {
    refetch();
  }, [refetch]);

  const handleOrderPress = useCallback((submissionId: number): void => {
    // Prefetch detail immediately on press — data may be ready before screen mounts
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.SUBMISSIONS.DETAIL(submissionId),
      queryFn:  () => fetchSubmission(submissionId),
      staleTime: CACHE_TTL.USER_DATA,
    });
    navigation.navigate('OrderDetail', { submissionId });
  }, [navigation, queryClient]);

  const handleNavigateToLogin = useCallback((): void => {
    navigation.navigate('Login');
  }, [navigation]);

  const handleBack = useCallback((): void => {
    navigation.navigate('Home');
  }, [navigation]);

  return {
    submissions,
    isLoading:          isLoggedIn && isLoading,
    isError:            isLoggedIn && isError,
    isLoggedIn,
    isRefreshing:       isLoggedIn && isRefreshing,
    hasNextPage,
    isFetchingNextPage,
    handleEndReached,
    handleRefresh,
    handleOrderPress,
    handleNavigateToLogin,
    handleBack,
  };
}
