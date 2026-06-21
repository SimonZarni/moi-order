import React, { useState, useCallback, useEffect } from 'react';
import { Platform, View, Text, Pressable, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import type {
  MerchantTabParamList,
  MerchantStackParamList,
  WebScreen,
} from '../types/navigation';
import { getOrder } from '../api/orders';
import { markReadByOrder } from '../api/merchantNotifications';
import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
import { OrdersScreen } from '../features/orders/screens/OrdersScreen';
import { CancelledOrdersScreen } from '../features/orders/screens/CancelledOrdersScreen';
import { OrderDetailScreen } from '../features/orders/screens/OrderDetailScreen';
import { OrderChatContent, OrderChatScreen } from '../features/chat/screens/OrderChatScreen';
import { MenuScreen } from '../features/menu/screens/MenuScreen';
import { EditMenuItemScreen } from '../features/menu/screens/EditMenuItemScreen';
import { RestaurantScreen } from '../features/restaurant/screens/RestaurantScreen';
import { AnalyticsScreen } from '../features/analytics/screens/AnalyticsScreen';
import { DailyInvoiceScreen } from '../features/invoice/screens/DailyInvoiceScreen';
import { NotificationsScreen } from '../features/notifications/screens/NotificationsScreen';
import { NotificationBell } from '../features/notifications/components/NotificationBell';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { BusinessProfileScreen } from '../features/businessProfile/screens/BusinessProfileScreen';
import { ReviewsScreen } from '../features/reviews/screens/ReviewsScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { ChangePasswordScreen } from '../features/settings/screens/ChangePasswordScreen';
import { OperatingHoursScreen } from '../features/settings/screens/OperatingHoursScreen';
import { WebSidebar } from '../shared/components/WebSidebar/WebSidebar';
import { colours } from '../shared/theme/colours';
import { spacing } from '../shared/theme/spacing';
import { typography } from '../shared/theme/typography';
import { WEB_SIDEBAR_WIDTH } from '../shared/constants/config';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { useResponsive } from '../shared/hooks/useResponsive';
import { useOrderAlarm } from '../shared/hooks/useOrderAlarm';
import { useWsStatus } from '../shared/hooks/useMerchantWebSocket';

// ── Mobile ─────────────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator<MerchantTabParamList>();
const MobileStack = createNativeStackNavigator<MerchantStackParamList>();

type TabName = keyof MerchantTabParamList;

const TAB_ICONS: Record<TabName, { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap }> = {
  Dashboard:     { focused: 'grid',              unfocused: 'grid-outline' },
  Orders:        { focused: 'receipt',           unfocused: 'receipt-outline' },
  Menu:          { focused: 'restaurant',        unfocused: 'restaurant-outline' },
  Restaurant:    { focused: 'storefront',        unfocused: 'storefront-outline' },
  Notifications: { focused: 'notifications',     unfocused: 'notifications-outline' },
  Profile:       { focused: 'person-circle',     unfocused: 'person-circle-outline' },
};

function DashboardTab(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();
  const handleSelectOrder = useCallback(
    (orderId: string) => navigation.navigate('OrderDetail', { orderId }),
    [navigation],
  );
  // On mobile, the bell doesn't render — the tab badge already shows count.
  return <DashboardScreen onSelectOrder={handleSelectOrder} />;
}

function OrdersTab(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();
  const handleSelectOrder = useCallback(
    (orderId: string) => navigation.navigate('OrderDetail', { orderId }),
    [navigation],
  );
  const handleCancelledOrders = useCallback(
    () => navigation.navigate('CancelledOrders'),
    [navigation],
  );
  return <OrdersScreen onSelectOrder={handleSelectOrder} onCancelledOrders={handleCancelledOrders} />;
}

function RestaurantTab(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();
  const handleReviews = useCallback(
    () => navigation.navigate('Reviews'),
    [navigation],
  );
  return <RestaurantScreen onReviewsPress={handleReviews} />;
}

function MenuTab(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();
  const handleEditItem = useCallback(
    (itemId: number) => navigation.navigate('EditMenuItem', { itemId }),
    [navigation],
  );
  return <MenuScreen onEditItem={handleEditItem} />;
}

function MobileTabNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colours.backgroundDark },
        headerTintColor: colours.textOnDark,
        tabBarActiveTintColor: colours.primary,
        tabBarInactiveTintColor: colours.medium,
        tabBarStyle: {
          backgroundColor: colours.backgroundDark,
          borderTopColor: colours.dividerDark,
        },
        tabBarIcon: ({ focused, size }) => {
          const icons = TAB_ICONS[route.name as TabName];
          return (
            <Ionicons
              name={focused ? icons.focused : icons.unfocused}
              size={size}
              color={focused ? colours.primary : colours.medium}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard"     component={DashboardTab}        options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Orders"        component={OrdersTab}           options={{ title: 'Orders' }} />
      <Tab.Screen name="Menu"          component={MenuTab}             options={{ title: 'Menu' }} />
      <Tab.Screen name="Restaurant"    component={RestaurantTab}       options={{ title: 'Restaurant' }} />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Inbox',
          tabBarBadge: undefined,   // badge driven by NotificationBell internally
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

function OrderDetailRoute(
  { route, navigation }: NativeStackScreenProps<MerchantStackParamList, 'OrderDetail'>,
): React.JSX.Element {
  const { orderId } = route.params;
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleChatPress = useCallback(
    (id: string, orderNum: string, completedAt: string | null, orderStatus: string) =>
      navigation.navigate('OrderChat', { orderId: id, orderNumber: orderNum, completedAt, orderStatus }),
    [navigation],
  );
  return <OrderDetailScreen orderId={orderId} onBack={handleBack} onChatPress={handleChatPress} />;
}

function CancelledOrdersRoute(
  { navigation }: NativeStackScreenProps<MerchantStackParamList, 'CancelledOrders'>,
): React.JSX.Element {
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleSelectOrder = useCallback(
    (orderId: string) => navigation.navigate('OrderDetail', { orderId }),
    [navigation],
  );
  return <CancelledOrdersScreen onBack={handleBack} onSelectOrder={handleSelectOrder} />;
}

function SettingsRoute(
  { navigation }: NativeStackScreenProps<MerchantStackParamList, 'Settings'>,
): React.JSX.Element {
  const handleChangePassword = useCallback(
    () => navigation.navigate('ChangePassword'),
    [navigation],
  );
  const handleOperatingHours = useCallback(
    () => navigation.navigate('OperatingHours'),
    [navigation],
  );
  return <SettingsScreen onChangePassword={handleChangePassword} onOperatingHours={handleOperatingHours} />;
}

function ChangePasswordRoute(
  { navigation }: NativeStackScreenProps<MerchantStackParamList, 'ChangePassword'>,
): React.JSX.Element {
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  return <ChangePasswordScreen onBack={handleBack} />;
}

function OperatingHoursRoute(
  { navigation }: NativeStackScreenProps<MerchantStackParamList, 'OperatingHours'>,
): React.JSX.Element {
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  return <OperatingHoursScreen onBack={handleBack} />;
}

function EditMenuItemRoute(
  { route, navigation }: NativeStackScreenProps<MerchantStackParamList, 'EditMenuItem'>,
): React.JSX.Element {
  const { itemId } = route.params;
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  return <EditMenuItemScreen itemId={itemId} onBack={handleBack} />;
}

function MobileNavigator(): React.JSX.Element {
  return (
    <MobileStack.Navigator screenOptions={{ headerShown: false }}>
      <MobileStack.Screen name="Tabs" component={MobileTabNavigator} />
      <MobileStack.Screen name="EditMenuItem" component={EditMenuItemRoute} options={{ headerShown: false }} />
      <MobileStack.Screen name="OrderDetail" component={OrderDetailRoute} />
      <MobileStack.Screen name="OrderChat" component={OrderChatScreen} />
      <MobileStack.Screen name="BusinessProfile" component={BusinessProfileScreen} options={{ headerShown: false }} />
      <MobileStack.Screen name="Reviews" component={ReviewsScreen} options={{ headerShown: false }} />
      <MobileStack.Screen name="CancelledOrders" component={CancelledOrdersRoute} options={{ headerShown: false }} />
      <MobileStack.Screen name="Settings" component={SettingsRoute} options={{ headerShown: false }} />
      <MobileStack.Screen name="ChangePassword" component={ChangePasswordRoute} options={{ headerShown: false }} />
      <MobileStack.Screen name="OperatingHours" component={OperatingHoursRoute} options={{ headerShown: false }} />
    </MobileStack.Navigator>
  );
}

// ── Web ────────────────────────────────────────────────────────────────────────

const SCREEN_TO_PATH: Record<WebScreen, string> = {
  Dashboard:       '/',
  Orders:          '/orders',
  Menu:            '/menu',
  Restaurant:      '/restaurant',
  Analytics:       '/analytics',
  Cashout:         '/cashout',
  Notifications:   '/notifications',
  BusinessProfile: '/business-profile',
  Reviews:         '/reviews',
  CancelledOrders: '/orders/cancelled',
  Settings:        '/settings',
};

interface ParsedUrl {
  screen:  WebScreen;
  orderId: string | null;
  chatId:  string | null;
}

const UUID_RE = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

function parseUrlPath(path: string = typeof window !== 'undefined' ? window.location.pathname : '/'): ParsedUrl {
  const chatMatch = path.match(new RegExp(`^/orders/(${UUID_RE})/chat$`, 'i'));
  if (chatMatch) {
    return { screen: 'Orders', orderId: chatMatch[1], chatId: chatMatch[1] };
  }

  const orderMatch = path.match(new RegExp(`^/orders/(${UUID_RE})$`, 'i'));
  if (orderMatch) {
    return { screen: 'Orders', orderId: orderMatch[1], chatId: null };
  }

  const found = (Object.entries(SCREEN_TO_PATH) as [WebScreen, string][])
    .find(([, p]) => p === path);
  return { screen: found?.[0] ?? 'Dashboard', orderId: null, chatId: null };
}

// Snapshot the URL the moment this module loads — before NavigationContainer
// initialises or any async auth effect can call history.replaceState.
const _BOOT_URL: ParsedUrl =
  Platform.OS === 'web' && typeof window !== 'undefined'
    ? parseUrlPath(window.location.pathname)
    : { screen: 'Dashboard', orderId: null, chatId: null };

type SettingsSubView = 'list' | 'changePassword' | 'operatingHours';

function WebMerchantLayout(): React.JSX.Element {
  const [activeScreen, setActiveScreen]     = useState<WebScreen>(_BOOT_URL.screen);
  const [editingItemId, setEditingItemId]   = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(_BOOT_URL.orderId);
  const [chatOrderId, setChatOrderId]       = useState<string | null>(_BOOT_URL.chatId);
  const [chatOrderNumber, setChatOrderNumber] = useState<string>('');
  const [chatCompletedAt, setChatCompletedAt] = useState<string | null>(null);
  const [chatOrderStatus, setChatOrderStatus] = useState<string>('');
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [settingsSubView, setSettingsSubView] = useState<SettingsSubView>('list');
  const { isDesktop } = useResponsive();
  const logout = useAuthStore((s) => s.logout);
  const theme = useSettingsStore((s) => s.theme);
  const darkStyle = theme === 'dark' ? ({ filter: 'invert(1) hue-rotate(180deg)' } as object) : null;
  const { isEnabled: isAlarmEnabled, toggleEnabled: toggleAlarm, triggerAlarm, audioStatus, audioError } = useOrderAlarm();
  const { wsStatus, wsError, channelStatus, channelError, pusherKey } = useWsStatus();
  const queryClient = useQueryClient();

  // When the page is hard-refreshed at /orders/{uuid}/chat, chatOrderId is
  // restored from the URL but chatOrderNumber/completedAt/status are empty
  // because handleChatOpen was never called. Fetch the order to fill them in.
  useEffect(() => {
    if (chatOrderId === null || chatOrderNumber !== '') return;
    getOrder(chatOrderId)
      .then((order) => {
        setChatOrderNumber(order.order_number ?? '');
        setChatCompletedAt(order.completed_at);
        setChatOrderStatus(order.status);
      })
      .catch(() => { /* silent — header sub will show fallback */ });
  }, [chatOrderId, chatOrderNumber]);

  // Push URL when navigation state changes. Skips if already matches (no extra
  // history entry on mount since initial state is derived from the current URL).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let path: string;
    if (chatOrderId !== null) {
      path = `/orders/${chatOrderId}/chat`;
    } else if (selectedOrderId !== null) {
      path = `/orders/${selectedOrderId}`;
    } else {
      path = SCREEN_TO_PATH[activeScreen];
    }
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  }, [activeScreen, selectedOrderId, chatOrderId]);

  // Sync state when the user presses the browser back/forward button.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePop = () => {
      const { screen, orderId, chatId } = parseUrlPath();
      setActiveScreen(screen);
      setSelectedOrderId(orderId);
      setChatOrderId(chatId);
      if (chatId === null) setChatOrderNumber('');
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const handleNavigate = useCallback((screen: WebScreen) => {
    setActiveScreen(screen);
    setEditingItemId(null);
    setSelectedOrderId(null);
    setChatOrderId(null);
    setChatOrderNumber('');
    setSidebarOpen(false);
    setSettingsSubView('list');
  }, []);

  const handleSelectOrder = useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
    setChatOrderId(null);
    setChatOrderNumber('');
    void markReadByOrder(orderId).then(() => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }).catch(() => { /* non-critical — badge will self-correct on next poll */ });
  }, [queryClient]);

  const handleBackFromOrder = useCallback(() => {
    setSelectedOrderId(null);
  }, []);

  const handleChatOpen = useCallback((orderId: string, orderNumber: string, completedAt: string | null, orderStatus: string) => {
    setChatOrderId(orderId);
    setChatOrderNumber(orderNumber);
    setChatCompletedAt(completedAt);
    setChatOrderStatus(orderStatus);
  }, []);

  const handleChatClose = useCallback(() => {
    setChatOrderId(null);
    setChatOrderNumber('');
    setChatCompletedAt(null);
    setChatOrderStatus('');
  }, []);

  const sidebarActiveScreen: WebScreen =
    selectedOrderId !== null || chatOrderId !== null ? 'Orders' : activeScreen;

  const renderContent = (): React.JSX.Element => {
    if (chatOrderId !== null) {
      return <OrderChatContent orderId={chatOrderId} orderNumber={chatOrderNumber || undefined} completedAt={chatCompletedAt} orderStatus={chatOrderStatus} onBack={handleChatClose} />;
    }
    if (selectedOrderId !== null) {
      return (
        <OrderDetailScreen
          orderId={selectedOrderId}
          onBack={handleBackFromOrder}
          onChatPress={handleChatOpen}
        />
      );
    }
    switch (activeScreen) {
      case 'Dashboard':
        return (
          <DashboardScreen
            onSelectOrder={handleSelectOrder}
          />
        );
      case 'Orders':
        return (
          <OrdersScreen
            onSelectOrder={handleSelectOrder}
            onCancelledOrders={() => handleNavigate('CancelledOrders')}
          />
        );
      case 'CancelledOrders':
        return (
          <CancelledOrdersScreen
            onBack={() => handleNavigate('Orders')}
            onSelectOrder={handleSelectOrder}
          />
        );
      case 'Menu':
        if (editingItemId !== null) {
          return <EditMenuItemScreen itemId={editingItemId} onBack={() => setEditingItemId(null)} />;
        }
        return <MenuScreen onEditItem={(id) => setEditingItemId(id)} />;
      case 'Restaurant':
        return <RestaurantScreen />;
      case 'Analytics':
        return <AnalyticsScreen />;
      case 'Notifications':
        return (
          <NotificationsScreen
            onPressNotification={(n) => {
              if (n.order_id === null) return;
              const orderId = String(n.order_id);
              if (n.type === 'chat_message') {
                setChatOrderId(orderId);
                // Clear metadata so the boot-fetch useEffect re-runs for this order.
                setChatOrderNumber('');
                setChatCompletedAt(null);
                setChatOrderStatus('');
              } else {
                setSelectedOrderId(orderId);
              }
            }}
          />
        );
      case 'BusinessProfile':
        return <BusinessProfileScreen />;
      case 'Reviews':
        return <ReviewsScreen />;
      case 'Cashout':
        return <DailyInvoiceScreen />;
      case 'Settings':
        if (settingsSubView === 'changePassword') {
          return <ChangePasswordScreen onBack={() => setSettingsSubView('list')} />;
        }
        if (settingsSubView === 'operatingHours') {
          return <OperatingHoursScreen onBack={() => setSettingsSubView('list')} />;
        }
        return (
          <SettingsScreen
            onChangePassword={() => setSettingsSubView('changePassword')}
            onOperatingHours={() => setSettingsSubView('operatingHours')}
          />
        );
    }
  };

  const showSidebar = isDesktop || sidebarOpen;

  return (
    <View style={webStyles.layout}>
      {showSidebar && (
        <WebSidebar
          activeScreen={sidebarActiveScreen}
          onNavigate={handleNavigate}
          onLogout={logout}
          isAlarmEnabled={isAlarmEnabled}
          onAlarmToggle={toggleAlarm}
          // onAlarmTest={() => triggerAlarm(true)}
          // diagnostic={{ wsStatus, wsError, channelStatus, channelError, pusherKey, audioStatus, audioError }}
        />
      )}

      {/* Backdrop — tapping it closes the sidebar on mobile */}
      {!isDesktop && sidebarOpen && (
        <Pressable
          style={webStyles.backdrop}
          onPress={() => setSidebarOpen(false)}
          accessibilityLabel="Close menu"
          accessibilityRole="button"
        />
      )}

      <View style={[webStyles.content, !isDesktop && webStyles.contentMobile]}>
        {/* Mobile top bar with hamburger + bell — only shown on narrow viewports */}
        {!isDesktop && (
          <View style={webStyles.mobileTopBar}>
            <Pressable
              style={webStyles.hamburgerBtn}
              onPress={() => setSidebarOpen(true)}
              accessibilityLabel="Open navigation menu"
              accessibilityRole="button"
            >
              <Ionicons name="menu-outline" size={24} color={colours.textOnDark} />
            </Pressable>
            <Text style={webStyles.mobileTopBarTitle}>MOi Order</Text>
            <View style={{ marginLeft: 'auto' as unknown as number }}>
              <NotificationBell
                onPress={() => handleNavigate('Notifications')}
                iconColour={colours.textOnDark}
              />
            </View>
          </View>
        )}
        {/* Audio unlocks passively on first click anywhere via window listeners in useOrderAlarm */}
        <View nativeID="dark-content" style={[webStyles.contentInner, darkStyle]}>
          {renderContent()}
        </View>
      </View>
    </View>
  );
}

// ── Root export ────────────────────────────────────────────────────────────────

export function MerchantTabsNavigator(): React.JSX.Element {
  if (Platform.OS !== 'web') {
    return <MobileNavigator />;
  }
  return <WebMerchantLayout />;
}

const webStyles = StyleSheet.create({
  layout: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colours.backgroundLight,
  },
  content: {
    flex: 1,
    marginLeft: WEB_SIDEBAR_WIDTH,
    backgroundColor: colours.backgroundLight,
  },
  contentMobile: {
    marginLeft: 0,
  },
  contentInner: {
    flex: 1,
    alignSelf: 'stretch' as const,
  },
  backdrop: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colours.overlay,
    zIndex: 5,
  },
  mobileTopBar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.dividerDark,
  },
  hamburgerBtn: {
    padding: spacing.xs,
  },
  mobileTopBarTitle: {
    color: colours.textOnDark,
    fontSize: typography.md,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  unlockBanner: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.xs,
    backgroundColor: colours.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  unlockBannerText: {
    color: colours.textOnDark,
    fontSize: typography.xs,
    fontWeight: '600' as const,
  },
});
