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

/**
 * Extract idToken from a GoogleSignin.signIn() result.
 * The SDK shape changed across versions:
 *   v11- : result is GoogleUser with result.idToken
 *   v12+ : result is { type, data } with result.data?.idToken
 * We try both shapes to stay compatible.
 */
function extractIdToken(signInResult: unknown): string | null {
  if (!signInResult || typeof signInResult !== 'object') return null;
  const r = signInResult as Record<string, unknown>;
  // v12+ shape
  if (r['data'] && typeof r['data'] === 'object') {
    const token = (r['data'] as Record<string, unknown>)['idToken'];
    if (typeof token === 'string') return token;
  }
  // v11- shape
  if (typeof r['idToken'] === 'string') return r['idToken'];
  return null;
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

      let idToken: string | null = null;

      if (loginHint) {
        // Confirmed Google account — try silent first, fall back to interactive.
        try {
          const silentResult = await GoogleSignin.signInSilently();
          if (silentResult.data?.user?.email?.toLowerCase() !== loginHint.toLowerCase()) {
            throw new Error('account_mismatch');
          }
          idToken = extractIdToken(silentResult);
        } catch {
          await GoogleSignin.signOut();
          const result = Platform.OS === 'ios'
            ? await GoogleSignin.signIn({ loginHint })
            : await GoogleSignin.signIn();
          idToken = extractIdToken(result);
        }
      } else {
        // Register / direct sign-in — show full account picker.
        // Never call getTokens() after signIn() on iOS: it throws a JSI error
        // because the native session may not be fully committed yet.
        // The idToken is always present in the signIn() result when webClientId is set.
        const result = await GoogleSignin.signIn();
        idToken = extractIdToken(result);
      }

      if (!idToken) throw new Error('no_id_token');

      const { user, token } = await googleAuth(idToken);
      queryClient.clear();
      setUser(user, token);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error: unknown) {
      console.error('[GoogleAuth]', String(error),
        'code:', (error as { code?: string })?.code,
        'msg:', error instanceof Error ? error.message : 'none',
      );

      const asGoogle = error as { code?: string };
      if (asGoogle.code === statusCodes.SIGN_IN_CANCELLED) return;

      const asApiError = error as ApiError;
      if (typeof asApiError.status === 'number') {
        setGoogleBannerError(getAccountErrorMessage(asApiError.code, asApiError.context));
        return;
      }

      setGoogleBannerError('Google sign-in failed. Please try again.');
    } finally {
      setIsGoogleSigningIn(false);
    }
  }, [navigation, queryClient, setUser]);

  return { handleGoogleSignIn, isGoogleSigningIn, googleBannerError };
}
