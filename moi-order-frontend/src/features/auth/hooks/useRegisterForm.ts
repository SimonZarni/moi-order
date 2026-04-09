import { useState } from 'react';

import { RegisterFormState } from '@/features/auth/types';

export interface UseRegisterFormResult {
  form: RegisterFormState;
  handleNameChange: (value: string) => void;
  handleEmailChange: (value: string) => void;
  handlePasswordChange: (value: string) => void;
  handlePasswordConfirmationChange: (value: string) => void;
  validate: () => boolean;
  applyApiError: (errors: Record<string, string[]>) => void;
  clearErrors: () => void;
}

const INITIAL: RegisterFormState = {
  name:                 '',
  email:                '',
  password:             '',
  passwordConfirmation: '',
  errors:               {},
};

export function useRegisterForm(): UseRegisterFormResult {
  const [form, setForm] = useState<RegisterFormState>(INITIAL);

  const clearField = (field: keyof RegisterFormState) => (value: string): void => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: '' },
    }));
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (form.name.trim().length === 0)                 errors['name'] = 'Full name is required.';
    if (form.email.trim().length === 0)                errors['email'] = 'Email is required.';
    if (form.password.length < 8)                      errors['password'] = 'Password must be at least 8 characters.';
    if (form.password !== form.passwordConfirmation)   errors['password_confirmation'] = 'Passwords do not match.';
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

  return {
    form,
    handleNameChange:                 clearField('name'),
    handleEmailChange:                clearField('email'),
    handlePasswordChange:             clearField('password'),
    handlePasswordConfirmationChange: clearField('passwordConfirmation'),
    validate,
    applyApiError,
    clearErrors,
  };
}
