import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import { usePlaces } from '@/features/places/hooks/usePlaces';
import { usePlacesSearch } from '@/features/places/hooks/usePlacesSearch';
import { fetchPlaceDetail } from '@/shared/api/places';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { Category, Place, ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

const SEARCH_DEBOUNCE_MS = 300;

export interface UsePlacesScreenResult {
  // Data
  filteredPlaces: Place[];
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  error: ApiError | null;
  isFetchingNextPage: boolean;
  // Search / filter state
  query: string;
  selectedCategory: number | null;
  // Handlers
  handleQueryChange: (text: string) => void;
  handleCategorySelect: (id: number | null) => void;
  handleEndReached: () => void;
  handleRefresh: () => void;
  handlePlacePress: (placeId: number) => void;
  handleBack: () => void;
}

export function usePlacesScreen(): UsePlacesScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setQuery('');
      };
    }, [])
  );

  const {
    places,
    isLoading,
    isError,
    isRefreshing,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = usePlaces(debouncedQuery);

  const {
    selectedCategory,
    filteredPlaces,
    categories,
    handleCategorySelect,
  } = usePlacesSearch(places);

  const handleQueryChange = useCallback((text: string): void => {
    setQuery(text);
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePlacePress = useCallback(
    (placeId: number) => {
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.PLACES.DETAIL(placeId),
        queryFn:  () => fetchPlaceDetail(placeId),
        staleTime: CACHE_TTL.USER_DATA,
      });
      navigation.navigate('PlaceDetail', { placeId });
    },
    [navigation, queryClient],
  );

  const handleBack = useCallback((): void => {
    navigation.navigate('Home');
  }, [navigation]);

  return {
    filteredPlaces,
    categories,
    isLoading,
    isError,
    isRefreshing,
    error,
    isFetchingNextPage,
    query,
    selectedCategory,
    handleQueryChange,
    handleCategorySelect,
    handleEndReached,
    handleRefresh,
    handlePlacePress,
    handleBack,
  };
}
