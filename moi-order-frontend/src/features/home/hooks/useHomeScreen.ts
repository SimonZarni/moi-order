import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { logout } from '@/shared/api/auth';
import { unregisterDeviceToken } from '@/shared/api/deviceTokens';
import { useAirportFastTrackCard } from '@/features/airportFastTrack/hooks/useAirportFastTrackCard';
import { useAuthStore } from '@/shared/store/authStore';
import { useNotificationStore } from '@/shared/store/notificationStore';
import { User } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

export interface UseHomeScreenResult {
  user: User | null;
  isLoggedIn: boolean;
  isRefreshing: boolean;
  handleRefresh: () => void;
  handleNavigateToNinetyDayReport: () => void;
  handleNavigateToPlaces: () => void;
  handleNavigateToOtherServices: () => void;
  handleNavigateToEmbassyServices: () => void;
  handleNavigateToAirportFastTrack: () => void;
  handleNavigateToNotifications: () => void;
  handleNavigateToLogin: () => void;
  handleLogout: () => void;
}

export function useHomeScreen(): UseHomeScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isLoggedIn, clearAuth } = useAuthStore();
  const {
    serviceTypeId: airportServiceTypeId,
    price:         airportPrice,
    isReady:       airportReady,
    isRefreshing,
    refetch,
  } = useAirportFastTrackCard();

  const handleRefresh = useCallback((): void => { refetch(); }, [refetch]);
  const resetUnread  = useNotificationStore((state) => state.resetUnread);
  const pushToken    = useNotificationStore((state) => state.pushToken);

  const handleNavigateToNinetyDayReport = useCallback((): void => {
    navigation.navigate('NinetyDayReport');
  }, [navigation]);

  const handleNavigateToPlaces = useCallback((): void => {
    navigation.navigate('Places');
  }, [navigation]);

  const handleNavigateToOtherServices = useCallback((): void => {
    navigation.navigate('OtherServices');
  }, [navigation]);

  const handleNavigateToEmbassyServices = useCallback((): void => {
    navigation.navigate('EmbassyServices');
  }, [navigation]);

  const handleNavigateToAirportFastTrack = useCallback((): void => {
    if (!airportReady || airportServiceTypeId === null || airportPrice === null) return;
    navigation.navigate('AirportFastTrackForm', {
      serviceTypeId: airportServiceTypeId,
      price:         airportPrice,
    });
  }, [navigation, airportReady, airportServiceTypeId, airportPrice]);

  const handleNavigateToNotifications = useCallback((): void => {
    navigation.navigate('Notifications');
  }, [navigation]);

  const handleNavigateToLogin = useCallback((): void => {
    navigation.navigate('Login');
  }, [navigation]);

  const handleLogout = useCallback((): void => {
    // Unregister push token before clearing auth so the API call still has a valid token.
    if (pushToken !== null) {
      unregisterDeviceToken(pushToken).catch(() => {});
    }
    logout().catch(() => {});
    clearAuth();
    resetUnread();
  }, [clearAuth, resetUnread, pushToken]);

  return {
    user,
    isLoggedIn,
    isRefreshing,
    handleRefresh,
    handleNavigateToNinetyDayReport,
    handleNavigateToPlaces,
    handleNavigateToOtherServices,
    handleNavigateToEmbassyServices,
    handleNavigateToAirportFastTrack,
    handleNavigateToNotifications,
    handleNavigateToLogin,
    handleLogout,
  };
}
