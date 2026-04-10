import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import { usePlaces } from '@/features/places/hooks/usePlaces';
import { fetchPlaceDetail } from '@/shared/api/places';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { Place } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { ApiError } from '@/types/models';

export interface UsePlacesScreenResult {
  places: Place[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  handleEndReached: () => void;
  handleRefresh: () => void;
  handlePlacePress: (placeId: number) => void;
  handleBack: () => void;
}

export function usePlacesScreen(): UsePlacesScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const {
    places,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = usePlaces();

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
      // Prefetch detail immediately on press — data may be ready before screen mounts
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
    places,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    handleEndReached,
    handleRefresh,
    handlePlacePress,
    handleBack,
  };
}
