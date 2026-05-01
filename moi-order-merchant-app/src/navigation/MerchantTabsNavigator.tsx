import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { MerchantTabParamList } from '../types/navigation';
import { OrdersScreen } from '../features/orders/screens/OrdersScreen';
import { MenuScreen } from '../features/menu/screens/MenuScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { WebSidebar } from '../shared/components/WebSidebar/WebSidebar';
import { colours } from '../shared/theme/colours';
import { WEB_SIDEBAR_WIDTH } from '../shared/constants/config';
import { useAuthStore } from '../store/authStore';

const Tab = createBottomTabNavigator<MerchantTabParamList>();
const Stack = createNativeStackNavigator<MerchantTabParamList>();

type TabName = keyof MerchantTabParamList;

const TAB_ICONS: Record<TabName, { focused: string; unfocused: string }> = {
  Orders: { focused: 'receipt', unfocused: 'receipt-outline' },
  Menu: { focused: 'restaurant', unfocused: 'restaurant-outline' },
  Profile: { focused: 'person', unfocused: 'person-outline' },
};

function MobileTabNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colours.backgroundDark },
        headerTintColor: colours.textOnDark,
        tabBarActiveTintColor: colours.primary,
        tabBarInactiveTintColor: colours.medium,
        tabBarStyle: { backgroundColor: colours.backgroundDark, borderTopColor: colours.backgroundDark },
        tabBarIcon: ({ focused, size }) => {
          const icons = TAB_ICONS[route.name as TabName];
          const iconName = focused ? icons.focused : icons.unfocused;
          return (
            <Ionicons
              name={iconName as keyof typeof Ionicons.glyphMap}
              size={size}
              color={focused ? colours.primary : colours.medium}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'Orders' }} />
      <Tab.Screen name="Menu" component={MenuScreen} options={{ title: 'Menu' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

function WebStackNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export function MerchantTabsNavigator(): React.JSX.Element {
  const logout = useAuthStore((s) => s.logout);

  if (Platform.OS !== 'web') {
    return <MobileTabNavigator />;
  }

  return (
    <View style={styles.webLayout}>
      <WebSidebar onLogout={logout} />
      <View style={styles.webContent}>
        <WebStackNavigator />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  webContent: {
    flex: 1,
    marginLeft: WEB_SIDEBAR_WIDTH,
  },
});
