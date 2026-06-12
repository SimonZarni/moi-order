import { useState, useCallback } from 'react';
import { extractApiError } from '../../../api/client';

interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface UseChangePasswordFormResult {
  values: ChangePasswordValues;
  errors: ChangePasswordErrors;
  handleCurrentPasswordChange: (v: string) => void;
  handleNewPasswordChange: (v: string) => void;
  handleConfirmPasswordChange: (v: string) => void;
  validate: () => boolean;
  applyApiError: (error: unknown) => void;
  clearErrors: () => void;
  reset: () => void;
}

const EMPTY: ChangePasswordValues = { currentPassword: '', newPassword: '', confirmPassword: '' };

export function useChangePasswordForm(): UseChangePasswordFormResult {
  const [values, setValues] = useState<ChangePasswordValues>(EMPTY);
  const [errors, setErrors] = useState<ChangePasswordErrors>({});

  const handleCurrentPasswordChange = useCallback((v: string) => {
    setValues((prev) => ({ ...prev, currentPassword: v }));
    setErrors((prev) => ({ ...prev, currentPassword: undefined }));
  }, []);

  const handleNewPasswordChange = useCallback((v: string) => {
    setValues((prev) => ({ ...prev, newPassword: v }));
    setErrors((prev) => ({ ...prev, newPassword: undefined }));
  }, []);

  const handleConfirmPasswordChange = useCallback((v: string) => {
    setValues((prev) => ({ ...prev, confirmPassword: v }));
    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const errs: ChangePasswordErrors = {};
    if (!values.currentPassword) errs.currentPassword = 'Current password is required.';
    if (!values.newPassword) errs.newPassword = 'New password is required.';
    else if (values.newPassword.length < 8) errs.newPassword = 'Must be at least 8 characters.';
    if (!values.confirmPassword) errs.confirmPassword = 'Please confirm your new password.';
    else if (values.confirmPassword !== values.newPassword) errs.confirmPassword = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [values]);

  const applyApiError = useCallback((error: unknown) => {
    const apiError = extractApiError(error);
    if (apiError.errors) {
      setErrors({
        currentPassword: apiError.errors['current_password']?.[0],
        newPassword: apiError.errors['new_password']?.[0],
        confirmPassword: apiError.errors['new_password_confirmation']?.[0],
      });
    }
  }, []);

  const clearErrors = useCallback(() => setErrors({}), []);

  const reset = useCallback(() => { setValues(EMPTY); setErrors({}); }, []);

  return {
    values, errors,
    handleCurrentPasswordChange, handleNewPasswordChange, handleConfirmPasswordChange,
    validate, applyApiError, clearErrors, reset,
  };
}
