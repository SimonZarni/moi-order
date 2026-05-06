import { useState } from 'react';

export interface EmailRegisterFormState {
  name: string;
  email: string;
  errors: Record<string, string>;
}

export interface UseEmailRegisterFormResult {
  form: EmailRegisterFormState;
  handleNameChange: (value: string) => void;
  handleEmailChange: (value: string) => void;
  validate: () => boolean;
  applyApiError: (errors: Record<string, string[]>) => void;
  clearErrors: () => void;
}

const INITIAL: EmailRegisterFormState = { name: '', email: '', errors: {} };

export function useEmailRegisterForm(): UseEmailRegisterFormResult {
  const [form, setForm] = useState<EmailRegisterFormState>(INITIAL);

  const setField =
    <K extends keyof EmailRegisterFormState>(field: K) =>
    (value: EmailRegisterFormState[K]): void => {
      setForm((prev) => ({ ...prev, [field]: value, errors: { ...prev.errors, [field]: '' } }));
    };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (form.name.trim().length < 2) errors['name'] = 'Full name must be at least 2 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors['email'] = 'Enter a valid email address.';
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

  const clearErrors = (): void => setForm((prev) => ({ ...prev, errors: {} }));

  return {
    form,
    handleNameChange: setField('name'),
    handleEmailChange: setField('email'),
    validate,
    applyApiError,
    clearErrors,
  };
}
