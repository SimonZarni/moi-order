import { useCallback } from 'react';
import { Linking } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useSafetyLocationDetail } from './useSafetyLocationsData';
import { RootStackParamList } from '@/types/navigation';
import { SafetyLocation } from '@/types/models';

export interface UseSafetyLocationDetailScreenResult {
  location:             SafetyLocation | null;
  isLoading:            boolean;
  isError:              boolean;
  handleBack:           () => void;
  handleCallPress:      () => void;
  handleMapPress:       () => void;
  handleFacebookPress:  () => void;
}

export function useSafetyLocationDetailScreen(): UseSafetyLocationDetailScreenResult {
  const navigation    = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route         = useRoute<RouteProp<RootStackParamList, 'SafetyLocationDetail'>>();
  const { locationId } = route.params;

  const { location, isLoading, isError } = useSafetyLocationDetail(locationId);

  const handleBack = useCallback((): void => { navigation.goBack(); }, [navigation]);

  const handleCallPress = useCallback((): void => {
    if (location?.phone) {
      Linking.openURL(`tel:${location.phone}`).catch(() => {});
    }
  }, [location?.phone]);

  const handleMapPress = useCallback((): void => {
    if (location?.gmap_link) {
      Linking.openURL(location.gmap_link).catch(() => {});
    } else if (location?.latitude != null && location?.longitude != null) {
      Linking.openURL(`https://maps.google.com/?q=${location.latitude},${location.longitude}`).catch(() => {});
    }
  }, [location?.gmap_link, location?.latitude, location?.longitude]);

  const handleFacebookPress = useCallback((): void => {
    if (location?.fb_page_link) {
      Linking.openURL(location.fb_page_link).catch(() => {});
    }
  }, [location?.fb_page_link]);

  return {
    location,
    isLoading,
    isError,
    handleBack,
    handleCallPress,
    handleMapPress,
    handleFacebookPress,
  };
}
