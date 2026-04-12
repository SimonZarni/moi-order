import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import { usePlaces } from '@/features/places/hooks/usePlaces';
import { usePlacesSearch } from '@/features/places/hooks/usePlacesSearch';
import { useUserLocation } from '@/shared/hooks/useUserLocation';
import { fetchPlaceDetail } from '@/shared/api/places';
import { formatDistance } from '@/shared/utils/formatDistance';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { Category, Place, ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

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
  // Location
  getPlaceDistance: (place: Place) => string | null;
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
  const { userCoords } = useUserLocation();

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
  } = usePlaces();

  const {
    query,
    selectedCategory,
    filteredPlaces,
    categories,
    handleQueryChange,
    handleCategorySelect,
  } = usePlacesSearch(places);

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

  const getPlaceDistance = useCallback(
    (place: Place): string | null => {
      if (userCoords === null || place.latitude === null || place.longitude === null) {
        return null;
      }
      return formatDistance(userCoords.latitude, userCoords.longitude, place.latitude, place.longitude);
    },
    [userCoords],
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
    getPlaceDistance,
    handleQueryChange,
    handleCategorySelect,
    handleEndReached,
    handleRefresh,
    handlePlacePress,
    handleBack,
  };
}
