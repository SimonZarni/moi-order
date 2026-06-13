import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe } from '../api/auth';
import { getMenuCategories } from '../api/menu';
import { QUERY_KEYS } from '../shared/constants/queryKeys';
import { CACHE_TTL } from '../shared/constants/config';
import { colours } from '../shared/theme/colours';
import { AuthNavigator } from './AuthNavigator';
import { KycNavigator } from './KycNavigator';
import { MerchantTabsNavigator } from './MerchantTabsNavigator';
import { usePushNotifications } from '../features/notifications/hooks/usePushNotifications';
import { useMerchantWebSocket } from '../shared/hooks/useMerchantWebSocket';
import { KYC_STATUS } from '../types/enums';
import type { RootStackParamList } from '../types/navigation';

const RootStack = createNativeStackNavigator<RootStackParamList>();

function PushNotificationManager(): null {
  usePushNotifications();
  return null;
}

/**
 * Holds the Pusher WebSocket connection for the lifetime of the authenticated session.
 * Principle: SRP — manages connection lifecycle only; renders nothing.
 */
function WebSocketManager(): null {
  useMerchantWebSocket();
  return null;
}

export function AppNavigator(): React.JSX.Element {
  const { token, user, isLoading, initFromStorage, setUser } = useAuthStore();
  const initSettingsFromStorage = useSettingsStore((s) => s.initFromStorage);
  const theme = useSettingsStore((s) => s.theme);
  const queryClient = useQueryClient();

  // Inject global CSS (once) so images inside the dark-content area get
  // counter-inverted and appear normal despite the parent filter.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    if (document.getElementById('moi-dark-css')) return;
    const el = document.createElement('style');
    el.id = 'moi-dark-css';
    el.textContent =
      '[data-theme="dark"] #dark-content img { filter: invert(1) hue-rotate(180deg) !important; }';
    document.head.appendChild(el);
  }, []);

  // Sync the current theme to the document root so the CSS rule above activates.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    initFromStorage();
    void initSettingsFromStorage();
  }, [initFromStorage, initSettingsFromStorage]);

  // Clear all cached queries when a merchant logs out so the next merchant
  // who logs in never sees the previous merchant's data.
  const prevTokenRef = useRef<string | null>(token);
  useEffect(() => {
    const prev = prevTokenRef.current;
    prevTokenRef.current = token;
    if (prev !== null && token === null) {
      queryClient.clear();
    }
  }, [token, queryClient]);

  const { isLoading: isMeLoading } = useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: async () => {
      const me = await getMe();
      setUser(me);
      return me;
    },
    enabled: !!token && !user,
    staleTime: CACHE_TTL.USER,
    retry: false,
  });

  // Prefetch tab data in parallel as soon as the user is confirmed a merchant.
  // By the time they tap any tab, the data is already in cache — zero wait.
  useEffect(() => {
    if (!user?.is_merchant) return;
    void queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.MENU_CATEGORIES,
      queryFn: getMenuCategories,
      staleTime: CACHE_TTL.MENU,
    });
  }, [user?.is_merchant, queryClient]);

  if (isLoading || (!!token && !user && isMeLoading)) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  const needsKyc =
    user && !user.is_merchant && user.kyc_status !== KYC_STATUS.Approved;

  return (
    <NavigationContainer>
      {!!token && !needsKyc && <PushNotificationManager />}
      {!!token && !needsKyc && <WebSocketManager />}
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : needsKyc ? (
          <RootStack.Screen name="Kyc" component={KycNavigator} />
        ) : (
          <RootStack.Screen name="Merchant" component={MerchantTabsNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundLight,
  },
});
