/**
 * Principle: SRP — entry point wires providers + auth-aware navigation only; zero business logic.
 * Auth restore: on mount, reads token from SecureStore → calls /me → populates authStore.
 *   Shows a blank teal splash while initialising to avoid flash of wrong screen.
 * Navigation structure:
 *   RootStack (native-stack) → MainTabs (bottom-tabs) → Home / Places / Orders / Profile
 *   Non-tab screens (Login, OrderDetail, etc.) are pushed onto the root stack.
 *   FloatingTabBar is the tabBar prop of MainTabs — renders once, never remounts.
 * Auth guards: sensitive screens (document vaults, account edits, emergency contacts)
 *   are wrapped with guardedScreen() which redirects to Login if isLoggedIn is false.
 *   All other screens are accessible to guests; their coordinator hooks gate on submit.
 * Provider order (outermost → innermost):
 *   SafeAreaProvider → QueryClientProvider → NavigationContainer → RootStack
 */
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

enableScreens(true);

import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });

import { GoogleSignin } from '@/shared/utils/googleSignin';
import { Line } from '@/shared/utils/lineLogin';

import apiClient, { setMemoryToken, setMemoryLocale } from '@/shared/api/client';
import { fetchMe } from '@/shared/api/auth';
import { TOKEN_KEY, LOCALE_KEY, CACHE_TTL, GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, LINE_CHANNEL_ID } from '@/shared/constants/config';

GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID, iosClientId: GOOGLE_IOS_CLIENT_ID });
void Line.setup({ channelId: LINE_CHANNEL_ID });
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
import { OtherServicesScreen } from '@/features/otherServices/screens/OtherServicesScreen';
import { EmbassyServicesScreen } from '@/features/embassyServices/screens/EmbassyServicesScreen';
import { CompanyServicesScreen } from '@/features/companyServices/screens/CompanyServicesScreen';
import { PassportCiServicesScreen } from '@/features/passportCiServices/screens/PassportCiServicesScreen';
import { TestServiceFormScreen } from '@/features/testService/screens/TestServiceFormScreen';
import { GenericServiceFormScreen } from '@/features/genericService/screens/GenericServiceFormScreen';
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
import { BecomeMerchantScreen } from '@/features/merchant-application/screens/BecomeMerchantScreen';
import { MerchantMenuCategoriesScreen } from '@/features/merchant/screens/MerchantMenuCategoriesScreen';
import { AppVersionScreen } from '@/features/profile/screens/AppVersionScreen';
import { UpdatePhoneScreen } from '@/features/profile/screens/UpdatePhoneScreen';
import { UpdateEmailScreen } from '@/features/profile/screens/UpdateEmailScreen';
import { EmergencyContactListScreen } from '@/features/emergencyContacts/screens/EmergencyContactListScreen';
import { EmergencyContactDetailScreen } from '@/features/emergencyContacts/screens/EmergencyContactDetailScreen';
import { SafetyLocationListScreen } from '@/features/safety/screens/SafetyLocationListScreen';
import { SafetyLocationDetailScreen } from '@/features/safety/screens/SafetyLocationDetailScreen';
import { FoodScreen } from '@/features/food/screens/FoodScreen';
import { RestaurantDetailScreen } from '@/features/food/screens/RestaurantDetailScreen';
import { MenuItemDetailScreen } from '@/features/food/screens/MenuItemDetailScreen';
import { RestaurantMapScreen } from '@/features/food/screens/RestaurantMapScreen';
import { CartScreen } from '@/features/food/screens/CartScreen';
import { FoodOrdersScreen } from '@/features/food/screens/FoodOrdersScreen';
import { CartAndOrdersScreen } from '@/features/food/screens/CartAndOrdersScreen';
import { CheckoutScreen } from '@/features/food/screens/CheckoutScreen';
import { FoodOrderDetailScreen } from '@/features/food/screens/FoodOrderDetailScreen';
import { OrderChatScreen } from '@/features/food/screens/OrderChatScreen';
import { AddressListScreen } from '@/features/address/screens/AddressListScreen';
import { AddEditAddressScreen } from '@/features/address/screens/AddEditAddressScreen';
import { MapPickerScreen } from '@/features/address/screens/MapPickerScreen';
import { MaintenanceScreen } from '@/features/maintenance/screens/MaintenanceScreen';
// import { FloatingOrderStatusBar } from '@/shared/components/FloatingOrderStatusBar/FloatingOrderStatusBar';
import { navigationRef } from '@/shared/navigation/navigationRef';

