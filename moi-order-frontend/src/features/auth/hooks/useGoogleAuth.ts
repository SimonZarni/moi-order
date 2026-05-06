import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { GoogleSignin, statusCodes } from '@/shared/utils/googleSignin';

import { googleAuth } from '@/shared/api/auth';
import { useAuthStore } from '@/shared/store/authStore';
import { getAccountErrorMessage } from '@/shared/constants/errorCodes';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

export interface UseGoogleAuthResult {
  handleGoogleSignIn: () => Promise<void>;
  isGoogleSigningIn: boolean;
  googleBannerError: string;
}

export function useGoogleAuth(loginHint?: string): UseGoogleAuthResult {
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [googleBannerError, setGoogleBannerError] = useState('');

  const handleGoogleSignIn = useCallback(async (): Promise<void> => {
    try {
      setGoogleBannerError('');
      setIsGoogleSigningIn(true);

      await GoogleSignin.hasPlayServices();

      if (loginHint) {
        // Email was explicitly confirmed as a Google account — try silent first
        // for a seamless re-auth on the owner's device.
        // loginHint is only supported on iOS; on Android just show the picker.
        try {
          await GoogleSignin.signInSilently();
        } catch {
          await GoogleSignin.signOut();
          if (Platform.OS === 'ios') {
            await GoogleSignin.signIn({ loginHint });
          } else {
            await GoogleSignin.signIn();
          }
        }
      } else {
        // No email context (button tapped directly) — always show the full
        // account picker so the user consciously chooses which account to use.
        await GoogleSignin.signOut();
        await GoogleSignin.signIn();
      }

      const { idToken } = await GoogleSignin.getTokens();

      const { user, token } = await googleAuth(idToken);
      queryClient.clear();
      setUser(user, token);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error: unknown) {
      const asGoogle = error as { code?: string };
      if (asGoogle.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }

      const asApiError = error as ApiError;
      if (typeof asApiError.status === 'number') {
        setGoogleBannerError(getAccountErrorMessage(asApiError.code, asApiError.context));
      } else {
        setGoogleBannerError('Google sign-in failed. Please try again.');
      }
    } finally {
      setIsGoogleSigningIn(false);
    }
  }, [navigation, queryClient, setUser, loginHint]);

  return { handleGoogleSignIn, isGoogleSigningIn, googleBannerError };
}
