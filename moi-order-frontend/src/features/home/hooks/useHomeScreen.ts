import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { logout } from '@/shared/api/auth';
import { useAuthStore } from '@/shared/store/authStore';
import { User } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

export interface UseHomeScreenResult {
  user: User | null;
  handleNavigateToNinetyDayReport: () => void;
  handleNavigateToOtherServices: () => void;
  handleLogout: () => void;
}

export function useHomeScreen(): UseHomeScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, clearAuth } = useAuthStore();

  const handleNavigateToNinetyDayReport = useCallback((): void => {
    navigation.navigate('NinetyDayReport');
  }, [navigation]);

  const handleNavigateToOtherServices = useCallback((): void => {
    navigation.navigate('OtherServices');
  }, [navigation]);

  const handleLogout = useCallback((): void => {
    // Fire-and-forget: revoke token server-side, then clear local state.
    logout().catch(() => {});
    clearAuth();
  }, [clearAuth]);

  return { user, handleNavigateToNinetyDayReport, handleNavigateToOtherServices, handleLogout };
}
