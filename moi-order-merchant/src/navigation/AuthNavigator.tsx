import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../types/navigation';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { OtpLoginScreen } from '../features/auth/screens/OtpLoginScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import { colours } from '../shared/theme/colours';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colours.backgroundDark },
        headerTintColor: colours.textOnDark,
        headerTitleStyle: { color: colours.textOnDark },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OtpLogin"
        component={OtpLoginScreen}
        options={{ title: 'Phone Login' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
    </Stack.Navigator>
  );
}
