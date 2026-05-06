import { useState } from 'react';

export interface EmailOtpFormState {
  otp: string;
  errors: Record<string, string>;
}

export interface UseEmailOtpFormResult {
  form: EmailOtpFormState;
  handleOtpChange: (value: string) => void;
  validate: () => boolean;
  applyApiError: (errors: Record<string, string[]>) => void;
  clearErrors: () => void;
}

const INITIAL: EmailOtpFormState = { otp: '', errors: {} };

export function useEmailOtpForm(): UseEmailOtpFormResult {
  const [form, setForm] = useState<EmailOtpFormState>(INITIAL);

  const handleOtpChange = (value: string): void => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setForm((prev) => ({ ...prev, otp: digits, errors: { ...prev.errors, otp: '' } }));
  };

  const validate = (): boolean => {
    if (form.otp.length !== 6) {
      setForm((prev) => ({ ...prev, errors: { otp: 'Enter the 6-digit code.' } }));
      return false;
    }
    return true;
  };

  const applyApiError = (apiErrors: Record<string, string[]>): void => {
    const flat: Record<string, string> = {};
    for (const [key, messages] of Object.entries(apiErrors)) {
      flat[key] = messages[0] ?? '';
    }
    setForm((prev) => ({ ...prev, errors: flat }));
  };

  const clearErrors = (): void => setForm((prev) => ({ ...prev, errors: {} }));

  return { form, handleOtpChange, validate, applyApiError, clearErrors };
}
