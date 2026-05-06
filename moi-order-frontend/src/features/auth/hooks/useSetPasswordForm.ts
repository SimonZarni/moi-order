import { useState } from 'react';

export interface SetPasswordFormState {
  password: string;
  passwordConfirmation: string;
  showPassword: boolean;
  errors: Record<string, string>;
}

export interface UseSetPasswordFormResult {
  form: SetPasswordFormState;
  handlePasswordChange: (value: string) => void;
  handlePasswordConfirmationChange: (value: string) => void;
  handleTogglePassword: () => void;
  validate: () => boolean;
  applyApiError: (errors: Record<string, string[]>) => void;
  clearErrors: () => void;
}

const INITIAL: SetPasswordFormState = {
  password: '',
  passwordConfirmation: '',
  showPassword: false,
  errors: {},
};

export function useSetPasswordForm(): UseSetPasswordFormResult {
  const [form, setForm] = useState<SetPasswordFormState>(INITIAL);

  const setField =
    <K extends keyof SetPasswordFormState>(field: K) =>
    (value: SetPasswordFormState[K]): void => {
      setForm((prev) => ({ ...prev, [field]: value, errors: { ...prev.errors, [field]: '' } }));
    };

  const handleTogglePassword = (): void => {
    setForm((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (form.password.length < 8) errors['password'] = 'Password must be at least 8 characters.';
    if (form.password !== form.passwordConfirmation) errors['passwordConfirmation'] = 'Passwords do not match.';
    setForm((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const applyApiError = (apiErrors: Record<string, string[]>): void => {
    const keyMap: Record<string, string> = { password_confirmation: 'passwordConfirmation' };
    const flat: Record<string, string> = {};
    for (const [key, messages] of Object.entries(apiErrors)) {
      flat[keyMap[key] ?? key] = messages[0] ?? '';
    }
    setForm((prev) => ({ ...prev, errors: flat }));
  };

  const clearErrors = (): void => setForm((prev) => ({ ...prev, errors: {} }));

  return {
    form,
    handlePasswordChange: setField('password'),
    handlePasswordConfirmationChange: setField('passwordConfirmation'),
    handleTogglePassword,
    validate,
    applyApiError,
    clearErrors,
  };
}
