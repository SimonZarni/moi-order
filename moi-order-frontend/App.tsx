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
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

enableScreens(true);

import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });

import { GoogleSignin } from '@/shared/utils/googleSignin';
import { Line } from '@/shared/utils/lineLogin';

import { setMemoryToken, setMemoryLocale } from '@/shared/api/client';
import { fetchMe } from '@/shared/api/auth';
import { TOKEN_KEY, LOCALE_KEY, CACHE_TTL, GOOGLE_IOS_CLIENT_ID, LINE_CHANNEL_ID } from '@/shared/constants/config';

void Line.setup({ channelId: LINE_CHANNEL_ID });
// GoogleSignin.configure() is called inside App() useEffect (see below)
// to ensure the TurboModule is fully initialised before we configure it
// on New Architecture (Expo SDK 54 / RN 0.76).
import { useAuthStore } from '@/shared/store/authStore';
import { useLocaleStore, Locale } from '@/shared/store/localeStore';
import { RootFloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { AnimatedSplash } from '@/shared/components/AnimatedSplash';

import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { RegisterScreen } from '@/features/auth/screens/RegisterScreen';
import { EmailRegisterScreen } from '@/features/auth/screens/EmailRegisterScreen';
import { EmailOtpScreen } from '@/features/auth/screens/EmailOtpScreen';
import { SetPasswordScreen } from '@/features/auth/screens/SetPasswordScreen';
import { ForgotPasswordScreen } from '@/features/auth/screens/ForgotPasswordScreen';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { NinetyDayReportScreen } from '@/features/ninetyDayReport/screens/NinetyDayReportScreen';
import { NinetyDayReportFormScreen } from '@/features/ninetyDayReport/screens/NinetyDayReportFormScreen';
import { OtherServicesScreen } from '@/features/otherServices/screens/OtherServicesScreen';
import { EmbassyServicesScreen } from '@/features/embassyServices/screens/EmbassyServicesScreen';
import { CompanyServicesScreen } from '@/features/companyServices/screens/CompanyServicesScreen';
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
import { PassportVaultScreen } from '@/features/documents/screens/PassportVaultScreen';
import { NinetyDayVaultScreen } from '@/features/documents/screens/NinetyDayVaultScreen';
import { MyDocumentsScreen } from '@/features/documents/screens/MyDocumentsScreen';
import { MoiVerifiedScreen } from '@/features/profile/screens/MoiVerifiedScreen';
import { UpdatePhoneScreen } from '@/features/profile/screens/UpdatePhoneScreen';
import { UpdateEmailScreen } from '@/features/profile/screens/UpdateEmailScreen';
import { EmergencyContactListScreen } from '@/features/emergencyContacts/screens/EmergencyContactListScreen';
import { EmergencyContactDetailScreen } from '@/features/emergencyContacts/screens/EmergencyContactDetailScreen';
import { FoodScreen } from '@/features/food/screens/FoodScreen';
import { RestaurantDetailScreen } from '@/features/food/screens/RestaurantDetailScreen';
import { RestaurantMapScreen } from '@/features/food/screens/RestaurantMapScreen';
import { CartOrdersScreen } from '@/features/food/screens/CartOrdersScreen';
import { CheckoutScreen } from '@/features/food/screens/CheckoutScreen';
import { FoodOrderDetailScreen } from '@/features/food/screens/FoodOrderDetailScreen';
import { OrderChatScreen } from '@/features/food/screens/OrderChatScreen';

import { useNotificationsData } from '@/features/notifications/hooks/useNotificationsData';
import { usePusherNotifications } from '@/features/notifications/hooks/usePusherNotifications';
import { usePushNotifications } from '@/features/notifications/hooks/usePushNotifications';
import { useAppUpdate } from '@/shared/hooks/useAppUpdate';
import { useNoticeModal } from '@/shared/hooks/useNoticeModal';
import { NoticeModal } from '@/shared/components/NoticeModal/NoticeModal';
import { PlacesMapScreen } from '@/features/map/screens/PlacesMapScreen';
import { SearchScreen } from '@/features/search/screens/SearchScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts, PlayfairDisplay_700Bold_Italic, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';

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
  const { isVisible: noticeVisible, dismiss: dismissNotice } = useNoticeModal();
  return (
    <>
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ animation: 'none' }} />
      <Stack.Screen name="Login"          component={LoginScreen} />
      <Stack.Screen name="Register"       component={RegisterScreen} />
      <Stack.Screen name="EmailRegister"  component={EmailRegisterScreen} />
      <Stack.Screen name="EmailOtp"       component={EmailOtpScreen} />
      <Stack.Screen name="SetPassword"    component={SetPasswordScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="Payment"                       component={PaymentScreen} />
      <Stack.Screen name="NinetyDayReport"               component={NinetyDayReportScreen} />
      <Stack.Screen name="NinetyDayReportForm"           component={NinetyDayReportFormScreen} />
      <Stack.Screen name="OtherServices"                 component={OtherServicesScreen} />
      <Stack.Screen name="EmbassyServices"               component={EmbassyServicesScreen} />
      <Stack.Screen name="CompanyServices"               component={CompanyServicesScreen} />
      <Stack.Screen name="CompanyRegistrationForm"       component={CompanyRegistrationFormScreen} />
      <Stack.Screen name="AirportFastTrackForm"          component={AirportFastTrackFormScreen} />
      <Stack.Screen name="EmbassyResidentialForm"        component={EmbassyResidentialFormScreen} />
      <Stack.Screen name="EmbassyCarLicenseForm"         component={EmbassyCarLicenseFormScreen} />
      <Stack.Screen name="EmbassyBankForm"               component={EmbassyBankFormScreen} />
      <Stack.Screen name="EmbassyVisaRecommendationForm" component={EmbassyVisaRecommendationFormScreen} />
      <Stack.Screen name="TestServiceForm"               component={TestServiceFormScreen} />
      <Stack.Screen name="GenericServiceForm"            component={GenericServiceFormScreen} />
      <Stack.Screen name="Places"                          component={PlacesScreen} />
      <Stack.Screen name="PlaceDetail"                   component={PlaceDetailScreen} />
      <Stack.Screen name="Tickets"                       component={TicketsScreen} />
      <Stack.Screen name="TicketDetail"                  component={TicketDetailScreen} />
      <Stack.Screen name="TicketDateSelection"           component={TicketDateSelectionScreen} />
      <Stack.Screen name="TicketOrderDetail"             component={TicketOrderDetailScreen} />
      <Stack.Screen name="Notifications"                 component={NotificationsScreen} />
      <Stack.Screen name="Search"                        component={SearchScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="PrivacyPolicy"                 component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsAndConditions"            component={TermsAndConditionsScreen} />
      <Stack.Screen name="PdpaNotice"                    component={PdpaNoticeScreen} />
      <Stack.Screen name="PassportVault"                 component={PassportVaultScreen} />
      <Stack.Screen name="NinetyDayVault"                component={NinetyDayVaultScreen} />
      <Stack.Screen name="MyDocuments"                   component={MyDocumentsScreen} />
      <Stack.Screen name="MoiVerified"                   component={MoiVerifiedScreen} />
      <Stack.Screen name="UpdatePhone"                   component={UpdatePhoneScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UpdateEmail"                   component={UpdateEmailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EmergencyContactList"          component={EmergencyContactListScreen} />
      <Stack.Screen name="EmergencyContactDetail"        component={EmergencyContactDetailScreen} />
      <Stack.Screen name="Food"                          component={FoodScreen} />
      <Stack.Screen name="RestaurantDetail"              component={RestaurantDetailScreen} />
      <Stack.Screen name="RestaurantMap"                 component={RestaurantMapScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="CartOrders"                    component={CartOrdersScreen} />
      <Stack.Screen name="Checkout"                      component={CheckoutScreen} />
      <Stack.Screen name="FoodOrderDetail"               component={FoodOrderDetailScreen} />
      <Stack.Screen name="OrderChat"                     component={OrderChatScreen} />
    </Stack.Navigator>
    <NoticeModal isVisible={noticeVisible} onClose={dismissNotice} />
    </>
  );
}

// Persistent tab container — all 4 tab screens are pre-rendered (lazy={false})
// so switching between them is always instant with no mount cost.
function MainTabs(): React.JSX.Element {
  return (
    <Tab.Navigator
      tabBar={() => null}
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home"    component={HomeScreen} />
      <Tab.Screen name="Map"     component={PlacesMapScreen} />
      <Tab.Screen name="Orders"  component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Keep the native splash visible until our AnimatedSplash is rendered and covering the screen.
SplashScreen.preventAutoHideAsync().catch(() => {});

const SPLASH_MIN_MS = 1500;

export default function App(): React.JSX.Element {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const [initDone, setInitDone]     = useState(false);
  const [timerDone, setTimerDone]   = useState(false);
  const [splashGone, setSplashGone] = useState(false);
  const { setUser } = useAuthStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fontsLoaded, fontError] = useFonts({ PlayfairDisplay_700Bold_Italic, PlayfairDisplay_700Bold });

  // Hide the native splash immediately on first render — AnimatedSplash is already
  // covering the screen with the same green background, so the transition is invisible.
  useEffect(() => { SplashScreen.hideAsync().catch(() => {}); }, []);

  // Configure Google Sign-In inside useEffect so the TurboModule is ready
  // (calling configure() at module level can fail on New Architecture).
  useEffect(() => {
    try {
      GoogleSignin.configure({ iosClientId: GOOGLE_IOS_CLIENT_ID });
      console.log('[GoogleSignin] configured with iosClientId:', GOOGLE_IOS_CLIENT_ID?.slice(0, 20) + '…');
    } catch (e) {
      console.error('[GoogleSignin] configure failed:', String(e));
    }
  }, []);

  // Minimum-hold timer — fires after 1.5 s regardless of init speed.
  useEffect(() => {
    timerRef.current = setTimeout(() => setTimerDone(true), SPLASH_MIN_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

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
        setInitDone(true);
      }
    }
    restoreSession();
  }, [setUser]);

  // canHide when session restore, timer, and fonts are all settled (success or failure).
  // Never block on font failure — fonts are cosmetic; a stuck splash is worse than a font fallback.
  const fontsDone = fontsLoaded || fontError !== null;
  const canHide = initDone && timerDone && fontsDone;
  const onSplashHidden = useCallback(() => setSplashGone(true), []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer ref={navigationRef}>
            <StatusBar style="light" translucent />
            <BottomSheetModalProvider>
              {/* App shell is mounted immediately so navigation is ready; splash sits on top. */}
              <AppShell />
            </BottomSheetModalProvider>
          </NavigationContainer>
        </QueryClientProvider>
        {/* Inside SafeAreaProvider (for safe area insets) but outside
            NavigationContainer — places the tab bar in a separate hardware
            compositor layer above the Mapbox SurfaceView on Android. */}
        <RootFloatingTabBar navigationRef={navigationRef} />
      </SafeAreaProvider>
      {/* Outside NavigationContainer so absoluteFillObject covers the full physical
          screen on Android (including status bar + gesture-nav bar areas). */}
      {!splashGone && (
        <AnimatedSplash canHide={canHide} onHidden={onSplashHidden} />
      )}
    </GestureHandlerRootView>
  );
}
