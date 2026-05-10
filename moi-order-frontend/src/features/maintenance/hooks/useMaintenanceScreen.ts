import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/types/navigation';
import { checkHealth } from '@/shared/api/health';

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
    try {
      await checkHealth();
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch {
      // Still in maintenance or network error — stay on this screen
    } finally {
      setIsChecking(false);
    }
  }, [isChecking, navigation]);

  return { message, details, secondsLeft, isChecking, handleRetry };
}
