import { useState } from 'react';

export interface ForgotPasswordFormState {
  email: string;
  errors: Record<string, string>;
}

export interface UseForgotPasswordFormResult {
  form: ForgotPasswordFormState;
  handleEmailChange: (value: string) => void;
  validate: () => boolean;
  applyApiError: (errors: Record<string, string[]>) => void;
  clearErrors: () => void;
}

const INITIAL: ForgotPasswordFormState = { email: '', errors: {} };

export function useForgotPasswordForm(): UseForgotPasswordFormResult {
  const [form, setForm] = useState<ForgotPasswordFormState>(INITIAL);

  const handleEmailChange = (value: string): void => {
    setForm((prev) => ({ ...prev, email: value, errors: { ...prev.errors, email: '' } }));
  };

  const validate = (): boolean => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setForm((prev) => ({ ...prev, errors: { email: 'Enter a valid email address.' } }));
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

  return { form, handleEmailChange, validate, applyApiError, clearErrors };
}
