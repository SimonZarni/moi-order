import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList } from 'react-native';
import { Image } from 'expo-image';
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
import { useState } from 'react';

const SEARCH_DEBOUNCE_MS = 300;

export interface UsePlacesScreenResult {
  placesListRef: React.RefObject<FlatList<Place>>;
  filteredPlaces: Place[];
  categories: Category[];
  isPlacesLoading: boolean;
  isPlacesError: boolean;
  isPlacesRefreshing: boolean;
  isPlacesFetchingNextPage: boolean;
  error: ApiError | null;
  query: string;
  selectedCategory: number | null;
  selectedCategoryLabel: string;
  isCategoryModalOpen: boolean;
  handleQueryChange: (text: string) => void;
  handleCategorySelectAndClose: (id: number | null) => void;
  handleCategoryModalOpen: () => void;
  handleCategoryModalClose: () => void;
  handlePlacesEndReached: () => void;
  handlePlacesRefresh: () => void;
  handlePlacePress: (placeId: number) => void;
  handleBack: () => void;
}

export function usePlacesScreen(): UsePlacesScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();

  const placesListRef = useRef<FlatList<Place>>(null);

  const [query, setQuery] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);

  useFocusEffect(
    useCallback(() => {
      placesListRef.current?.scrollToOffset({ offset: 0, animated: false });

      return () => {
        setQuery('');
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

  useEffect(() => {
    filteredPlaces.forEach(p => {
      if (p.cover_image !== null) Image.prefetch(p.cover_image);
    });
  }, [filteredPlaces]);

  const selectedCategoryLabel = useMemo(
    () => categories.find(c => c.id === selectedCategory)?.name_en ?? 'All',
    [categories, selectedCategory],
  );

  const handleQueryChange = useCallback((text: string): void => {
    setQuery(text);
  }, []);

  const handleCategoryModalOpen = useCallback((): void => {
    setIsCategoryModalOpen(true);
  }, []);

  const handleCategoryModalClose = useCallback((): void => {
    setIsCategoryModalOpen(false);
  }, []);

  const handleCategorySelectAndClose = useCallback((id: number | null): void => {
    handleCategorySelect(id);
    setIsCategoryModalOpen(false);
  }, [handleCategorySelect]);

  const handlePlacesEndReached = useCallback((): void => {
    if (placesHasNextPage && !isPlacesFetchingNextPage) {
      fetchPlacesNextPage();
    }
  }, [placesHasNextPage, isPlacesFetchingNextPage, fetchPlacesNextPage]);

  const handlePlacesRefresh = useCallback((): void => {
    refetchPlaces();
  }, [refetchPlaces]);

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

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return {
    placesListRef,
    filteredPlaces,
    categories,
    isPlacesLoading,
    isPlacesError,
    isPlacesRefreshing,
    isPlacesFetchingNextPage,
    error,
    query,
    selectedCategory,
    selectedCategoryLabel,
    isCategoryModalOpen,
    handleQueryChange,
    handleCategorySelectAndClose,
    handleCategoryModalOpen,
    handleCategoryModalClose,
    handlePlacesEndReached,
    handlePlacesRefresh,
    handlePlacePress,
    handleBack,
  };
}
