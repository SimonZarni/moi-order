import { useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { logout } from '@/shared/api/auth';
import { unregisterDeviceToken } from '@/shared/api/deviceTokens';
import { useAirportFastTrackCard } from '@/features/airportFastTrack/hooks/useAirportFastTrackCard';
import { useAuthStore } from '@/shared/store/authStore';
import { useNotificationStore } from '@/shared/store/notificationStore';
import { HomeCard, User } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

import { useFoodOrdersData } from '@/features/food/hooks/useFoodOrdersData';
import { FOOD_ORDER_STATUS } from '@/types/enums';
import { useHomeCards } from './useHomeCards';

export interface UseHomeScreenResult {
  user: User | null;
  isLoggedIn: boolean;
  isRefreshing: boolean;
  cards: HomeCard[];
  isLoadingCards: boolean;
  activeOrderCount: number;
  airportServiceTypeId: number | null;
  airportServiceId: number | null;
  airportServiceName: string | null;
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
    serviceId:     airportServiceId,
    serviceName:   airportServiceName,
    price:         airportPrice,
    isRefreshing,
    refetch,
  } = useAirportFastTrackCard();

  const { cards, isLoading: isLoadingCards, refetch: refetchCards } = useHomeCards();
  const { orders } = useFoodOrdersData();
  const activeOrderCount = useMemo(
    () => orders.filter((o) =>
      o.status !== FOOD_ORDER_STATUS.Completed &&
      o.status !== FOOD_ORDER_STATUS.Cancelled  &&
      o.status !== FOOD_ORDER_STATUS.Expired,
    ).length,
    [orders],
  );

  const handleRefresh = useCallback((): void => {
    refetch();
    refetchCards();
  }, [refetch, refetchCards]);

  const resetUnread  = useNotificationStore((state) => state.resetUnread);
  const pushToken    = useNotificationStore((state) => state.pushToken);
  const queryClient  = useQueryClient();

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
    resetUnread();
    queryClient.clear();
    clearAuth();
  }, [clearAuth, resetUnread, queryClient, pushToken]);

  const handleNavigateToSearch = useCallback((): void => {
    navigation.navigate('Search');
  }, [navigation]);

  return {
    user,
    isLoggedIn,
    isRefreshing,
    cards,
    isLoadingCards,
    activeOrderCount,
    airportServiceTypeId,
    airportServiceId,
    airportServiceName,
    airportPrice,
    handleRefresh,
    handleNavigateToNotifications,
    handleNavigateToLogin,
    handleLogout,
    handleNavigateToSearch,
  };
}
