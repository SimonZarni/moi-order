import React, { useState, useCallback } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type {
  MerchantTabParamList,
  MerchantStackParamList,
  WebScreen,
} from '../types/navigation';
import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
import { OrdersScreen } from '../features/orders/screens/OrdersScreen';
import { OrderDetailScreen } from '../features/orders/screens/OrderDetailScreen';
import { OrderChatContent, OrderChatScreen } from '../features/chat/screens/OrderChatScreen';
import { MenuScreen } from '../features/menu/screens/MenuScreen';
import { RestaurantScreen } from '../features/restaurant/screens/RestaurantScreen';
import { AnalyticsScreen } from '../features/analytics/screens/AnalyticsScreen';
import { WebSidebar } from '../shared/components/WebSidebar/WebSidebar';
import { colours } from '../shared/theme/colours';
import { WEB_SIDEBAR_WIDTH } from '../shared/constants/config';
import { useAuthStore } from '../store/authStore';

// ── Mobile ─────────────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator<MerchantTabParamList>();
const MobileStack = createNativeStackNavigator<MerchantStackParamList>();

type TabName = keyof MerchantTabParamList;

const TAB_ICONS: Record<TabName, { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap }> = {
  Dashboard:  { focused: 'grid',       unfocused: 'grid-outline' },
  Orders:     { focused: 'receipt',    unfocused: 'receipt-outline' },
  Menu:       { focused: 'restaurant', unfocused: 'restaurant-outline' },
  Restaurant: { focused: 'storefront', unfocused: 'storefront-outline' },
};

function DashboardTab(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();
  const handleSelectOrder = useCallback(
    (orderId: number) => navigation.navigate('OrderDetail', { orderId }),
    [navigation],
  );
  return <DashboardScreen onSelectOrder={handleSelectOrder} />;
}

function OrdersTab(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();
  const handleSelectOrder = useCallback(
    (orderId: number) => navigation.navigate('OrderDetail', { orderId }),
    [navigation],
  );
  return <OrdersScreen onSelectOrder={handleSelectOrder} />;
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
      <Tab.Screen name="Dashboard"  component={DashboardTab}    options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Orders"     component={OrdersTab}       options={{ title: 'Orders' }} />
      <Tab.Screen name="Menu"       component={MenuScreen}      options={{ title: 'Menu' }} />
      <Tab.Screen name="Restaurant" component={RestaurantScreen} options={{ title: 'Restaurant' }} />
    </Tab.Navigator>
  );
}

function OrderDetailRoute(
  { route, navigation }: NativeStackScreenProps<MerchantStackParamList, 'OrderDetail'>,
): React.JSX.Element {
  const { orderId } = route.params;
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleChatPress = useCallback(
    (id: number) => navigation.navigate('OrderChat', { orderId: id }),
    [navigation],
  );
  return <OrderDetailScreen orderId={orderId} onBack={handleBack} onChatPress={handleChatPress} />;
}

function MobileNavigator(): React.JSX.Element {
  return (
    <MobileStack.Navigator screenOptions={{ headerShown: false }}>
      <MobileStack.Screen name="Tabs" component={MobileTabNavigator} />
      <MobileStack.Screen name="OrderDetail" component={OrderDetailRoute} />
      <MobileStack.Screen name="OrderChat" component={OrderChatScreen} />
    </MobileStack.Navigator>
  );
}

// ── Web ────────────────────────────────────────────────────────────────────────

function WebMerchantLayout(): React.JSX.Element {
  const [activeScreen, setActiveScreen] = useState<WebScreen>('Dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [chatOrderId, setChatOrderId] = useState<number | null>(null);
  const logout = useAuthStore((s) => s.logout);

  const handleNavigate = useCallback((screen: WebScreen) => {
    setActiveScreen(screen);
    setSelectedOrderId(null);
    setChatOrderId(null);
  }, []);

  const handleSelectOrder = useCallback((orderId: number) => {
    setSelectedOrderId(orderId);
    setChatOrderId(null);
  }, []);

  const handleBackFromOrder = useCallback(() => {
    setSelectedOrderId(null);
  }, []);

  const handleChatOpen = useCallback((orderId: number) => {
    setChatOrderId(orderId);
  }, []);

  const handleChatClose = useCallback(() => {
    setChatOrderId(null);
  }, []);

  const sidebarActiveScreen: WebScreen =
    selectedOrderId !== null || chatOrderId !== null ? 'Orders' : activeScreen;

  const renderContent = (): React.JSX.Element => {
    if (chatOrderId !== null) {
      return <OrderChatContent orderId={chatOrderId} onBack={handleChatClose} />;
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
        return <DashboardScreen onSelectOrder={handleSelectOrder} />;
      case 'Orders':
        return <OrdersScreen onSelectOrder={handleSelectOrder} />;
      case 'Menu':
        return <MenuScreen />;
      case 'Restaurant':
        return <RestaurantScreen />;
      case 'Analytics':
        return <AnalyticsScreen />;
    }
  };

  return (
    <View style={webStyles.layout}>
      <WebSidebar
        activeScreen={sidebarActiveScreen}
        onNavigate={handleNavigate}
        onLogout={logout}
      />
      <View style={webStyles.content}>
        <View style={webStyles.contentInner}>
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
  // Constrains content to readable width on very wide monitors
  contentInner: {
    flex: 1,
    maxWidth: 1280,
    alignSelf: 'stretch' as const,
  },
});
