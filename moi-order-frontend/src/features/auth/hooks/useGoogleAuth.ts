import { useCallback, useState } from 'react';
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

export function useGoogleAuth(): UseGoogleAuthResult {
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
      await GoogleSignin.signOut();
      await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();

      const { user, token } = await googleAuth(idToken);
      queryClient.clear();
      setUser(user, token);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error: unknown) {
      // Google SDK errors carry a string `code` but no numeric `status`.
      // ApiErrors (from our backend) carry both `code` and `status`.
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
  }, [navigation, setUser]);

  return { handleGoogleSignIn, isGoogleSigningIn, googleBannerError };
}
