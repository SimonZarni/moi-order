import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { logout } from '@/shared/api/auth';
import { unregisterDeviceToken } from '@/shared/api/deviceTokens';
import { useAirportFastTrackCard } from '@/features/airportFastTrack/hooks/useAirportFastTrackCard';
import { useAuthStore } from '@/shared/store/authStore';
import { useNotificationStore } from '@/shared/store/notificationStore';
import { HomeCard, User } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

import { useHomeCards } from './useHomeCards';

export interface UseHomeScreenResult {
  user: User | null;
  isLoggedIn: boolean;
  isRefreshing: boolean;
  cards: HomeCard[];
  isLoadingCards: boolean;
  airportServiceTypeId: number | null;
  airportPrice: number | null;
  handleRefresh: () => void;
  handleNavigateToNotifications: () => void;
  handleNavigateToLogin: () => void;
  handleLogout: () => void;
  handleNavigateToSearch: () => void;
}

export function useHomeScreen(): UseHomeScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isLoggedIn, clearAuth } = useAuthStore();
  const {
    serviceTypeId: airportServiceTypeId,
    price:         airportPrice,
    isRefreshing,
    refetch,
  } = useAirportFastTrackCard();

  const { cards, isLoading: isLoadingCards, refetch: refetchCards } = useHomeCards();

  const handleRefresh = useCallback((): void => {
    refetch();
    refetchCards();
  }, [refetch, refetchCards]);

  const resetUnread = useNotificationStore((state) => state.resetUnread);
  const pushToken   = useNotificationStore((state) => state.pushToken);

  const handleNavigateToNotifications = useCallback((): void => {
    navigation.navigate('Notifications');
  }, [navigation]);

  const handleNavigateToLogin = useCallback((): void => {
    navigation.navigate('Login');
  }, [navigation]);

  const handleLogout = useCallback((): void => {
    if (pushToken !== null) {
      unregisterDeviceToken(pushToken).catch(() => {});
    }
    logout().catch(() => {});
    clearAuth();
    resetUnread();
  }, [clearAuth, resetUnread, pushToken]);

  const handleNavigateToSearch = useCallback((): void => {
    navigation.navigate('Search');
  }, [navigation]);

  return {
    user,
    isLoggedIn,
    isRefreshing,
    cards,
    isLoadingCards,
    airportServiceTypeId,
    airportPrice,
    handleRefresh,
    handleNavigateToNotifications,
    handleNavigateToLogin,
    handleLogout,
    handleNavigateToSearch,
  };
}
