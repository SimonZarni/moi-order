/**
 * Principle: SRP — entry point wires providers + auth-aware navigation only; zero business logic.
 * Auth restore: on mount, reads token from SecureStore → calls /me → populates authStore.
 *   Shows a blank teal splash while initialising to avoid flash of wrong screen.
 * Provider order (outermost → innermost):
 *   SafeAreaProvider → QueryClientProvider → NavigationContainer → Stack
 */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { setMemoryToken } from '@/shared/api/client';
import { fetchMe } from '@/shared/api/auth';
import { TOKEN_KEY, CACHE_TTL } from '@/shared/constants/config';
import { useAuthStore } from '@/shared/store/authStore';
import { colours } from '@/shared/theme/colours';

import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { RegisterScreen } from '@/features/auth/screens/RegisterScreen';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { NinetyDayReportScreen } from '@/features/ninetyDayReport/screens/NinetyDayReportScreen';
import { NinetyDayReportFormScreen } from '@/features/ninetyDayReport/screens/NinetyDayReportFormScreen';
import { OtherServicesScreen } from '@/features/otherServices/screens/OtherServicesScreen';
import { CompanyRegistrationFormScreen } from '@/features/companyRegistration/screens/CompanyRegistrationFormScreen';
import { PlaceDetailScreen } from '@/features/places/screens/PlaceDetailScreen';
import { PlacesScreen } from '@/features/places/screens/PlacesScreen';

import { RootStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: CACHE_TTL.USER_DATA,
    },
  },
});

export default function App(): React.JSX.Element {
  const [isInitializing, setIsInitializing] = useState(true);
  const { isLoggedIn, setUser } = useAuthStore();

  useEffect(() => {
    async function restoreSession(): Promise<void> {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token !== null) {
          setMemoryToken(token);
          const user = await fetchMe();
          setUser(user, token);
        }
      } catch {
        // Token expired or invalid — clear silently; user will see Login.
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
          <Stack.Navigator
            initialRouteName={isLoggedIn ? 'Home' : 'Login'}
            screenOptions={{ headerShown: false, animation: 'fade' }}
          >
            {isLoggedIn ? (
              <>
                <Stack.Screen name="Home"               component={HomeScreen} />
                <Stack.Screen name="NinetyDayReport"    component={NinetyDayReportScreen} />
                <Stack.Screen name="NinetyDayReportForm"       component={NinetyDayReportFormScreen} />
                <Stack.Screen name="OtherServices"             component={OtherServicesScreen} />
                <Stack.Screen name="CompanyRegistrationForm"   component={CompanyRegistrationFormScreen} />
                <Stack.Screen name="Places"                    component={PlacesScreen} />
                <Stack.Screen name="PlaceDetail"        component={PlaceDetailScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="Login"    component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
