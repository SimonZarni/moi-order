import { useCallback, useState } from 'react';

export interface TestServiceFormState {
  fullName: string;
  phone:    string;
  errors:   Record<string, string>;
}

export interface UseTestServiceFormResult {
  form:                 TestServiceFormState;
  handleFullNameChange: (value: string) => void;
  handlePhoneChange:    (value: string) => void;
  validate:             () => boolean;
  applyApiError:        (errors: Record<string, string[]>) => void;
}

const FIELD_MAP: Record<string, keyof TestServiceFormState> = {
  full_name: 'fullName',
  phone:     'phone',
};

export function useTestServiceForm(): UseTestServiceFormResult {
  const [form, setForm] = useState<TestServiceFormState>({
    fullName: '',
    phone:    '',
    errors:   {},
  });

  const clearError = useCallback((field: string): void => {
    setForm((prev) => {
      if (!prev.errors[field]) return prev;
      const { [field]: _, ...rest } = prev.errors;
      return { ...prev, errors: rest };
    });
  }, []);

  const handleFullNameChange = useCallback((value: string): void => {
    clearError('fullName');
    setForm((prev) => ({ ...prev, fullName: value }));
  }, [clearError]);

  const handlePhoneChange = useCallback((value: string): void => {
    clearError('phone');
    setForm((prev) => ({ ...prev, phone: value }));
  }, [clearError]);

  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    if (form.fullName.trim().length === 0) errors['fullName'] = 'Full name is required.';
    if (form.phone.trim().length === 0)    errors['phone']    = 'Phone number is required.';
    setForm((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [form]);

  const applyApiError = useCallback((apiErrors: Record<string, string[]>): void => {
    const errors: Record<string, string> = {};
    Object.entries(apiErrors).forEach(([snakeKey, messages]) => {
      const formKey = FIELD_MAP[snakeKey] ?? snakeKey;
      errors[formKey] = messages[0] ?? '';
    });
    setForm((prev) => ({ ...prev, errors }));
  }, []);

  return {
    form,
    handleFullNameChange,
    handlePhoneChange,
    validate,
    applyApiError,
  };
}
