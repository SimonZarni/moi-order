/**
 * Principle: SRP — entry point wires providers + auth-aware navigation only; zero business logic.
 * Auth restore: on mount, reads token from SecureStore → calls /me → populates authStore.
 *   Shows a blank teal splash while initialising to avoid flash of wrong screen.
 * Navigation structure:
 *   RootStack (native-stack) → MainTabs (bottom-tabs) → Home / Places / Orders / Profile
 *   Non-tab screens (Login, OrderDetail, etc.) are pushed onto the root stack.
 *   FloatingTabBar is the tabBar prop of MainTabs — renders once, never remounts.
 * Guest access: all screens are always mounted. Auth guard lives in form-submission
 *   coordinator hooks (redirect to Login on submit when unauthenticated).
 * Provider order (outermost → innermost):
 *   SafeAreaProvider → QueryClientProvider → NavigationContainer → RootStack
 */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

enableScreens(true);

import { GoogleSignin } from '@/shared/utils/googleSignin';

import { setMemoryToken, setMemoryLocale } from '@/shared/api/client';
import { fetchMe } from '@/shared/api/auth';
import { TOKEN_KEY, LOCALE_KEY, CACHE_TTL, GOOGLE_WEB_CLIENT_ID } from '@/shared/constants/config';

GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
import { useAuthStore } from '@/shared/store/authStore';
import { useLocaleStore, Locale } from '@/shared/store/localeStore';
import { colours } from '@/shared/theme/colours';
import { FloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';

import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { RegisterScreen } from '@/features/auth/screens/RegisterScreen';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { NinetyDayReportScreen } from '@/features/ninetyDayReport/screens/NinetyDayReportScreen';
import { NinetyDayReportFormScreen } from '@/features/ninetyDayReport/screens/NinetyDayReportFormScreen';
import { OtherServicesScreen } from '@/features/otherServices/screens/OtherServicesScreen';
import { EmbassyServicesScreen } from '@/features/embassyServices/screens/EmbassyServicesScreen';
import { AirportFastTrackFormScreen } from '@/features/airportFastTrack/screens/AirportFastTrackFormScreen';
import { EmbassyResidentialFormScreen } from '@/features/embassyResidential/screens/EmbassyResidentialFormScreen';
import { EmbassyCarLicenseFormScreen } from '@/features/embassyCarLicense/screens/EmbassyCarLicenseFormScreen';
import { EmbassyBankFormScreen } from '@/features/embassyBank/screens/EmbassyBankFormScreen';
import { EmbassyVisaRecommendationFormScreen } from '@/features/embassyVisaRecommendation/screens/EmbassyVisaRecommendationFormScreen';
import { TestServiceFormScreen } from '@/features/testService/screens/TestServiceFormScreen';
import { GenericServiceFormScreen } from '@/features/genericService/screens/GenericServiceFormScreen';
import { CompanyRegistrationFormScreen } from '@/features/companyRegistration/screens/CompanyRegistrationFormScreen';
import { OrdersScreen } from '@/features/orders/screens/OrdersScreen';
import { OrderDetailScreen } from '@/features/orders/screens/OrderDetailScreen';
import { PaymentScreen } from '@/features/payment/screens/PaymentScreen';
import { PlaceDetailScreen } from '@/features/places/screens/PlaceDetailScreen';
import { PlacesScreen } from '@/features/places/screens/PlacesScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';
import { PrivacyPolicyScreen } from '@/features/legal/screens/PrivacyPolicyScreen';
import { TermsAndConditionsScreen } from '@/features/legal/screens/TermsAndConditionsScreen';
import { PdpaNoticeScreen } from '@/features/legal/screens/PdpaNoticeScreen';
import { TicketsScreen } from '@/features/tickets/screens/TicketsScreen';
import { TicketDetailScreen } from '@/features/tickets/screens/TicketDetailScreen';
import { TicketDateSelectionScreen } from '@/features/tickets/screens/TicketDateSelectionScreen';
import { TicketOrderDetailScreen } from '@/features/tickets/screens/TicketOrderDetailScreen';
import { NotificationsScreen } from '@/features/notifications/screens/NotificationsScreen';
import { useNotificationsData } from '@/features/notifications/hooks/useNotificationsData';
import { usePusherNotifications } from '@/features/notifications/hooks/usePusherNotifications';
import { usePushNotifications } from '@/features/notifications/hooks/usePushNotifications';
import { useAppUpdate } from '@/shared/hooks/useAppUpdate';

import { RootStackParamList, TabParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: CACHE_TTL.USER_DATA,   // 5 min — no refetch on screen focus
      gcTime:    10 * 60 * 1000,        // 10 min — keep unmounted screen data in memory
    },
  },
});

