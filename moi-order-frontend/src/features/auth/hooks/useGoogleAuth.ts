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
  handleGoogleSignIn: (loginHint?: string) => Promise<void>;
  isGoogleSigningIn: boolean;
  googleBannerError: string;
}

export function useGoogleAuth(): UseGoogleAuthResult {
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [googleBannerError, setGoogleBannerError] = useState('');

  const handleGoogleSignIn = useCallback(async (loginHint?: string): Promise<void> => {
    try {
      setGoogleBannerError('');
      setIsGoogleSigningIn(true);

      await GoogleSignin.hasPlayServices();

      if (loginHint) {
        // Email was explicitly confirmed as a Google account by check-email — try
        // silent sign-in first for a seamless re-auth on the owner's device.
        // loginHint is only supported on iOS; on Android just show the picker.
        try {
          const silentResult = await GoogleSignin.signInSilently();
          // Ensure the cached session belongs to the expected account.
          // signInSilently() returns the last signed-in user regardless of loginHint.
          if (silentResult.data?.user?.email?.toLowerCase() !== loginHint.toLowerCase()) {
            throw new Error('account_mismatch');
          }
        } catch {
          await GoogleSignin.signOut();
          if (Platform.OS === 'ios') {
            await GoogleSignin.signIn({ loginHint });
          } else {
            await GoogleSignin.signIn();
          }
        }
      } else {
        // No confirmed email context — show the full account picker.
        // signOut() is best-effort: if there is no active session it may throw,
        // which is fine — we just want to clear any cached selection.
        try { await GoogleSignin.signOut(); } catch { /* no active session */ }
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
        return;
      }

      // On Android, signIn() sometimes throws after the sign-in has already
      // completed and the backend has already created the account. Recover by
      // checking for an active Google session and retrying the backend call.
      try {
        const tokens = await GoogleSignin.getTokens();
        if (tokens.idToken) {
          const { user, token } = await googleAuth(tokens.idToken);
          queryClient.clear();
          setUser(user, token);
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
          return;
        }
      } catch (recoveryError: unknown) {
        const recoveryApiError = recoveryError as ApiError;
        if (typeof recoveryApiError.status === 'number') {
          setGoogleBannerError(getAccountErrorMessage(recoveryApiError.code, recoveryApiError.context));
          return;
        }
      }

      setGoogleBannerError('Google sign-in failed. Please try again.');
    } finally {
      setIsGoogleSigningIn(false);
    }
  }, [navigation, queryClient, setUser]);

  return { handleGoogleSignIn, isGoogleSigningIn, googleBannerError };
}