import { useNotificationsData } from '@/features/notifications/hooks/useNotificationsData';
import { usePusherNotifications } from '@/features/notifications/hooks/usePusherNotifications';
import { usePushNotifications } from '@/features/notifications/hooks/usePushNotifications';
import { useAppUpdate } from '@/shared/hooks/useAppUpdate';
import { useOtaUpdate } from '@/shared/hooks/useOtaUpdate';
import { useNoticeModal } from '@/shared/hooks/useNoticeModal';
import { useAppConfig, type ForceUpdateState } from '@/shared/hooks/useAppConfig';
import { NoticeModal } from '@/shared/components/NoticeModal/NoticeModal';
import { InAppAlertModal } from '@/shared/components/InAppAlertModal/InAppAlertModal';
import { PlacesMapScreen } from '@/features/map/screens/PlacesMapScreen';
import { SearchScreen } from '@/features/search/screens/SearchScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts, PlayfairDisplay_700Bold_Italic, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';

import { RootStackParamList, TabParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Wraps a screen so unauthenticated users are immediately redirected to Login.
// Applied to screens that render sensitive personal data (documents, account edits)
// where a nav-layer bypass on a compromised device should not expose any UI.
function guardedScreen<P extends object>(Screen: React.ComponentType<P>): React.ComponentType<P> {
  function Guarded(props: P): React.JSX.Element | null {
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    useEffect(() => {
      if (!isLoggedIn) navigation.replace('Login');
    }, [isLoggedIn, navigation]);
    if (!isLoggedIn) return null;
    return <Screen {...props} />;
  }
  Guarded.displayName = `Guarded(${Screen.displayName ?? Screen.name})`;
  return Guarded;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Never retry 4xx errors — retrying 401/403 wastes the token window and delays
      // the logout redirect; retrying 422/409 won't produce a different result.
      // Only retry on network failures (status 0) or 5xx server errors.
      retry: (failureCount, error) => {
        const status = (error as { status?: number }).status;
        if (status !== undefined && status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
      staleTime: CACHE_TTL.USER_DATA,   // 5 min — no refetch on screen focus
      gcTime:    10 * 60 * 1000,        // 10 min — keep unmounted screen data in memory
    },
  },
});

// Full-screen blocking modal for required app updates.
// Rendered as a sibling to the navigation stack so it covers everything,
// including screens, tab bars, and modals rendered by individual screens.
// The user CANNOT dismiss this — onRequestClose is a no-op and there is no close button.
function ForceUpdateModal({ state }: { state: ForceUpdateState }): React.JSX.Element {
  const storeUrl = Platform.OS === 'ios' ? state.storeUrl : state.storeUrl;
  return (
    <Modal
      visible
      transparent={false}
      animationType="fade"
      onRequestClose={() => {
        // Intentionally empty — required update cannot be dismissed
      }}
      statusBarTranslucent
    >
      <View style={forceUpdateStyles.root}>
        <View style={forceUpdateStyles.card}>
          <Text style={forceUpdateStyles.icon}>⬆</Text>
          <Text style={forceUpdateStyles.title}>{state.title}</Text>
          <Text style={forceUpdateStyles.message}>{state.message}</Text>
          <Pressable
            style={forceUpdateStyles.button}
            onPress={() => { Linking.openURL(storeUrl).catch(() => {}); }}
            accessibilityLabel="Update the app now"
            accessibilityRole="button"
          >
            <Text style={forceUpdateStyles.buttonText}>Update Now</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const forceUpdateStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#063B21',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#063B21',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#063B21',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
});

