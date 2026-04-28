import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import { appleAuth } from '@/shared/api/auth';
import { useAuthStore } from '@/shared/store/authStore';
import { getAccountErrorMessage } from '@/shared/constants/errorCodes';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

export interface UseAppleAuthResult {
  handleAppleSignIn: () => Promise<void>;
  isAppleSigningIn: boolean;
  appleBannerError: string;
}

export function useAppleAuth(): UseAppleAuthResult {
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const [isAppleSigningIn, setIsAppleSigningIn] = useState(false);
  const [appleBannerError, setAppleBannerError] = useState('');

  const handleAppleSignIn = useCallback(async (): Promise<void> => {
    if (Platform.OS !== 'ios') return;

    try {
      setAppleBannerError('');
      setIsAppleSigningIn(true);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('Missing Apple identity token.');
      }

      const fullName = [credential.fullName?.givenName, credential.fullName?.familyName]
        .filter(Boolean)
        .join(' ')
        .trim();

      const { user, token } = await appleAuth(
        credential.identityToken,
        credential.email ?? undefined,
        fullName !== '' ? fullName : undefined,
      );

      queryClient.clear();
      setUser(user, token);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error: unknown) {
      const asApple = error as { code?: string };
      if (asApple.code === 'ERR_REQUEST_CANCELED') {
        return;
      }

      const asApiError = error as ApiError;
      if (typeof asApiError.status === 'number') {
        setAppleBannerError(getAccountErrorMessage(asApiError.code, asApiError.context));
      } else {
        setAppleBannerError('Apple sign-in failed. Please try again.');
      }
    } finally {
      setIsAppleSigningIn(false);
    }
  }, [navigation, queryClient, setUser]);

  return { handleAppleSignIn, isAppleSigningIn, appleBannerError };
}
