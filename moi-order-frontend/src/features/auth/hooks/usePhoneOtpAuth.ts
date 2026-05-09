import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import { requestOtp, verifyOtpLogin, verifyOtpRegister } from '@/shared/api/auth';
import { useAuthStore } from '@/shared/store/authStore';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

export interface UsePhoneOtpAuthOptions {
  purpose: 'login' | 'register';
  getName?: () => string;
}

export interface UsePhoneOtpAuthResult {
  phoneNumber: string;
  otpCode: string;
  otpRequestId: string | null;
  otpError: string;
  isRequestingOtp: boolean;
  isVerifyingOtp: boolean;
  resendSecondsLeft: number;
  handlePhoneNumberChange: (value: string) => void;
  handleOtpCodeChange: (value: string) => void;
  handleRequestOtp: () => Promise<void>;
  handleVerifyOtp: () => Promise<void>;
}

export function usePhoneOtpAuth({
  purpose,
  getName,
}: UsePhoneOtpAuthOptions): UsePhoneOtpAuthResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null);
  const [otpError, setOtpError] = useState('');
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
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

  const handlePhoneNumberChange = useCallback((value: string): void => {
    setPhoneNumber(value);
    setOtpError('');
  }, []);

  const handleOtpCodeChange = useCallback((value: string): void => {
    setOtpCode(value);
    setOtpError('');
  }, []);

  const handleRequestOtp = useCallback(async (): Promise<void> => {
    if (isRequestingOtp || resendSecondsLeft > 0) return;

    // Client-side format check — backend always re-validates, but this prevents
    // obviously malformed inputs from consuming a rate-limit slot.
    const cleaned = phoneNumber.trim();
    const digitsOnly = cleaned.replace(/[\s\-\(\)]/g, '');
    if (cleaned.length === 0) {
      setOtpError('Phone number is required.');
      return;
    }
    if (!/^\+?\d{7,15}$/.test(digitsOnly)) {
      setOtpError('Enter a valid phone number.');
      return;
    }

    try {
      setOtpError('');
      setIsRequestingOtp(true);
      const response = await requestOtp(cleaned, purpose);
      setOtpRequestId(response.otp_request_id);
      setResendUntil(Date.now() + 60_000);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.status === 429) {
        // Backend throttle hit — enforce cooldown so the user can't bypass it
        // by modifying JS state. Surface a clear message.
        setResendUntil(Date.now() + 60_000);
        setOtpError('Too many requests. Please wait before trying again.');
      } else {
        setOtpError(apiError.errors?.phone_number?.[0] ?? apiError.message ?? 'Failed to send OTP.');
      }
    } finally {
      setIsRequestingOtp(false);
    }
  }, [isRequestingOtp, phoneNumber, purpose, resendSecondsLeft]);

  const handleVerifyOtp = useCallback(async (): Promise<void> => {
    if (otpRequestId === null) {
      setOtpError('Request an OTP first.');
      return;
    }

    try {
      setOtpError('');
      setIsVerifyingOtp(true);

      const result = purpose === 'login'
        ? await verifyOtpLogin(otpRequestId, phoneNumber.trim(), otpCode.trim())
        : await verifyOtpRegister(getName?.().trim() ?? '', otpRequestId, phoneNumber.trim(), otpCode.trim());

      queryClient.clear();
      setUser(result.user, result.token);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setOtpError(
        apiError.errors?.pin?.[0]
          ?? apiError.errors?.phone_number?.[0]
          ?? apiError.errors?.name?.[0]
          ?? apiError.errors?.otp_request_id?.[0]
          ?? apiError.message
          ?? 'OTP verification failed.',
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  }, [getName, navigation, otpCode, otpRequestId, phoneNumber, purpose, queryClient, setUser]);

  return {
    phoneNumber,
    otpCode,
    otpRequestId,
    otpError,
    isRequestingOtp,
    isVerifyingOtp,
    resendSecondsLeft,
    handlePhoneNumberChange,
    handleOtpCodeChange,
    handleRequestOtp,
    handleVerifyOtp,
  };
}
