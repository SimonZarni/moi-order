/**
 * Registers the device for Expo push notifications after login and cleans up
 * on logout. Handles tap navigation for merchant-specific notification types.
 *
 * Platform: 'merchant' is sent to the backend so NotifyMerchantOfNewOrder
 * only targets merchant device tokens, not customer tokens.
 */
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../../../store/authStore';
import { registerDeviceToken } from '../../../api/notifications';
import type { MerchantStackParamList } from '../../../types/navigation';

const IS_EXPO_GO = Constants.appOwnership === 'expo';

if (!IS_EXPO_GO) {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    });
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

interface MerchantPushData {
  type?: 'new_order' | string;
  order_id?: number;
}

export function usePushNotifications(): void {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();
  const responseListenerRef = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Push notification APIs are native-only — expo-notifications has no web support.
    if (Platform.OS === 'web') return;
    if (userId === null) return;

    void registerForPush();

    responseListenerRef.current = Notifications.addNotificationResponseReceivedListener(
      (response) => handleNotificationTap(response),
    );

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response !== null) handleNotificationTap(response);
    });

    return () => {
      responseListenerRef.current?.remove();
      responseListenerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function registerForPush(): Promise<void> {
    if (IS_EXPO_GO || !Device.isDevice) return;

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;

    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return;

    const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
    if (!projectId) return;

    try {
      const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
      registerDeviceToken(token).catch(() => {});
    } catch {
      // Silently ignore — app works without push, merchant can still poll orders.
    }
  }

  function handleNotificationTap(response: Notifications.NotificationResponse): void {
    const data = response.notification.request.content.data as MerchantPushData;

    if (data.type === 'new_order' && data.order_id !== undefined) {
      navigation.navigate('OrderDetail', { orderId: data.order_id });
    }
  }
}
