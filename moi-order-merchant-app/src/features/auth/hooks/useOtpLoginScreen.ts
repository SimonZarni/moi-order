import { useState, useCallback } from 'react';
import { requestOtp, verifyOtp } from '../../../api/auth';
import { useAuthStore } from '../../../store/authStore';
import { extractApiError } from '../../../api/client';

type OtpStep = 'phone' | 'pin';

interface UseOtpLoginScreenResult {
  step: OtpStep;
  phoneNumber: string;
  pin: string;
  isLoading: boolean;
  error: string | null;
  otpRequestId: string | null;
  setPhoneNumber: (v: string) => void;
  setPin: (v: string) => void;
  handleRequestOtp: () => Promise<void>;
  handleVerifyOtp: () => Promise<void>;
}

export function useOtpLoginScreen(): UseOtpLoginScreenResult {
  const setAuth = useAuthStore((s) => s.setAuth);

  const [step, setStep] = useState<OtpStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null);

  const handleRequestOtp = useCallback(async () => {
    if (!phoneNumber.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await requestOtp(phoneNumber.trim());
      setOtpRequestId(result.otp_request_id);
      setStep('pin');
    } catch (e) {
      setError(extractApiError(e).message);
    } finally {
      setIsLoading(false);
    }
  }, [phoneNumber]);

  const handleVerifyOtp = useCallback(async () => {
    if (!otpRequestId || !pin) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await verifyOtp(otpRequestId, phoneNumber, pin);
      setAuth(result.user, result.token);
    } catch (e) {
      setError(extractApiError(e).message);
    } finally {
      setIsLoading(false);
    }
  }, [otpRequestId, phoneNumber, pin, setAuth]);

  return {
    step,
    phoneNumber,
    pin,
    isLoading,
    error,
    otpRequestId,
    setPhoneNumber,
    setPin,
    handleRequestOtp,
    handleVerifyOtp,
  };
}
