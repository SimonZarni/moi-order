import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import * as AppleAuthentication from 'expo-apple-authentication';

import { GoogleSignin, statusCodes } from '@/shared/utils/googleSignin';
import { Line, lineErrorCodes } from '@/shared/utils/lineLogin';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { linkAppleAccount, linkGoogleAccount, linkLineAccount } from '@/shared/api/auth';
import { useAuthStore } from '@/shared/store/authStore';
import { ApiError } from '@/types/models';

export interface UseLinkedAccountsResult {
  isLinkingGoogle: boolean;
  isLinkingApple: boolean;
  isLinkingLine: boolean;
  linkError: string;
  handleLinkGoogle: () => Promise<void>;
  handleLinkApple: () => Promise<void>;
  handleLinkLine: () => Promise<void>;
}

export function useLinkedAccounts(): UseLinkedAccountsResult {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [isLinkingApple, setIsLinkingApple] = useState(false);
  const [isLinkingLine, setIsLinkingLine] = useState(false);
  const [linkError, setLinkError] = useState('');

  const syncUser = useCallback((user: Parameters<typeof setUser>[0], token: string | null = null): void => {
    queryClient.setQueryData(QUERY_KEYS.AUTH.ME, user);
    if (token !== null) {
      setUser(user, token);
    } else {
      useAuthStore.getState().updateUser(user);
    }
  }, [queryClient, setUser]);

  const handleLinkGoogle = useCallback(async (): Promise<void> => {
    try {
      setLinkError('');
      setIsLinkingGoogle(true);

      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      const { user } = await linkGoogleAccount(idToken);
      syncUser(user);
    } catch (error: unknown) {
      const asGoogle = error as { code?: string };
      if (asGoogle.code === statusCodes.SIGN_IN_CANCELLED) return;

      const apiError = error as ApiError;
      setLinkError(apiError.errors?.id_token?.[0] ?? apiError.message ?? 'Failed to link Google account.');
    } finally {
      setIsLinkingGoogle(false);
    }
  }, [syncUser]);

  const handleLinkApple = useCallback(async (): Promise<void> => {
    try {
      setLinkError('');
      setIsLinkingApple(true);

      if (Platform.OS !== 'ios') return;

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

      const { user } = await linkAppleAccount(
        credential.identityToken,
        credential.email ?? undefined,
        fullName !== '' ? fullName : undefined,
      );
      syncUser(user);
    } catch (error: unknown) {
      const asApple = error as { code?: string };
      if (asApple.code === 'ERR_REQUEST_CANCELED') return;

      const apiError = error as ApiError;
      setLinkError(apiError.errors?.id_token?.[0] ?? apiError.message ?? 'Failed to link Apple account.');
    } finally {
      setIsLinkingApple(false);
    }
  }, [syncUser]);

  const handleLinkLine = useCallback(async (): Promise<void> => {
    try {
      setLinkError('');
      setIsLinkingLine(true);

      const result = await Line.login({ scopes: ['profile', 'openid', 'email'] });
      const idToken = result.accessToken.idToken;
      if (!idToken) {
        throw new Error('Missing LINE identity token.');
      }

      const { user } = await linkLineAccount(
        idToken,
        result.idTokenNonce ?? result.IDTokenNonce,
        result.userProfile?.displayName,
      );
      syncUser(user);
    } catch (error: unknown) {
      const asLine = error as { code?: string };
      if (asLine.code === lineErrorCodes.CANCELLED) return;

      const apiError = error as ApiError;
      setLinkError(apiError.errors?.id_token?.[0] ?? apiError.message ?? 'Failed to link LINE account.');
    } finally {
      setIsLinkingLine(false);
    }
  }, [syncUser]);

  return {
    isLinkingGoogle,
    isLinkingApple,
    isLinkingLine,
    linkError,
    handleLinkGoogle,
    handleLinkApple,
    handleLinkLine,
  };
}
