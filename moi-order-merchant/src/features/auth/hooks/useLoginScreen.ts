import { useState, useCallback, useEffect, useRef } from 'react';
import { Platform, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as AppleAuthentication from 'expo-apple-authentication';
import type { AuthStackParamList } from '../../../types/navigation';
import {
  signInWithPassword,
  signInWithGoogle,
  signInWithApple,
  signInWithLine,
  signInWithLineWebCode,
} from '../../../api/auth';
import { useAuthStore } from '../../../store/authStore';
import { extractApiError } from '../../../api/client';
import { DOMAIN_MESSAGES } from '../../../shared/constants/messages';
import { GoogleSignin, statusCodes } from '../../../shared/utils/googleSignin';
import { signInWithGoogleWeb, GOOGLE_WEB_CANCELLED } from '../../../shared/utils/googleSigninWeb';
import { signInWithAppleWeb, APPLE_WEB_CANCELLED } from '../../../shared/utils/appleSigninWeb';
import { signInWithLineWeb, LINE_WEB_CANCELLED } from '../../../shared/utils/lineSigninWeb';
import { Line, lineErrorCodes } from '../../../shared/utils/lineLogin';
import {
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  LINE_CHANNEL_ID,
  LINE_WEB_REDIRECT_URI,
  APPLE_WEB_CLIENT_ID,
  APPLE_WEB_REDIRECT_URI,
} from '../../../shared/constants/config';

interface UseLoginScreenResult {
  email: string;
  password: string;
  showPassword: boolean;
  passwordInputRef: React.RefObject<TextInput | null>;
  isLoading: boolean;
  isGoogleLoading: boolean;
  isAppleLoading: boolean;
  isLineLoading: boolean;
  appleAvailable: boolean;
  error: string | null;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handleTogglePassword: () => void;
  handleSubmit: () => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
  handleAppleSignIn: () => Promise<void>;
  handleLineSignIn: () => Promise<void>;
  handleGoToOtp: () => void;
  handleGoToRegister: () => void;
}

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

function resolveSocialError(e: unknown): string {
  const api = extractApiError(e);
  // extractApiError returns the generic fallback for plain Errors; use the
  // original message instead so stub/SDK errors surface correctly.
  if (api.status === 0 && e instanceof Error) return e.message;
  return DOMAIN_MESSAGES[api.code ?? ''] ?? api.message;
}

export function useLoginScreen(): UseLoginScreenResult {
  const navigation = useNavigation<Nav>();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const passwordInputRef = useRef<TextInput>(null);
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

  const handleTogglePassword = useCallback(() => setShowPassword((v) => !v), []);

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
      setError(resolveSocialError(e));
    } finally {
      setGoogleL(false);
    }
  }, [setAuth]);

  const handleAppleSignIn = useCallback(async () => {
    setAppleL(true);
    setError(null);
    try {
      let idToken: string;
      let name: string | undefined;
      let email: string | undefined;

      if (Platform.OS === 'web') {
        const result = await signInWithAppleWeb(APPLE_WEB_CLIENT_ID, APPLE_WEB_REDIRECT_URI);
        idToken = result.idToken;
        name    = result.name;
        email   = result.email;
      } else {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
        idToken = credential.identityToken ?? '';
        email   = credential.email ?? undefined;
        name    = [credential.fullName?.givenName, credential.fullName?.familyName]
          .filter(Boolean)
          .join(' ') || undefined;
      }

      const { user, token } = await signInWithApple(idToken, email, name);
      setAuth(user, token);
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code;
      if (code === 'ERR_REQUEST_CANCELED' || code === APPLE_WEB_CANCELLED) return;
      setError(resolveSocialError(e));
    } finally {
      setAppleL(false);
    }
  }, [setAuth]);

  const handleLineSignIn = useCallback(async () => {
    setLineL(true);
    setError(null);
    try {
      if (Platform.OS === 'web') {
        const result = await signInWithLineWeb(LINE_CHANNEL_ID, LINE_WEB_REDIRECT_URI);
        const { user, token } = await signInWithLineWebCode(result.code, result.redirectUri, result.nonce);
        setAuth(user, token);
      } else {
        const result = await Line.login({ scopes: ['profile', 'openid', 'email'] });
        const idToken     = result.accessToken.idToken ?? '';
        const nonce       = result.idTokenNonce ?? result.IDTokenNonce;
        const displayName = result.userProfile?.displayName;
        if (!idToken) throw new Error('LINE sign-in returned no ID token.');
        const { user, token } = await signInWithLine(idToken, nonce, displayName);
        setAuth(user, token);
      }
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code;
      if (code === lineErrorCodes.CANCELLED || code === LINE_WEB_CANCELLED) return;
      setError(resolveSocialError(e));
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
    showPassword,
    passwordInputRef,
    isLoading,
    isGoogleLoading,
    isAppleLoading,
    isLineLoading,
    appleAvailable,
    error,
    setEmail,
    setPassword,
    handleTogglePassword,
    handleSubmit,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleLineSignIn,
    handleGoToOtp,
    handleGoToRegister,
  };
}
