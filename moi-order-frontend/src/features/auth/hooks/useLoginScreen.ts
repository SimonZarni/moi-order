import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAppleAuth } from '@/features/auth/hooks/useAppleAuth';
import { useLoginForm, UseLoginFormResult } from '@/features/auth/hooks/useLoginForm';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import { login } from '@/shared/api/auth';
import { useAuthStore } from '@/shared/store/authStore';
import { getAccountErrorMessage } from '@/shared/constants/errorCodes';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

export interface UseLoginScreenResult {
  form: UseLoginFormResult['form'];
  isSubmitting: boolean;
  isGoogleSigningIn: boolean;
  isAppleSigningIn: boolean;
  bannerError: string;
  showPassword: boolean;
  handleEmailChange: (value: string) => void;
  handlePasswordChange: (value: string) => void;
  handleTogglePassword: () => void;
  handleSubmit: () => void;
  handleGoogleSignIn: () => Promise<void>;
  handleAppleSignIn: () => Promise<void>;
  handleGoToRegister: () => void;
}

export function useLoginScreen(): UseLoginScreenResult {
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const { form, handleEmailChange, handlePasswordChange, validate, applyApiError } = useLoginForm();
  const { handleGoogleSignIn, isGoogleSigningIn, googleBannerError } = useGoogleAuth();
  const { handleAppleSignIn, isAppleSigningIn, appleBannerError } = useAppleAuth();
  const [bannerError, setBannerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: () => login(form.email.trim(), form.password),
    onSuccess: ({ user, token }) => {
      queryClient.clear();
      setUser(user, token);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    },
    onError: (error: ApiError) => {
      if (error.status === 422 && error.errors !== undefined) {
        applyApiError(error.errors);
      } else {
        setBannerError(getAccountErrorMessage(error.code, error.context));
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
    isGoogleSigningIn,
    isAppleSigningIn,
    bannerError: bannerError || googleBannerError || appleBannerError,
    showPassword,
    handleEmailChange,
    handlePasswordChange,
    handleTogglePassword,
    handleSubmit,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleGoToRegister,
  };
}
