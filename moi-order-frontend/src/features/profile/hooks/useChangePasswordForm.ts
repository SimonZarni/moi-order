import { useCallback, useState } from 'react';

import { ApiError } from '@/types/models';

export interface ChangePasswordErrors {
  currentPassword: string | null;
  newPassword: string | null;
  confirmPassword: string | null;
}

export interface UseChangePasswordFormResult {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  errors: ChangePasswordErrors;
  handleCurrentPasswordChange: (text: string) => void;
  handleNewPasswordChange: (text: string) => void;
  handleConfirmPasswordChange: (text: string) => void;
  validate: () => boolean;
  applyApiError: (apiError: ApiError) => void;
  reset: () => void;
}

const EMPTY_ERRORS: ChangePasswordErrors = {
  currentPassword: null,
  newPassword:     null,
  confirmPassword: null,
};

export function useChangePasswordForm(): UseChangePasswordFormResult {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ChangePasswordErrors>(EMPTY_ERRORS);

  const handleCurrentPasswordChange = useCallback((text: string): void => {
    setCurrentPassword(text);
    setErrors((prev) => ({ ...prev, currentPassword: null }));
  }, []);

  const handleNewPasswordChange = useCallback((text: string): void => {
    setNewPassword(text);
    setErrors((prev) => ({ ...prev, newPassword: null }));
  }, []);

  const handleConfirmPasswordChange = useCallback((text: string): void => {
    setConfirmPassword(text);
    setErrors((prev) => ({ ...prev, confirmPassword: null }));
  }, []);

  const validate = useCallback((): boolean => {
    const next: ChangePasswordErrors = { ...EMPTY_ERRORS };
    if (!currentPassword) next.currentPassword = 'Current password is required.';
    if (!newPassword)     next.newPassword     = 'New password is required.';
    else if (newPassword.length < 8) next.newPassword = 'Password must be at least 8 characters.';
    if (newPassword !== confirmPassword) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.values(next).every((v) => v === null);
  }, [currentPassword, newPassword, confirmPassword]);

  const applyApiError = useCallback((apiError: ApiError): void => {
    const fieldErrors = apiError.errors ?? {};
    setErrors({
      currentPassword: fieldErrors['current_password']?.[0] ?? null,
      newPassword:     fieldErrors['password']?.[0] ?? null,
      confirmPassword: fieldErrors['password_confirmation']?.[0] ?? null,
    });
  }, []);

  const reset = useCallback((): void => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors(EMPTY_ERRORS);
  }, []);

  return {
    currentPassword, newPassword, confirmPassword, errors,
    handleCurrentPasswordChange, handleNewPasswordChange, handleConfirmPasswordChange,
    validate, applyApiError, reset,
  };
}
