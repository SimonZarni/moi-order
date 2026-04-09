import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';

import { useLoginForm, UseLoginFormResult } from '@/features/auth/hooks/useLoginForm';
import { login } from '@/shared/api/auth';
import { useAuthStore } from '@/shared/store/authStore';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

export interface UseLoginScreenResult {
  form: UseLoginFormResult['form'];
  isSubmitting: boolean;
  bannerError: string;
  showPassword: boolean;
  handleEmailChange: (value: string) => void;
  handlePasswordChange: (value: string) => void;
  handleTogglePassword: () => void;
  handleSubmit: () => void;
  handleGoToRegister: () => void;
}

export function useLoginScreen(): UseLoginScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setUser } = useAuthStore();
  const { form, handleEmailChange, handlePasswordChange, validate, applyApiError } = useLoginForm();
  const [bannerError, setBannerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: () => login(form.email.trim(), form.password),
    onSuccess: ({ user, token }) => {
      setUser(user, token);
      // Navigation handled automatically by App.tsx auth-aware stack.
    },
    onError: (error: ApiError) => {
      if (error.status === 422 && error.errors !== undefined) {
        applyApiError(error.errors);
      } else {
        setBannerError(error.message ?? 'Something went wrong. Please try again.');
      }
    },
  });

  const handleSubmit = useCallback((): void => {
    setBannerError('');
    if (validate()) {
      mutate();
    }
  }, [validate, mutate]);

  const handleTogglePassword = useCallback((): void => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleGoToRegister = useCallback((): void => {
    navigation.navigate('Register');
  }, [navigation]);

  return {
    form,
    isSubmitting,
    bannerError,
    showPassword,
    handleEmailChange,
    handlePasswordChange,
    handleTogglePassword,
    handleSubmit,
    handleGoToRegister,
  };
}
