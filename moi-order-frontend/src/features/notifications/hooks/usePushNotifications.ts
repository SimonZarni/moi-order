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
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { registerDeviceToken } from '@/shared/api/deviceTokens';
import { useAuthStore } from '@/shared/store/authStore';
import { useNotificationStore } from '@/shared/store/notificationStore';
import { RootStackParamList } from '@/types/navigation';

// Expo Go (SDK 53+) removed remote push support. Skip registration entirely when
// running inside Expo Go — in-app notifications via Pusher still work normally.
const IS_EXPO_GO = Constants.appOwnership === 'expo';

if (Constants.appOwnership !== 'expo') {
  // Android 8+ requires a notification channel to be created before any notification
  // is displayed. The channel importance must be HIGH for heads-up (pop-over) banners
  // to appear — importance alone is not enough; the backend must also send priority:'high'.
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    });
  }

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
}

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
    // Skip on Expo Go (SDK 53+ removed remote push) and on simulators.
    if (IS_EXPO_GO || !Device.isDevice) return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return;

    try {
      // getDevicePushTokenAsync returns a native FCM token tied to com.moiorder.app —
      // not an ExponentPushToken. This guarantees tapping the notification opens this
      // app, never Expo Go, even if both are installed on the same device.
      const tokenData = await Notifications.getDevicePushTokenAsync();
      const token     = tokenData.data as string;
      const platform  = Platform.OS === 'ios' ? 'ios' : 'android';

      setPushToken(token);
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
