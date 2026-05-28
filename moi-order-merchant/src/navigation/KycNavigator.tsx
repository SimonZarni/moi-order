import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import type { KycStackParamList } from '../types/navigation';
import { KYC_STATUS } from '../types/enums';
import { KycWizardScreen } from '../features/kyc/screens/KycWizardScreen';
import { KycPendingScreen } from '../features/kyc/screens/KycPendingScreen';
import { colours } from '../shared/theme/colours';

const Stack = createNativeStackNavigator<KycStackParamList>();

export function KycNavigator(): React.JSX.Element {
  const kycStatus = useAuthStore((s) => s.user?.kyc_status);

  const initialRouteName: keyof KycStackParamList =
    kycStatus === KYC_STATUS.Submitted ||
    kycStatus === KYC_STATUS.UnderReview ||
    kycStatus === KYC_STATUS.Rejected
      ? 'KycPending'
      : 'KycWizard';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
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
