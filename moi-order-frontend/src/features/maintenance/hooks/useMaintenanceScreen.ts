import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

import { RootStackParamList } from '@/types/navigation';
import { checkHealth } from '@/shared/api/health';
import { fetchMe } from '@/shared/api/auth';
import { useAuthStore } from '@/shared/store/authStore';
import { TOKEN_KEY } from '@/shared/constants/config';
import { beginMaintenanceRecovery, endMaintenanceRecovery } from '@/shared/maintenance/maintenanceState';

type MaintenanceRoute = RouteProp<RootStackParamList, 'Maintenance'>;

export interface UseMaintenanceScreenResult {
  message:        string;
  details:        string;
  secondsLeft:    number | null;
  isChecking:     boolean;
  handleRetry:    () => Promise<void>;
}

export function useMaintenanceScreen(): UseMaintenanceScreenResult {
  const navigation                    = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { message, details, retryAfter } = useRoute<MaintenanceRoute>().params;
  const queryClient                   = useQueryClient();
  const { isLoggedIn, setUser }       = useAuthStore();

  const [isChecking, setIsChecking]   = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(retryAfter ?? null);
  const intervalRef                   = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!retryAfter) return;
    setSecondsLeft(retryAfter);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [retryAfter]);

  const handleRetry = useCallback(async (): Promise<void> => {
    if (isChecking) return;
    setIsChecking(true);
    const recoveryEpoch = beginMaintenanceRecovery();
    try {
      await checkHealth();

      // If the app launched while the server was in maintenance, App.tsx's
      // restoreSession() threw before setUser() was called, leaving authStore
      // uninitialized (isLoggedIn=false, user=null) even though the token is
      // still in memory. Re-run the session restore now that the server is up.
      if (!isLoggedIn) {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token !== null) {
          try {
            const user = await fetchMe();
            setUser(user, token);
          } catch {
            // Token invalid or expired — the 401 interceptor already cleared it.
          }
        }
      }

      // Wipe the query cache so any screens that failed with 503 during
      // maintenance don't stay frozen in error state — they'll refetch on mount.
      await queryClient.cancelQueries();
      queryClient.clear();

      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch {
      // Still in maintenance or network error — stay on this screen
    } finally {
      endMaintenanceRecovery(recoveryEpoch);
      setIsChecking(false);
    }
  }, [isChecking, navigation, queryClient, isLoggedIn, setUser]);

  return { message, details, secondsLeft, isChecking, handleRetry };
}
