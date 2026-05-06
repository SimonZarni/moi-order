import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { requestEmailUpdateOtp, updateEmail, EmailOtpResult } from '@/shared/api/profile';
import { useAuthStore } from '@/shared/store/authStore';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { ApiError, User } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { MESSAGES } from '@/shared/constants/messages';

export interface UseUpdateEmailScreenResult {
  email: string;
  otp: string;
  emailError: string | null;
  otpError: string | null;
  bannerError: string;
  otpSent: boolean;
  expiresIn: number | null;
  resendAfter: number | null;
  isSendingOtp: boolean;
  isUpdating: boolean;
  handleEmailChange: (value: string) => void;
  handleOtpChange: (value: string) => void;
  handleRequestOtp: () => void;
  handleUpdateEmail: () => void;
  handleBack: () => void;
}

export function useUpdateEmailScreen(): UseUpdateEmailScreenResult {
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  const [email, setEmail]             = useState('');
  const [otp, setOtp]                 = useState('');
  const [emailError, setEmailError]   = useState<string | null>(null);
  const [otpError, setOtpError]       = useState<string | null>(null);
  const [bannerError, setBannerError] = useState('');
  const [otpSent, setOtpSent]         = useState(false);
  const [expiresIn, setExpiresIn]     = useState<number | null>(null);
  const [resendAfter, setResendAfter] = useState<number | null>(null);

  const { mutate: sendOtp, isPending: isSendingOtp } = useMutation({
    mutationFn: () => requestEmailUpdateOtp(email.trim().toLowerCase()),
    onSuccess: (result: EmailOtpResult) => {
      setBannerError('');
      setOtpSent(true);
      setExpiresIn(result.expires_in);
      setResendAfter(result.resend_after);
      setOtp('');
      setOtpError(null);
    },
    onError: (error: ApiError) => {
      if (error.status === 422 && error.errors !== undefined) {
        setEmailError(error.errors['email']?.[0] ?? null);
      } else if (error.status === 409) {
        setEmailError(error.message ?? MESSAGES.genericError);
      } else {
        setBannerError(error.message ?? MESSAGES.genericError);
      }
    },
  });

  const { mutate: submitUpdate, isPending: isUpdating } = useMutation({
    mutationFn: () => updateEmail(email.trim().toLowerCase(), otp.trim()),
    onSuccess: (user: User) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, user);
      updateUser(user);
      navigation.goBack();
    },
    onError: (error: ApiError) => {
      if (error.status === 422 && error.errors !== undefined) {
        setOtpError(error.errors['otp']?.[0] ?? error.errors['email']?.[0] ?? null);
      } else {
        setBannerError(error.message ?? MESSAGES.genericError);
      }
    },
  });

  const handleEmailChange = useCallback((value: string): void => {
    setEmail(value);
    setEmailError(null);
    setBannerError('');
    setOtpSent(false);
    setExpiresIn(null);
    setResendAfter(null);
    setOtp('');
    setOtpError(null);
  }, []);

  const handleOtpChange = useCallback((value: string): void => {
    setOtp(value);
    setOtpError(null);
  }, []);

  const handleRequestOtp = useCallback((): void => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError('Email address is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Email address must be valid.');
      return;
    }
    sendOtp();
  }, [email, sendOtp]);

  const handleUpdateEmail = useCallback((): void => {
    if (!otp.trim()) {
      setOtpError('Verification code is required.');
      return;
    }
    submitUpdate();
  }, [otp, submitUpdate]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return {
    email,
    otp,
    emailError,
    otpError,
    bannerError,
    otpSent,
    expiresIn,
    resendAfter,
    isSendingOtp,
    isUpdating,
    handleEmailChange,
    handleOtpChange,
    handleRequestOtp,
    handleUpdateEmail,
    handleBack,
  };
}
