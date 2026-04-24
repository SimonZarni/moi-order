import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { logout } from '@/shared/api/auth';
import { useAuthStore } from '@/shared/store/authStore';
import { useNotificationStore } from '@/shared/store/notificationStore';
import { User } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

export interface UseHomeScreenResult {
  user: User | null;
  isLoggedIn: boolean;
  handleNavigateToNinetyDayReport: () => void;
  handleNavigateToTickets: () => void;
  handleNavigateToPlaces: () => void;
  handleNavigateToOtherServices: () => void;
  handleNavigateToNotifications: () => void;
  handleNavigateToLogin: () => void;
  handleLogout: () => void;
}

export function useHomeScreen(): UseHomeScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isLoggedIn, clearAuth } = useAuthStore();
  const resetUnread = useNotificationStore((state) => state.resetUnread);

  const handleNavigateToNinetyDayReport = useCallback((): void => {
    navigation.navigate('NinetyDayReport');
  }, [navigation]);

  const handleNavigateToTickets = useCallback((): void => {
    navigation.navigate('Tickets');
  }, [navigation]);

  const handleNavigateToPlaces = useCallback((): void => {
    navigation.navigate('Places');
  }, [navigation]);

  const handleNavigateToOtherServices = useCallback((): void => {
    navigation.navigate('OtherServices');
  }, [navigation]);

  const handleNavigateToNotifications = useCallback((): void => {
    navigation.navigate('Notifications');
  }, [navigation]);

  const handleNavigateToLogin = useCallback((): void => {
    navigation.navigate('Login');
  }, [navigation]);

  const handleLogout = useCallback((): void => {
    logout().catch(() => {});
    clearAuth();
    resetUnread();
  }, [clearAuth, resetUnread]);

  return {
    user,
    isLoggedIn,
    handleNavigateToNinetyDayReport,
    handleNavigateToTickets,
    handleNavigateToPlaces,
    handleNavigateToOtherServices,
    handleNavigateToNotifications,
    handleNavigateToLogin,
    handleLogout,
  };
}
