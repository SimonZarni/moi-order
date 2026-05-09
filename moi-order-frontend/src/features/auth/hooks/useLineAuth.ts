import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import { lineAuth } from '@/shared/api/auth';
import { getAccountErrorMessage } from '@/shared/constants/errorCodes';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { Line, lineErrorCodes } from '@/shared/utils/lineLogin';

export interface UseLineAuthResult {
  handleLineSignIn: () => Promise<void>;
  isLineSigningIn: boolean;
  lineBannerError: string;
}

export function useLineAuth(): UseLineAuthResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const [isLineSigningIn, setIsLineSigningIn] = useState(false);
  const [lineBannerError, setLineBannerError] = useState('');

  const handleLineSignIn = useCallback(async (): Promise<void> => {
    try {
      setLineBannerError('');
      setIsLineSigningIn(true);

      const result = await Line.login({ scopes: ['profile', 'openid', 'email'] });
      const idToken = result.accessToken.idToken;

      if (!idToken) {
        throw new Error('Missing LINE identity token.');
      }

      // The nonce is required for backend replay-attack prevention.
      // Guard both SDK shape variants; throw rather than silently omitting it —
      // the backend should reject nonce-less LINE auth requests.
      const nonce = result.idTokenNonce ?? result.IDTokenNonce;
      if (!nonce) {
        throw new Error('Missing LINE nonce. Please try again.');
      }

      const { user, token } = await lineAuth(
        idToken,
        nonce,
        result.userProfile?.displayName,
      );

      queryClient.clear();
      setUser(user, token);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error: unknown) {
      const asLine = error as { code?: string };
      if (asLine.code === lineErrorCodes.CANCELLED) {
        return;
      }

      const asApiError = error as ApiError;
      if (typeof asApiError.status === 'number') {
        const fieldMessage = asApiError.errors?.id_token?.[0];
        const fallbackMessage = getAccountErrorMessage(asApiError.code, asApiError.context);
        const resolvedMessage = fieldMessage ?? asApiError.message ?? fallbackMessage;

        setLineBannerError(resolvedMessage);
      } else {
        setLineBannerError('LINE sign-in failed. Please try again.');
      }
    } finally {
      setIsLineSigningIn(false);
    }
  }, [navigation, queryClient, setUser]);

  return { handleLineSignIn, isLineSigningIn, lineBannerError };
}