// Mounted inside QueryClientProvider — manages the Pusher connection and seeds the
// unread notification count for the entire session. Both hooks are no-ops until
// the user logs in (userId becomes non-null).
function AppShell(): React.JSX.Element {
  useAppUpdate();
  useOtaUpdate();
  usePusherNotifications();
  usePushNotifications();
  useNotificationsData();
  const { forceUpdate, pendingAlert, dismissAlert } = useAppConfig();
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
      <Stack.Screen name="OtherServices"                 component={OtherServicesScreen} />
      <Stack.Screen name="EmbassyServices"               component={EmbassyServicesScreen} />
      <Stack.Screen name="CompanyServices"               component={CompanyServicesScreen} />
      <Stack.Screen name="PassportCiServices"            component={PassportCiServicesScreen} />
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
      <Stack.Screen name="PassportVault"                 component={guardedScreen(PassportVaultScreen)} />
      <Stack.Screen name="NinetyDayVault"                component={guardedScreen(NinetyDayVaultScreen)} />
      <Stack.Screen name="MyDocuments"                   component={guardedScreen(MyDocumentsScreen)} />
      <Stack.Screen name="MoiVerified"                   component={guardedScreen(MoiVerifiedScreen)} />
      <Stack.Screen name="BecomeMerchant"                component={guardedScreen(BecomeMerchantScreen)} />
      <Stack.Screen name="MerchantMenuCategories"        component={guardedScreen(MerchantMenuCategoriesScreen)} options={{ headerShown: false }} />
      <Stack.Screen name="AppVersion"                    component={AppVersionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UpdatePhone"                   component={guardedScreen(UpdatePhoneScreen)} options={{ headerShown: false }} />
      <Stack.Screen name="UpdateEmail"                   component={guardedScreen(UpdateEmailScreen)} options={{ headerShown: false }} />
      <Stack.Screen name="EmergencyContactList"          component={guardedScreen(EmergencyContactListScreen)} />
      <Stack.Screen name="EmergencyContactDetail"        component={guardedScreen(EmergencyContactDetailScreen)} />
      <Stack.Screen name="SafetyLocationList"            component={guardedScreen(SafetyLocationListScreen)} />
      <Stack.Screen name="SafetyLocationDetail"          component={guardedScreen(SafetyLocationDetailScreen)} />
      <Stack.Screen name="Food"                          component={FoodScreen} />
      <Stack.Screen name="RestaurantDetail"              component={RestaurantDetailScreen} />
      <Stack.Screen name="MenuItemDetail"                component={MenuItemDetailScreen} />
      <Stack.Screen name="RestaurantMap"                 component={RestaurantMapScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Cart"                           component={CartScreen} />
      <Stack.Screen name="FoodOrders"                    component={FoodOrdersScreen} />
      <Stack.Screen name="CartAndOrders"                 component={CartAndOrdersScreen} />
      <Stack.Screen name="Checkout"                      component={CheckoutScreen} />
      <Stack.Screen name="FoodOrderDetail"               component={FoodOrderDetailScreen} />
      <Stack.Screen name="OrderChat"                     component={OrderChatScreen} />
      <Stack.Screen name="AddressList"                   component={AddressListScreen} />
      <Stack.Screen name="AddEditAddress"                component={AddEditAddressScreen} />
      <Stack.Screen name="MapPicker"                     component={MapPickerScreen} options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
      <Stack.Screen name="Maintenance"                   component={MaintenanceScreen} options={{ animation: 'fade', gestureEnabled: false }} />
    </Stack.Navigator>
    <NoticeModal isVisible={noticeVisible} onClose={dismissNotice} />
    <InAppAlertModal alert={pendingAlert} onDismiss={dismissAlert} />
    {forceUpdate !== null && <ForceUpdateModal state={forceUpdate} />}
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
  const [initDone, setInitDone]     = useState(false);
  const [timerDone, setTimerDone]   = useState(false);
  const [splashGone, setSplashGone] = useState(false);
  const [nativeSplashHidden, setNativeSplashHidden] = useState(false);
  const { setUser } = useAuthStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fontsLoaded, fontError] = useFonts({ PlayfairDisplay_700Bold_Italic, PlayfairDisplay_700Bold });

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

        // Restore locale into memory + store without calling the backend —
        // the token isn't set yet so any API call here would trigger a spurious 401.
        const restoredLocale: Locale | null =
          localeVal === 'en' || localeVal === 'mm' || localeVal === 'th'
            ? (localeVal as Locale)
            : null;
        if (restoredLocale !== null) {
          setMemoryLocale(restoredLocale);
          useLocaleStore.setState({ locale: restoredLocale });
        }

        if (token !== null) {
          setMemoryToken(token);
          const user = await fetchMe();
          setUser(user, token);
          // Sync locale to backend now that the auth token is in memory.
          if (restoredLocale !== null) {
            apiClient.patch('/api/v1/profile/locale', { locale: restoredLocale }).catch(() => {});
          }
        }
      } catch (error: unknown) {
        const status = (error as { status?: number }).status;
        if (status === 401) {
          // Confirmed invalid token — clear it so the user starts fresh.
          await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
        }
        // Network failure or 5xx — keep the token; it may be valid once connectivity returns.
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
  const onSplashReady = useCallback(() => {
    if (nativeSplashHidden) return;
    setNativeSplashHidden(true);
    SplashScreen.setOptions({ fade: true, duration: 300 });
    SplashScreen.hideAsync().catch(() => {});
  }, [nativeSplashHidden]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef}>
            <StatusBar style="light" translucent />
            <BottomSheetModalProvider>
              {/* App shell is mounted immediately so navigation is ready; splash sits on top. */}
              <AppShell />
            </BottomSheetModalProvider>
          </NavigationContainer>
          {/* Inside SafeAreaProvider (for safe area insets) but outside
              NavigationContainer — places the tab bar in a separate hardware
              compositor layer above the Mapbox SurfaceView on Android.
              QueryClientProvider is now the outer wrapper so useFoodOrdersData
              (useQuery) inside RootFloatingTabBar can access the query client. */}
          <RootFloatingTabBar navigationRef={navigationRef} />
        </SafeAreaProvider>
      </QueryClientProvider>
      {/* Outside NavigationContainer so absoluteFillObject covers the full physical
          screen on Android (including status bar + gesture-nav bar areas). */}
      {!splashGone && (
        <AnimatedSplash canHide={canHide} onHidden={onSplashHidden} onReady={onSplashReady} />
      )}
    </GestureHandlerRootView>
  );
}
