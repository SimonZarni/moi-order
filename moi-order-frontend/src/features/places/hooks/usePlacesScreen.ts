import { useState, useCallback, useEffect, useMemo } from 'react';
import { Image } from 'expo-image';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import { usePlaces } from '@/features/places/hooks/usePlaces';
import { usePlacesSearch } from '@/features/places/hooks/usePlacesSearch';
import { useTickets } from '@/features/tickets/hooks/useTickets';
import { fetchPlaceDetail } from '@/shared/api/places';
import { fetchTicket } from '@/shared/api/tickets';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { Category, Place, Ticket, ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

const SEARCH_DEBOUNCE_MS = 300;

export type PlacesTab = 'places' | 'tickets';

export interface UsePlacesScreenResult {
  // Tab
  activeTab: PlacesTab;
  handleTabChange: (tab: PlacesTab) => void;
  // Places data
  filteredPlaces: Place[];
  categories: Category[];
  isPlacesLoading: boolean;
  isPlacesError: boolean;
  isPlacesRefreshing: boolean;
  isPlacesFetchingNextPage: boolean;
  error: ApiError | null;
  query: string;
  selectedCategory: number | null;
  handleQueryChange: (text: string) => void;
  handleCategorySelect: (id: number | null) => void;
  handlePlacesEndReached: () => void;
  handlePlacesRefresh: () => void;
  handlePlacePress: (placeId: number) => void;
  // Tickets data
  filteredTickets: Ticket[];
  ticketsQuery: string;
  isTicketsLoading: boolean;
  isTicketsError: boolean;
  isTicketsRefreshing: boolean;
  isTicketsFetchingNextPage: boolean;
  handleTicketsQueryChange: (text: string) => void;
  handleTicketsEndReached: () => void;
  handleTicketsRefresh: () => void;
  handleTicketPress: (ticketId: number) => void;
  // Common
  handleBack: () => void;
}

export function usePlacesScreen(): UsePlacesScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<PlacesTab>('places');
  const [query, setQuery] = useState('');
  const [ticketsQuery, setTicketsQuery] = useState('');
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const debouncedTicketsQuery = useDebounce(ticketsQuery, SEARCH_DEBOUNCE_MS);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setQuery('');
        setTicketsQuery('');
      };
    }, [])
  );

  const {
    places,
    isLoading: isPlacesLoading,
    isError: isPlacesError,
    isRefreshing: isPlacesRefreshing,
    error,
    hasNextPage: placesHasNextPage,
    isFetchingNextPage: isPlacesFetchingNextPage,
    fetchNextPage: fetchPlacesNextPage,
    refetch: refetchPlaces,
  } = usePlaces(debouncedQuery);

  const {
    selectedCategory,
    filteredPlaces,
    categories,
    handleCategorySelect,
  } = usePlacesSearch(places);

  const {
    tickets,
    isLoading: isTicketsLoading,
    isError: isTicketsError,
    isRefreshing: isTicketsRefreshing,
    hasNextPage: ticketsHasNextPage,
    isFetchingNextPage: isTicketsFetchingNextPage,
    fetchNextPage: fetchTicketsNextPage,
    refetch: refetchTickets,
  } = useTickets();

  const filteredTickets = useMemo((): Ticket[] => {
    if (debouncedTicketsQuery === '') return tickets;
    const q = debouncedTicketsQuery.toLowerCase();
    return tickets.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.province.toLowerCase().includes(q),
    );
  }, [tickets, debouncedTicketsQuery]);

  useEffect(() => {
    filteredPlaces.forEach(p => {
      if (p.cover_image !== null) Image.prefetch(p.cover_image);
    });
  }, [filteredPlaces]);

  useEffect(() => {
    tickets.forEach(t => {
      if (t.cover_image_url !== null) Image.prefetch(t.cover_image_url);
    });
  }, [tickets]);

  const handleTabChange = useCallback((tab: PlacesTab): void => {
    setActiveTab(tab);
  }, []);

  const handleQueryChange = useCallback((text: string): void => {
    setQuery(text);
  }, []);

  const handleTicketsQueryChange = useCallback((text: string): void => {
    setTicketsQuery(text);
  }, []);

  const handlePlacesEndReached = useCallback((): void => {
    if (placesHasNextPage && !isPlacesFetchingNextPage) {
      fetchPlacesNextPage();
    }
  }, [placesHasNextPage, isPlacesFetchingNextPage, fetchPlacesNextPage]);

  const handlePlacesRefresh = useCallback((): void => {
    refetchPlaces();
  }, [refetchPlaces]);

  const handleTicketsEndReached = useCallback((): void => {
    if (ticketsHasNextPage && !isTicketsFetchingNextPage) {
      fetchTicketsNextPage();
    }
  }, [ticketsHasNextPage, isTicketsFetchingNextPage, fetchTicketsNextPage]);

  const handleTicketsRefresh = useCallback((): void => {
    refetchTickets();
  }, [refetchTickets]);

  const handlePlacePress = useCallback(
    (placeId: number): void => {
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.PLACES.DETAIL(placeId),
        queryFn:  () => fetchPlaceDetail(placeId),
        staleTime: CACHE_TTL.USER_DATA,
      });
      navigation.navigate('PlaceDetail', { placeId });
    },
    [navigation, queryClient],
  );

  const handleTicketPress = useCallback(
    (ticketId: number): void => {
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.TICKETS.DETAIL(ticketId),
        queryFn:  () => fetchTicket(ticketId),
        staleTime: CACHE_TTL.USER_DATA,
      });
      navigation.navigate('TicketDetail', { ticketId });
    },
    [navigation, queryClient],
  );

  const handleBack = useCallback((): void => {
    navigation.navigate('Home');
  }, [navigation]);

  return {
    activeTab,
    handleTabChange,
    filteredPlaces,
    categories,
    isPlacesLoading,
    isPlacesError,
    isPlacesRefreshing,
    isPlacesFetchingNextPage,
    error,
    query,
    selectedCategory,
    handleQueryChange,
    handleCategorySelect,
    handlePlacesEndReached,
    handlePlacesRefresh,
    handlePlacePress,
    filteredTickets,
    ticketsQuery,
    isTicketsLoading,
    isTicketsError,
    isTicketsRefreshing,
    isTicketsFetchingNextPage,
    handleTicketsQueryChange,
    handleTicketsEndReached,
    handleTicketsRefresh,
    handleTicketPress,
    handleBack,
  };
}
