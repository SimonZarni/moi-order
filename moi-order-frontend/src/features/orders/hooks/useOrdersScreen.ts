import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/shared/store/authStore';
import { useOrders, UseOrdersResult } from './useOrders';
import { useTicketOrders, UseTicketOrdersResult } from './useTicketOrders';
import { fetchSubmission } from '@/shared/api/submissions';
import { fetchTicketOrder } from '@/shared/api/ticketOrders';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { ServiceSubmission, TicketOrder } from '@/types/models';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';

export type OrdersTab = 'services' | 'tickets';

export interface UseOrdersScreenResult {
  activeTab: OrdersTab;
  submissions: ServiceSubmission[];
  ticketOrders: TicketOrder[];
  isLoading: boolean;
  isError: boolean;
  isLoggedIn: boolean;
  isRefreshing: boolean;
  isFetchingNextPage: boolean;
  handleTabChange: (tab: OrdersTab) => void;
  handleEndReached: () => void;
  handleRefresh: () => void;
  handleOrderPress: (submissionId: number) => void;
  handleTicketOrderPress: (ticketOrderId: number) => void;
  handleNavigateToLogin: () => void;
  handleBack: () => void;
}

export function useOrdersScreen(): UseOrdersScreenResult {
  const { isLoggedIn } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<OrdersTab>('services');

  const {
    submissions, isLoading: isLoadingSubmissions, isError: isErrorSubmissions,
    isRefreshing: isRefreshingSubmissions, hasNextPage: hasNextSubmissions,
    isFetchingNextPage: isFetchingNextSubmissions, fetchNextPage: fetchNextSubmissions,
    refetch: refetchSubmissions,
  }: UseOrdersResult = useOrders();

  const {
    ticketOrders, isLoading: isLoadingTickets, isError: isErrorTickets,
    isRefreshing: isRefreshingTickets, hasNextPage: hasNextTickets,
    isFetchingNextPage: isFetchingNextTickets, fetchNextPage: fetchNextTickets,
    refetch: refetchTickets,
  }: UseTicketOrdersResult = useTicketOrders();

  const isLoading = activeTab === 'services' ? isLoadingSubmissions : isLoadingTickets;
  const isError   = activeTab === 'services' ? isErrorSubmissions   : isErrorTickets;
  const isRefreshing     = activeTab === 'services' ? isRefreshingSubmissions   : isRefreshingTickets;
  const isFetchingNextPage = activeTab === 'services' ? isFetchingNextSubmissions : isFetchingNextTickets;
  const hasNextPage        = activeTab === 'services' ? hasNextSubmissions        : hasNextTickets;

  const handleTabChange = useCallback((tab: OrdersTab): void => {
    setActiveTab(tab);
  }, []);

  const handleEndReached = useCallback((): void => {
    if (!isFetchingNextPage) {
      if (activeTab === 'services' && hasNextPage) fetchNextSubmissions();
      if (activeTab === 'tickets'  && hasNextPage) fetchNextTickets();
    }
  }, [activeTab, hasNextPage, isFetchingNextPage, fetchNextSubmissions, fetchNextTickets]);

  const handleRefresh = useCallback((): void => {
    if (activeTab === 'services') refetchSubmissions();
    else refetchTickets();
  }, [activeTab, refetchSubmissions, refetchTickets]);

  const handleOrderPress = useCallback((submissionId: number): void => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.SUBMISSIONS.DETAIL(submissionId),
      queryFn:  () => fetchSubmission(submissionId),
      staleTime: CACHE_TTL.USER_DATA,
    });
    navigation.navigate('OrderDetail', { submissionId });
  }, [navigation, queryClient]);

  const handleTicketOrderPress = useCallback((ticketOrderId: number): void => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.TICKET_ORDERS.DETAIL(ticketOrderId),
      queryFn:  () => fetchTicketOrder(ticketOrderId),
      staleTime: CACHE_TTL.USER_DATA,
    });
    navigation.navigate('TicketOrderDetail', { ticketOrderId });
  }, [navigation, queryClient]);

  const handleNavigateToLogin = useCallback((): void => {
    navigation.navigate('Login');
  }, [navigation]);

  const handleBack = useCallback((): void => {
    navigation.navigate('Home');
  }, [navigation]);

  return {
    activeTab,
    submissions,
    ticketOrders,
    isLoading:          isLoggedIn && isLoading,
    isError:            isLoggedIn && isError,
    isLoggedIn,
    isRefreshing:       isLoggedIn && isRefreshing,
    isFetchingNextPage,
    handleTabChange,
    handleEndReached,
    handleRefresh,
    handleOrderPress,
    handleTicketOrderPress,
    handleNavigateToLogin,
    handleBack,
  };
}
