import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';

import { useEmailOtpForm, UseEmailOtpFormResult } from './useEmailOtpForm';
import { sendEmailOtp, verifyEmailOtp } from '@/shared/api/emailAuth';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { MESSAGES } from '@/shared/constants/messages';

const RESEND_COOLDOWN = 30;
type RouteParams = RouteProp<RootStackParamList, 'EmailOtp'>;

export interface UseEmailOtpScreenResult {
  form: UseEmailOtpFormResult['form'];
  email: string;
  isVerifying: boolean;
  isResending: boolean;
  resendSecondsLeft: number;
  bannerError: string;
  handleOtpChange: (value: string) => void;
  handleVerify: () => void;
  handleResend: () => void;
  handleBack: () => void;
}

export function useEmailOtpScreen(): UseEmailOtpScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { email, purpose, name } = useRoute<RouteParams>().params;
  const { form, handleOtpChange, validate, applyApiError } = useEmailOtpForm();
  const [bannerError, setBannerError] = useState('');
  const [resendSecondsLeft, setResendSecondsLeft] = useState(RESEND_COOLDOWN);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setResendSecondsLeft((prev) => (prev <= 1 ? (clearInterval(timerRef.current!), 0) : prev - 1));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const { mutate: verify, isPending: isVerifying } = useMutation({
    mutationFn: () => verifyEmailOtp(email, form.otp, purpose),
    onSuccess: ({ verified_token }) => {
      navigation.navigate('SetPassword', { email, verifiedToken: verified_token, purpose, ...(name !== undefined && { name }) });
    },
    onError: (error: ApiError) => {
      if (error.status === 422 && error.errors !== undefined) {
        applyApiError(error.errors);
      } else {
        setBannerError(error.message ?? MESSAGES.genericError);
      }
    },
  });

  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: () => sendEmailOtp(email, purpose),
    onSuccess: () => {
      setResendSecondsLeft(RESEND_COOLDOWN);
      timerRef.current = setInterval(() => {
        setResendSecondsLeft((prev) => (prev <= 1 ? (clearInterval(timerRef.current!), 0) : prev - 1));
      }, 1000);
    },
    onError: (error: ApiError) => {
      setBannerError(error.message ?? MESSAGES.genericError);
    },
  });

  const handleVerify = useCallback((): void => {
    setBannerError('');
    if (validate()) verify();
  }, [validate, verify]);

  const handleResend = useCallback((): void => {
    setBannerError('');
    resend();
  }, [resend]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return {
    form,
    email,
    isVerifying,
    isResending,
    resendSecondsLeft,
    bannerError,
    handleOtpChange,
    handleVerify,
    handleResend,
    handleBack,
  };
}
