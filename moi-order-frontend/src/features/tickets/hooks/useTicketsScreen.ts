import { useCallback, useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import { useTickets } from './useTickets';
import { fetchTicket } from '@/shared/api/tickets';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { RootStackParamList } from '@/types/navigation';
import { Ticket } from '@/types/models';

export interface UseTicketsScreenResult {
  tickets: Ticket[];
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  isFetchingNextPage: boolean;
  searchQuery: string;
  handleSearchChange: (text: string) => void;
  handleEndReached: () => void;
  handleRefresh: () => void;
  handleTicketPress: (id: number) => void;
  handleBack: () => void;
}

export function useTicketsScreen(): UseTicketsScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const {
    tickets, isLoading, isError, isRefreshing,
    hasNextPage, isFetchingNextPage, fetchNextPage, refetch,
  } = useTickets(debouncedSearch);

  useEffect(() => {
    tickets.forEach(t => {
      if (t.cover_image_url !== null) Image.prefetch(t.cover_image_url);
    });
  }, [tickets]);

  const handleEndReached = useCallback((): void => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback((): void => { refetch(); }, [refetch]);

  const handleTicketPress = useCallback((id: number): void => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.TICKETS.DETAIL(id),
      queryFn:  () => fetchTicket(id),
      staleTime: CACHE_TTL.USER_DATA,
    });
    navigation.navigate('TicketDetail', { ticketId: id });
  }, [navigation, queryClient]);

  const handleBack = useCallback((): void => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Home' });
    }
  }, [navigation]);

  const handleSearchChange = useCallback((text: string): void => {
    setSearchQuery(text);
  }, []);

  return {
    tickets, isLoading, isError, isRefreshing, isFetchingNextPage,
    searchQuery, handleSearchChange,
    handleEndReached, handleRefresh, handleTicketPress, handleBack,
  };
}
