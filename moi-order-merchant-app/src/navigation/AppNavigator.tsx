import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../api/auth';
import { QUERY_KEYS } from '../shared/constants/queryKeys';
import { CACHE_TTL } from '../shared/constants/config';
import { colours } from '../shared/theme/colours';
import { AuthNavigator } from './AuthNavigator';
import { KycNavigator } from './KycNavigator';
import { MerchantTabsNavigator } from './MerchantTabsNavigator';
import { KYC_STATUS } from '../types/enums';
import type { RootStackParamList } from '../types/navigation';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator(): React.JSX.Element {
  const { token, user, isLoading, initFromStorage, setUser } = useAuthStore();

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

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