// Mounted inside QueryClientProvider — manages the Pusher connection and seeds the
// unread notification count for the entire session. Both hooks are no-ops until
// the user logs in (userId becomes non-null).
function AppShell(): React.JSX.Element {
  useAppUpdate();
  usePusherNotifications();
  usePushNotifications();
  useNotificationsData();
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ animation: 'none' }} />
      <Stack.Screen name="Login"                         component={LoginScreen} />
      <Stack.Screen name="Register"                      component={RegisterScreen} />
      <Stack.Screen name="OrderDetail"                   component={OrderDetailScreen} />
      <Stack.Screen name="Payment"                       component={PaymentScreen} />
      <Stack.Screen name="NinetyDayReport"               component={NinetyDayReportScreen} />
      <Stack.Screen name="NinetyDayReportForm"           component={NinetyDayReportFormScreen} />
      <Stack.Screen name="OtherServices"                 component={OtherServicesScreen} />
      <Stack.Screen name="EmbassyServices"               component={EmbassyServicesScreen} />
      <Stack.Screen name="CompanyRegistrationForm"       component={CompanyRegistrationFormScreen} />
      <Stack.Screen name="AirportFastTrackForm"          component={AirportFastTrackFormScreen} />
      <Stack.Screen name="EmbassyResidentialForm"        component={EmbassyResidentialFormScreen} />
      <Stack.Screen name="EmbassyCarLicenseForm"         component={EmbassyCarLicenseFormScreen} />
      <Stack.Screen name="EmbassyBankForm"               component={EmbassyBankFormScreen} />
      <Stack.Screen name="EmbassyVisaRecommendationForm" component={EmbassyVisaRecommendationFormScreen} />
      <Stack.Screen name="TestServiceForm"               component={TestServiceFormScreen} />
      <Stack.Screen name="GenericServiceForm"            component={GenericServiceFormScreen} />
      <Stack.Screen name="PlaceDetail"                   component={PlaceDetailScreen} />
      <Stack.Screen name="Tickets"                       component={TicketsScreen} />
      <Stack.Screen name="TicketDetail"                  component={TicketDetailScreen} />
      <Stack.Screen name="TicketDateSelection"           component={TicketDateSelectionScreen} />
      <Stack.Screen name="TicketOrderDetail"             component={TicketOrderDetailScreen} />
      <Stack.Screen name="Notifications"                 component={NotificationsScreen} />
      <Stack.Screen name="PrivacyPolicy"                 component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsAndConditions"            component={TermsAndConditionsScreen} />
      <Stack.Screen name="PdpaNotice"                    component={PdpaNoticeScreen} />
    </Stack.Navigator>
  );
}

// Persistent tab container — all 4 tab screens are pre-rendered (lazy={false})
// so switching between them is always instant with no mount cost.
function MainTabs(): React.JSX.Element {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home"    component={HomeScreen} />
      <Tab.Screen name="Places"  component={PlacesScreen} />
      <Tab.Screen name="Orders"  component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App(): React.JSX.Element {
  const [isInitializing, setIsInitializing] = useState(true);
  const { setUser } = useAuthStore();

  useEffect(() => {
    async function restoreSession(): Promise<void> {
      try {
        const [token, localeVal] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(LOCALE_KEY),
        ]);

        if (localeVal === 'en' || localeVal === 'mm') {
          setMemoryLocale(localeVal);
          useLocaleStore.getState().setLocale(localeVal as Locale);
        }

        if (token !== null) {
          setMemoryToken(token);
          const user = await fetchMe();
          setUser(user, token);
        }
      } catch {
        // Token expired or invalid — clear silently; user browses as guest.
        await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
      } finally {
        setIsInitializing(false);
      }
    }
    restoreSession();
  }, []);

  if (isInitializing) {
    return (
      <View style={{ flex: 1, backgroundColor: colours.backgroundDark, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colours.tertiary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <StatusBar style="light" translucent />
          <AppShell />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
