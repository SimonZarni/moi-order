import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../types/navigation';
import { signInWithPassword } from '../../../api/auth';
import { useAuthStore } from '../../../store/authStore';
import { extractApiError } from '../../../api/client';

interface UseLoginScreenResult {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handleSubmit: () => Promise<void>;
  handleGoToOtp: () => void;
  handleGoToRegister: () => void;
}

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function useLoginScreen(): UseLoginScreenResult {
  const navigation = useNavigation<Nav>();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    error,
    setEmail,
    setPassword,
    handleSubmit,
    handleGoToOtp,
    handleGoToRegister,
  };
}
