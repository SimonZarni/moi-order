import { useCallback } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useSafetyLocations } from './useSafetyLocationsData';
import { RootStackParamList } from '@/types/navigation';
import { SafetyLocation } from '@/types/models';

export interface UseSafetyLocationListScreenResult {
  locations:          SafetyLocation[];
  category:           string;
  isLoading:          boolean;
  isError:            boolean;
  isRefreshing:       boolean;
  hasNextPage:        boolean;
  isFetchingNextPage: boolean;
  handleEndReached:   () => void;
  handleRefresh:      () => void;
  handleLocationPress: (location: SafetyLocation) => void;
  handleBack:         () => void;
}

export function useSafetyLocationListScreen(): UseSafetyLocationListScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route      = useRoute<RouteProp<RootStackParamList, 'SafetyLocationList'>>();
  const { category } = route.params;

  const {
    locations, isLoading, isError, isRefreshing,
    hasNextPage, isFetchingNextPage, fetchNextPage, refetch,
  } = useSafetyLocations(category);

  const handleEndReached = useCallback((): void => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback((): void => { refetch(); }, [refetch]);

  const handleLocationPress = useCallback((location: SafetyLocation): void => {
    navigation.navigate('SafetyLocationDetail', { locationId: location.id });
  }, [navigation]);

  const handleBack = useCallback((): void => { navigation.goBack(); }, [navigation]);

  return {
    locations,
    category,
    isLoading,
    isError,
    isRefreshing,
    hasNextPage,
    isFetchingNextPage,
    handleEndReached,
    handleRefresh,
    handleLocationPress,
    handleBack,
  };
}
