import { useState, useCallback } from 'react';
import {
  sendEmailVerificationOtp,
  confirmEmailVerification,
} from '../../../api/auth';
import { useAuthStore } from '../../../store/authStore';
import { extractApiError } from '../../../api/client';

type Step = 'idle' | 'sending' | 'entering_otp' | 'confirming' | 'done';

export interface UseEmailVerificationResult {
  step: Step;
  otp: string;
  password: string;
  passwordConfirm: string;
  error: string | null;
  resendAfter: number;
  setOtp: (v: string) => void;
  setPassword: (v: string) => void;
  setPasswordConfirm: (v: string) => void;
  handleSendOtp: () => Promise<void>;
  handleConfirm: () => Promise<void>;
}

export function useEmailVerification(): UseEmailVerificationResult {
  const updateUser = useAuthStore((s) => s.setUser);

  const [step, setStep]                 = useState<Step>('idle');
  const [otp, setOtp]                   = useState('');
  const [password, setPassword]         = useState('');
  const [passwordConfirm, setPwConfirm] = useState('');
  const [error, setError]               = useState<string | null>(null);
  const [resendAfter, setResendAfter]   = useState(0);

  const handleSendOtp = useCallback(async () => {
    setStep('sending');
    setError(null);
    try {
      const result = await sendEmailVerificationOtp();
      setResendAfter(result.resend_after);
      setStep('entering_otp');
    } catch (e) {
      setError(extractApiError(e).message);
      setStep('idle');
    }
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!otp || !password || !passwordConfirm) return;
    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }
    setStep('confirming');
    setError(null);
    try {
      const updatedUser = await confirmEmailVerification(otp, password, passwordConfirm);
      updateUser(updatedUser);
      setStep('done');
    } catch (e) {
      setError(extractApiError(e).message);
      setStep('entering_otp');
    }
  }, [otp, password, passwordConfirm, updateUser]);

  return {
    step,
    otp,
    password,
    passwordConfirm,
    error,
    resendAfter,
    setOtp,
    setPassword,
    setPasswordConfirm: setPwConfirm,
    handleSendOtp,
    handleConfirm,
  };
}
