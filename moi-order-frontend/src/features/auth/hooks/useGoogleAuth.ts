import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

import { googleAuth } from '@/shared/api/auth';
import { useAuthStore } from '@/shared/store/authStore';
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
      const code = (error as { code?: string }).code;
      if (code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }
      setGoogleBannerError('Google sign-in failed. Please try again.');
    } finally {
      setIsGoogleSigningIn(false);
    }
  }, [navigation, setUser]);

  return { handleGoogleSignIn, isGoogleSigningIn, googleBannerError };
}
