import { useState } from 'react';

import { LoginFormState } from '@/features/auth/types';

export interface UseLoginFormResult {
  form: LoginFormState;
  handleEmailChange: (value: string) => void;
  handlePasswordChange: (value: string) => void;
  validate: () => boolean;
  applyApiError: (errors: Record<string, string[]>) => void;
  clearErrors: () => void;
}

const INITIAL: LoginFormState = {
  email:    '',
  password: '',
  errors:   {},
};

export function useLoginForm(): UseLoginFormResult {
  const [form, setForm] = useState<LoginFormState>(INITIAL);

  const handleEmailChange = (value: string): void => {
    setForm((prev) => ({ ...prev, email: value, errors: { ...prev.errors, email: '' } }));
  };

  const handlePasswordChange = (value: string): void => {
    setForm((prev) => ({ ...prev, password: value, errors: { ...prev.errors, password: '' } }));
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (form.email.trim().length === 0) errors['email'] = 'Email is required.';
    if (form.password.length === 0)     errors['password'] = 'Password is required.';
    setForm((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const applyApiError = (apiErrors: Record<string, string[]>): void => {
    const flat: Record<string, string> = {};
    for (const [key, messages] of Object.entries(apiErrors)) {
      flat[key] = messages[0] ?? '';
    }
    setForm((prev) => ({ ...prev, errors: flat }));
  };

  const clearErrors = (): void => {
    setForm((prev) => ({ ...prev, errors: {} }));
  };

  return { form, handleEmailChange, handlePasswordChange, validate, applyApiError, clearErrors };
}
