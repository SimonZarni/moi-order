import { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as AppleAuthentication from 'expo-apple-authentication';
import type { AuthStackParamList } from '../../../types/navigation';
import {
  signInWithPassword,
  signInWithGoogle,
  signInWithApple,
  signInWithLine,
} from '../../../api/auth';
import { useAuthStore } from '../../../store/authStore';
import { extractApiError } from '../../../api/client';
import { GoogleSignin, statusCodes } from '../../../shared/utils/googleSignin';
import { signInWithGoogleWeb, GOOGLE_WEB_CANCELLED } from '../../../shared/utils/googleSigninWeb';
import { Line, lineErrorCodes } from '../../../shared/utils/lineLogin';
import {
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  LINE_CHANNEL_ID,
} from '../../../shared/constants/config';

interface UseLoginScreenResult {
  email: string;
  password: string;
  isLoading: boolean;
  isGoogleLoading: boolean;
  isAppleLoading: boolean;
  isLineLoading: boolean;
  appleAvailable: boolean;
  error: string | null;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handleSubmit: () => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
  handleAppleSignIn: () => Promise<void>;
  handleLineSignIn: () => Promise<void>;
  handleGoToOtp: () => void;
  handleGoToRegister: () => void;
}

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function useLoginScreen(): UseLoginScreenResult {
  const navigation = useNavigation<Nav>();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [isGoogleLoading, setGoogleL] = useState(false);
  const [isAppleLoading, setAppleL]   = useState(false);
  const [isLineLoading, setLineL]     = useState(false);
  const [appleAvailable, setAppleAv]  = useState(false);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
    });
    Line.setup({ channelId: LINE_CHANNEL_ID }).catch(() => {});
    if (Platform.OS === 'ios') {
      AppleAuthentication.isAvailableAsync().then(setAppleAv).catch(() => {});
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!email.trim() || !password) return;
    setIsLoading(true);
    setError(null);
    try {
      const { user, token } = await signInWithPassword(email.trim(), password);
      setAuth(user, token);
    } catch (e) {
      setError(extractApiError(e).message);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, setAuth]);

  const handleGoogleSignIn = useCallback(async () => {
    setGoogleL(true);
    setError(null);
    try {
      let idToken: string;
      if (Platform.OS === 'web') {
        idToken = await signInWithGoogleWeb(GOOGLE_WEB_CLIENT_ID);
      } else {
        await GoogleSignin.hasPlayServices();
        const { data } = await GoogleSignin.signIn();
        idToken = data?.idToken ?? '';
        if (!idToken) throw new Error('Google sign-in returned no ID token.');
      }
      const { user, token } = await signInWithGoogle(idToken);
      setAuth(user, token);
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code;
      if (code === statusCodes.SIGN_IN_CANCELLED || code === GOOGLE_WEB_CANCELLED) return;
      setError(e instanceof Error ? e.message : extractApiError(e).message);
    } finally {
      setGoogleL(false);
    }
  }, [setAuth]);

  const handleAppleSignIn = useCallback(async () => {
    if (Platform.OS === 'web') {
      setError('Apple sign-in is not yet supported in the browser. Please use the Moi Order mobile app.');
      return;
    }
    setAppleL(true);
    setError(null);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const name = [
        credential.fullName?.givenName,
        credential.fullName?.familyName,
      ]
        .filter(Boolean)
        .join(' ') || undefined;

      const { user, token } = await signInWithApple(
        credential.identityToken ?? '',
        credential.email ?? undefined,
        name,
      );
      setAuth(user, token);
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code;
      if (code === 'ERR_REQUEST_CANCELED') return;
      setError(e instanceof Error ? e.message : extractApiError(e).message);
    } finally {
      setAppleL(false);
    }
  }, [setAuth]);

  const handleLineSignIn = useCallback(async () => {
    setLineL(true);
    setError(null);
    try {
      const result = await Line.login({ scopes: ['profile', 'openid', 'email'] });
      const idToken = result.accessToken.idToken;
      const nonce   = result.idTokenNonce ?? result.IDTokenNonce;
      if (!idToken) throw new Error('LINE sign-in returned no ID token.');
      const { user, token } = await signInWithLine(
        idToken,
        nonce,
        result.userProfile?.displayName,
      );
      setAuth(user, token);
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code;
      if (code === lineErrorCodes.CANCELLED) return;
      setError(e instanceof Error ? e.message : extractApiError(e).message);
    } finally {
      setLineL(false);
    }
  }, [setAuth]);

  const handleGoToOtp = useCallback(() => {
    navigation.navigate('OtpLogin', {});
  }, [navigation]);

  const handleGoToRegister = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  return {
    email,
    password,
    isLoading,
    isGoogleLoading,
    isAppleLoading,
    isLineLoading,
    appleAvailable,
    error,
    setEmail,
    setPassword,
    handleSubmit,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleLineSignIn,
    handleGoToOtp,
    handleGoToRegister,
  };
}
