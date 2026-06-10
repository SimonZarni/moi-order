import { useState, useCallback } from 'react';
import type { ApiError } from '../../../api/client';

interface FormValues {
  business_phone: string;
}

export interface UseBusinessProfileFormResult {
  values: FormValues;
  errors: Partial<FormValues>;
  isEditing: boolean;
  handleChangePhone: (val: string) => void;
  handleStartEdit: (currentPhone: string | null) => void;
  handleCancelEdit: () => void;
  validate: () => boolean;
  applyApiError: (err: ApiError) => void;
  clearErrors: () => void;
}

export function useBusinessProfileForm(): UseBusinessProfileFormResult {
  const [values, setValues] = useState<FormValues>({ business_phone: '' });
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleChangePhone = useCallback((val: string) => {
    setValues((prev) => ({ ...prev, business_phone: val }));
    setErrors((prev) => ({ ...prev, business_phone: undefined }));
  }, []);

  const handleStartEdit = useCallback((currentPhone: string | null) => {
    setValues({ business_phone: currentPhone ?? '' });
    setErrors({});
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setErrors({});
  }, []);

  const validate = useCallback((): boolean => {
    const next: Partial<FormValues> = {};
    const phone = values.business_phone.trim();
    if (phone.length > 30) {
      next.business_phone = 'Phone number must not exceed 30 characters.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [values]);

  const applyApiError = useCallback((err: ApiError) => {
    if (err.errors?.business_phone) {
      setErrors({ business_phone: err.errors.business_phone[0] });
    }
  }, []);

  const clearErrors = useCallback(() => setErrors({}), []);

  return {
    values,
    errors,
    isEditing,
    handleChangePhone,
    handleStartEdit,
    handleCancelEdit,
    validate,
    applyApiError,
    clearErrors,
  };
}
