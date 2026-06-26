import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  requestEmailUpdateOtp,
  updateEmail,
  requestEmailRemovalOtp,
  removeEmail,
  EmailOtpResult,
} from '@/shared/api/profile';
import { useAuthStore } from '@/shared/store/authStore';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { ApiError, User } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { MESSAGES } from '@/shared/constants/messages';

export interface UseUpdateEmailScreenResult {
  // ── Update flow ───────────────────────────────────────────────────────────
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
  // ── Removal flow ──────────────────────────────────────────────────────────
  canRemoveEmail: boolean;
  currentEmail: string | null;
  removeOtp: string;
  removeOtpError: string | null;
  removeBannerError: string;
  removeSent: boolean;
  removeExpiresIn: number | null;
  isRequestingRemoval: boolean;
  isRemoving: boolean;
  handleRequestRemovalOtp: () => void;
  handleRemoveOtpChange: (value: string) => void;
  handleConfirmRemoval: () => void;
}

const PLACEHOLDER_SUFFIX = '@users.moiorder.local';

export function useUpdateEmailScreen(): UseUpdateEmailScreenResult {
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { updateUser, user } = useAuthStore();

  // ── Update flow state ────────────────────────────────────────────────────
  const [email, setEmail]             = useState('');
  const [otp, setOtp]                 = useState('');
  const [emailError, setEmailError]   = useState<string | null>(null);
  const [otpError, setOtpError]       = useState<string | null>(null);
  const [bannerError, setBannerError] = useState('');
  const [otpSent, setOtpSent]         = useState(false);
  const [expiresIn, setExpiresIn]     = useState<number | null>(null);
  const [resendAfter, setResendAfter] = useState<number | null>(null);

  // ── Removal flow state ───────────────────────────────────────────────────
  const [removeOtp, setRemoveOtp]                 = useState('');
  const [removeOtpError, setRemoveOtpError]       = useState<string | null>(null);
  const [removeBannerError, setRemoveBannerError] = useState('');
  const [removeSent, setRemoveSent]               = useState(false);
  const [removeExpiresIn, setRemoveExpiresIn]     = useState<number | null>(null);

  // Treat placeholder and null email the same — user has no real email
  const currentEmail = (user?.email && !user.email.endsWith(PLACEHOLDER_SUFFIX))
    ? user.email
    : null;

  const canRemoveEmail = currentEmail !== null;

  // ── Update mutations ─────────────────────────────────────────────────────
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
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, updatedUser);
      updateUser(updatedUser);
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

  // ── Removal mutations ────────────────────────────────────────────────────
  const { mutate: sendRemovalOtp, isPending: isRequestingRemoval } = useMutation({
    mutationFn: () => requestEmailRemovalOtp(),
    onSuccess: (result: EmailOtpResult) => {
      setRemoveBannerError('');
      setRemoveSent(true);
      setRemoveExpiresIn(result.expires_in);
      setRemoveOtp('');
      setRemoveOtpError(null);
    },
    onError: (error: ApiError) => {
      setRemoveBannerError(error.message ?? MESSAGES.genericError);
    },
  });

  const { mutate: submitRemoval, isPending: isRemoving } = useMutation({
    mutationFn: () => removeEmail(removeOtp.trim()),
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, updatedUser);
      updateUser(updatedUser);
      navigation.goBack();
    },
    onError: (error: ApiError) => {
      if (error.status === 422 && error.errors !== undefined) {
        setRemoveOtpError(error.errors['otp']?.[0] ?? null);
      } else {
        setRemoveBannerError(error.message ?? MESSAGES.genericError);
      }
    },
  });

  // ── Update handlers ──────────────────────────────────────────────────────
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

  // ── Removal handlers ─────────────────────────────────────────────────────
  const handleRequestRemovalOtp = useCallback((): void => {
    sendRemovalOtp();
  }, [sendRemovalOtp]);

  const handleRemoveOtpChange = useCallback((value: string): void => {
    setRemoveOtp(value);
    setRemoveOtpError(null);
  }, []);

  const handleConfirmRemoval = useCallback((): void => {
    if (!removeOtp.trim()) {
      setRemoveOtpError('Verification code is required.');
      return;
    }
    submitRemoval();
  }, [removeOtp, submitRemoval]);

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
    canRemoveEmail,
    currentEmail,
    removeOtp,
    removeOtpError,
    removeBannerError,
    removeSent,
    removeExpiresIn,
    isRequestingRemoval,
    isRemoving,
    handleRequestRemovalOtp,
    handleRemoveOtpChange,
    handleConfirmRemoval,
  };
}
