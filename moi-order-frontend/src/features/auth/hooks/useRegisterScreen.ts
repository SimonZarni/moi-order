import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';

import { useRegisterForm, UseRegisterFormResult } from '@/features/auth/hooks/useRegisterForm';
import { register } from '@/shared/api/auth';
import { useAuthStore } from '@/shared/store/authStore';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

export interface UseRegisterScreenResult {
  form: UseRegisterFormResult['form'];
  isSubmitting: boolean;
  bannerError: string;
  showPassword: boolean;
  handleNameChange: (value: string) => void;
  handleEmailChange: (value: string) => void;
  handlePasswordChange: (value: string) => void;
  handlePasswordConfirmationChange: (value: string) => void;
  handleTogglePassword: () => void;
  handleSubmit: () => void;
  handleGoToLogin: () => void;
}

export function useRegisterScreen(): UseRegisterScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setUser } = useAuthStore();
  const {
    form,
    handleNameChange,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmationChange,
    validate,
    applyApiError,
  } = useRegisterForm();
  const [bannerError, setBannerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: () =>
      register(form.name.trim(), form.email.trim(), form.password, form.passwordConfirmation),
    onSuccess: ({ user, token }) => {
      setUser(user, token);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
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
    if (validate()) mutate();
  }, [validate, mutate]);

  const handleTogglePassword = useCallback((): void => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleGoToLogin = useCallback((): void => {
    navigation.navigate('Login');
  }, [navigation]);

  return {
    form,
    isSubmitting,
    bannerError,
    showPassword,
    handleNameChange,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmationChange,
    handleTogglePassword,
    handleSubmit,
    handleGoToLogin,
  };
}
