import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../../../api/profile';
import { useChangePasswordForm } from './useChangePasswordForm';
import type { UseChangePasswordFormResult } from './useChangePasswordForm';

export interface UseChangePasswordScreenResult {
  form: UseChangePasswordFormResult;
  isSaving: boolean;
  successMessage: string | null;
  handleSubmit: () => void;
  handleDismissSuccess: () => void;
}

export function useChangePasswordScreen(): UseChangePasswordScreenResult {
  const form = useChangePasswordForm();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { mutate, isPending: isSaving } = useMutation({
    mutationFn: () =>
      changePassword({
        current_password: form.values.currentPassword,
        new_password: form.values.newPassword,
        new_password_confirmation: form.values.confirmPassword,
      }),
    onSuccess: () => {
      form.reset();
      setSuccessMessage('Password changed successfully.');
    },
    onError: (error) => {
      form.applyApiError(error);
    },
  });

  const handleSubmit = useCallback(() => {
    if (!form.validate()) return;
    mutate();
  }, [form, mutate]);

  const handleDismissSuccess = useCallback(() => setSuccessMessage(null), []);

  return { form, isSaving, successMessage, handleSubmit, handleDismissSuccess };
}
