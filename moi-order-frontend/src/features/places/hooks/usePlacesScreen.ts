import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { usePlaces } from '@/features/places/hooks/usePlaces';
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
}

export function usePlacesScreen(): UsePlacesScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
      navigation.navigate('PlaceDetail', { placeId });
    },
    [navigation],
  );

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
  };
}
