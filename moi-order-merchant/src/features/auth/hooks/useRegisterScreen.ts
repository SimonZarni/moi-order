import { useState, useCallback, useEffect, useRef } from 'react';
import {
  completeRegisterWithOtp,
  requestRegisterOtp,
  verifyRegisterOtp,
} from '../../../api/auth';
import { useAuthStore } from '../../../store/authStore';
import { extractApiError } from '../../../api/client';

type RegisterStep = 'credentials' | 'otp';

export interface UseRegisterScreenResult {
  step: RegisterStep;
  name: string;
  email: string;
  password: string;
  otp: string;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  resendCooldown: number;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setOtp: (v: string) => void;
  handleSendOtp: () => Promise<void>;
  handleVerifyAndComplete: () => Promise<void>;
  handleBack: () => void;
  handleResend: () => Promise<void>;
}

export function useRegisterScreen(): UseRegisterScreenResult {
  const setAuth = useAuthStore((s) => s.setAuth);

  const [step, setStep]         = useState<RegisterStep>('credentials');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp]           = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [resendCooldown, setResendCooldown] = useState(0);

  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = useCallback((seconds: number) => {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setResendCooldown(seconds);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const clearErrors = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  const applyApiError = useCallback((e: unknown) => {
    const apiError = extractApiError(e);
    setError(apiError.message);
    if (apiError.errors) {
      const flat: Record<string, string> = {};
      for (const [field, msgs] of Object.entries(apiError.errors)) {
        flat[field] = (msgs as string[])[0] ?? '';
      }
      setFieldErrors(flat);
    }
  }, []);

  const handleSendOtp = useCallback(async () => {
    if (!name.trim() || !email.trim() || !password) return;
    setIsLoading(true);
    clearErrors();
    try {
      const result = await requestRegisterOtp(name.trim(), email.trim(), password);
      startCooldown(result.resend_after);
      setOtp('');
      setStep('otp');
    } catch (e) {
      applyApiError(e);
    } finally {
      setIsLoading(false);
    }
  }, [name, email, password, clearErrors, applyApiError, startCooldown]);

  const handleVerifyAndComplete = useCallback(async () => {
    if (!otp || otp.length !== 6) return;
    setIsLoading(true);
    clearErrors();
    try {
      const { verified_token } = await verifyRegisterOtp(email.trim(), otp);
      const { user, token } = await completeRegisterWithOtp(
        name.trim(), email.trim(), password, verified_token,
      );
      setAuth(user, token);
    } catch (e) {
      applyApiError(e);
    } finally {
      setIsLoading(false);
    }
  }, [otp, email, name, password, clearErrors, applyApiError, setAuth]);

  const handleBack = useCallback(() => {
    clearErrors();
    setOtp('');
    setStep('credentials');
  }, [clearErrors]);

  const handleResend = useCallback(async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    clearErrors();
    try {
      const result = await requestRegisterOtp(name.trim(), email.trim(), password);
      startCooldown(result.resend_after);
      setOtp('');
    } catch (e) {
      applyApiError(e);
    } finally {
      setIsLoading(false);
    }
  }, [resendCooldown, isLoading, name, email, password, clearErrors, applyApiError, startCooldown]);

  return {
    step,
    name,
    email,
    password,
    otp,
    isLoading,
    error,
    fieldErrors,
    resendCooldown,
    setName,
    setEmail,
    setPassword,
    setOtp,
    handleSendOtp,
    handleVerifyAndComplete,
    handleBack,
    handleResend,
  };
}
