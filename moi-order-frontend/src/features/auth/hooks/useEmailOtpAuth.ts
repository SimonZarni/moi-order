import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import { requestEmailOtp, verifyEmailOtp } from '@/shared/api/emailOtp';
import { useAuthStore } from '@/shared/store/authStore';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

export interface UseEmailOtpAuthOptions {
  purpose: 'login' | 'register';
}

export interface UseEmailOtpAuthResult {
  step: 'email' | 'code';
  email: string;
  code: string;
  name: string;
  errors: Record<string, string>;
  bannerError: string | null;
  isRequesting: boolean;
  isVerifying: boolean;
  resendSecondsLeft: number;
  handleEmailChange: (value: string) => void;
  handleCodeChange: (value: string) => void;
  handleNameChange: (value: string) => void;
  handleRequestOtp: () => Promise<void>;
  handleVerifyOtp: () => Promise<void>;
}

export function useEmailOtpAuth({ purpose }: UseEmailOtpAuthOptions): UseEmailOtpAuthResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendUntil, setResendUntil] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (resendUntil === null) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [resendUntil]);

  const resendSecondsLeft = useMemo(() => {
    if (resendUntil === null) return 0;
    return Math.max(0, Math.ceil((resendUntil - now) / 1000));
  }, [now, resendUntil]);

  const handleEmailChange = useCallback((value: string): void => {
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: '' }));
    setBannerError(null);
  }, []);

  const handleCodeChange = useCallback((value: string): void => {
    setCode(value);
    setErrors((prev) => ({ ...prev, code: '' }));
    setBannerError(null);
  }, []);

  const handleNameChange = useCallback((value: string): void => {
    setName(value);
    setErrors((prev) => ({ ...prev, name: '' }));
  }, []);

  const handleRequestOtp = useCallback(async (): Promise<void> => {
    if (isRequesting || resendSecondsLeft > 0) return;

    try {
      setBannerError(null);
      setErrors({});
      setIsRequesting(true);
      const response = await requestEmailOtp(email.trim(), purpose);
      setOtpRequestId(response.otp_request_id);
      setResendUntil(Date.now() + 60_000);
      setStep('code');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.errors) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          fieldErrors[field] = Array.isArray(messages) ? (messages[0] ?? '') : String(messages);
        });
        setErrors(fieldErrors);
      } else {
        setBannerError(apiError.message ?? 'Failed to send verification code.');
      }
    } finally {
      setIsRequesting(false);
    }
  }, [email, isRequesting, purpose, resendSecondsLeft]);

  const handleVerifyOtp = useCallback(async (): Promise<void> => {
    if (otpRequestId === null) {
      setBannerError('Please request a verification code first.');
      return;
    }

    try {
      setBannerError(null);
      setErrors({});
      setIsVerifying(true);
      const result = await verifyEmailOtp(
        otpRequestId,
        email.trim(),
        code.trim(),
        purpose,
        purpose === 'register' ? name.trim() : undefined,
      );
      queryClient.clear();
      setUser(result.user, result.token);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.errors) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          fieldErrors[field] = Array.isArray(messages) ? (messages[0] ?? '') : String(messages);
        });
        setErrors(fieldErrors);
      } else {
        setBannerError(apiError.message ?? 'Verification failed. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  }, [code, email, name, navigation, otpRequestId, purpose, queryClient, setUser]);

  return {
    step,
    email,
    code,
    name,
    errors,
    bannerError,
    isRequesting,
    isVerifying,
    resendSecondsLeft,
    handleEmailChange,
    handleCodeChange,
    handleNameChange,
    handleRequestOtp,
    handleVerifyOtp,
  };
}
