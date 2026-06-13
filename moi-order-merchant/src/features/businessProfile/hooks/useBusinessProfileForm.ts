import { useState, useCallback } from 'react';
import type { ApiError } from '../../../api/client';

interface FormValues {
  business_phone: string;
  email: string;
}

type EditMode = 'phone' | 'email' | null;

export interface UseBusinessProfileFormResult {
  values: FormValues;
  errors: Partial<FormValues>;
  editMode: EditMode;
  isEditingPhone: boolean;
  isEditingEmail: boolean;
  handleChangePhone: (val: string) => void;
  handleChangeEmail: (val: string) => void;
  handleStartEditPhone: (currentPhone: string | null) => void;
  handleStartEditEmail: (currentEmail: string) => void;
  handleCancelEdit: () => void;
  validate: () => boolean;
  applyApiError: (err: ApiError) => void;
  clearErrors: () => void;
}

export function useBusinessProfileForm(): UseBusinessProfileFormResult {
  const [values, setValues] = useState<FormValues>({ business_phone: '', email: '' });
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [editMode, setEditMode] = useState<EditMode>(null);

  const handleChangePhone = useCallback((val: string) => {
    setValues((prev) => ({ ...prev, business_phone: val }));
    setErrors((prev) => ({ ...prev, business_phone: undefined }));
  }, []);

  const handleChangeEmail = useCallback((val: string) => {
    setValues((prev) => ({ ...prev, email: val }));
    setErrors((prev) => ({ ...prev, email: undefined }));
  }, []);

  const handleStartEditPhone = useCallback((currentPhone: string | null) => {
    setValues((prev) => ({ ...prev, business_phone: currentPhone ?? '' }));
    setErrors({});
    setEditMode('phone');
  }, []);

  const handleStartEditEmail = useCallback((currentEmail: string) => {
    setValues((prev) => ({ ...prev, email: currentEmail }));
    setErrors({});
    setEditMode('email');
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditMode(null);
    setErrors({});
  }, []);

  const validate = useCallback((): boolean => {
    const next: Partial<FormValues> = {};
    if (editMode === 'phone') {
      if (values.business_phone.trim().length > 30) {
        next.business_phone = 'Phone number must not exceed 30 characters.';
      }
    }
    if (editMode === 'email') {
      const email = values.email.trim();
      if (!email) {
        next.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        next.email = 'Please enter a valid email address.';
      } else if (email.length > 255) {
        next.email = 'Email address must not exceed 255 characters.';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [values, editMode]);

  const applyApiError = useCallback((err: ApiError) => {
    const next: Partial<FormValues> = {};
    if (err.errors?.business_phone) next.business_phone = err.errors.business_phone[0];
    if (err.errors?.email) next.email = err.errors.email[0];
    setErrors(next);
  }, []);

  const clearErrors = useCallback(() => setErrors({}), []);

  return {
    values,
    errors,
    editMode,
    isEditingPhone: editMode === 'phone',
    isEditingEmail: editMode === 'email',
    handleChangePhone,
    handleChangeEmail,
    handleStartEditPhone,
    handleStartEditEmail,
    handleCancelEdit,
    validate,
    applyApiError,
    clearErrors,
  };
}
