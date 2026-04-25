/**
 * Principle: SRP — owns the Expo push notification lifecycle exclusively.
 *   Separate from usePusherNotifications (real-time in-app badge) — each hook owns one concern.
 * Principle: Security — token stored only in notificationStore + backend DB; never in SecureStore
 *   (push tokens are not secrets — they are opaque identifiers, not credentials).
 *
 * Duplicate push prevention:
 *   1. registerDeviceToken() calls POST /api/v1/device-tokens which uses updateOrCreate —
 *      same device re-registering on every login produces one row, not many.
 *   2. The unique DB constraint on device_tokens.token is the hard guard.
 *   3. setNotificationHandler is set once at module load, not per-mount.
 */
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { registerDeviceToken } from '@/shared/api/deviceTokens';
import { EXPO_PROJECT_ID } from '@/shared/constants/config';
import { useAuthStore } from '@/shared/store/authStore';
import { useNotificationStore } from '@/shared/store/notificationStore';
import { RootStackParamList } from '@/types/navigation';

// Set at module load so the handler is ready before the first notification arrives.
// shouldSetBadge: false — badge count is managed by Zustand + Pusher, not OS badge API.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface PushNotificationData {
  notification_type?: string;
  submission_id?: number;
  ticket_order_id?: number;
}

export function usePushNotifications(): void {
  const userId      = useAuthStore((state) => state.user?.id ?? null);
  const setPushToken = useNotificationStore((state) => state.setPushToken);
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const responseListenerRef = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    if (userId === null) return;

    registerForPush();

    // Handle notification tap from all states: foreground, background, and killed.
    responseListenerRef.current = Notifications.addNotificationResponseReceivedListener(
      (response) => handleNotificationTap(response),
    );

    // Handle tap from killed state — getLastNotificationResponseAsync fires once on mount
    // for notifications tapped while the app was terminated.
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response !== null) {
        handleNotificationTap(response);
      }
    });

    return () => {
      responseListenerRef.current?.remove();
      responseListenerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function registerForPush(): Promise<void> {
    // Push tokens only work on physical devices — skip on Expo Go simulator.
    if (!Device.isDevice) return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return;

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId: EXPO_PROJECT_ID });
      const token     = tokenData.data;
      const platform  = Platform.OS === 'ios' ? 'ios' : 'android';

      setPushToken(token);
      // Fire-and-forget — push registration failure is non-critical.
      registerDeviceToken(token, platform).catch(() => {});
    } catch {
      // Silently ignore — in-app notifications via Pusher still work.
    }
  }

  function handleNotificationTap(response: Notifications.NotificationResponse): void {
    const data = response.notification.request.content.data as PushNotificationData;

    if (data.notification_type === 'submission_status' && data.submission_id !== undefined) {
      navigation.navigate('OrderDetail', { submissionId: data.submission_id });
    } else if (data.notification_type === 'ticket_order_status' && data.ticket_order_id !== undefined) {
      navigation.navigate('TicketOrderDetail', { ticketOrderId: data.ticket_order_id });
    }
  }
}
