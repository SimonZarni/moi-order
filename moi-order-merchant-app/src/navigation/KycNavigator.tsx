import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { KycStackParamList } from '../types/navigation';
import { KycWizardScreen } from '../features/kyc/screens/KycWizardScreen';
import { KycPendingScreen } from '../features/kyc/screens/KycPendingScreen';
import { colours } from '../shared/theme/colours';

const Stack = createNativeStackNavigator<KycStackParamList>();

export function KycNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colours.backgroundDark },
        headerTintColor: colours.textOnDark,
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="KycWizard"
        component={KycWizardScreen}
        options={{ title: 'Business Verification', headerBackVisible: false }}
      />
      <Stack.Screen
        name="KycPending"
        component={KycPendingScreen}
        options={{ title: 'Application Status', headerBackVisible: false }}
      />
    </Stack.Navigator>
  );
}
