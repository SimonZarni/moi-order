import { useCallback, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSetPasswordForm, UseSetPasswordFormResult } from './useSetPasswordForm';
import { completeEmailRegistration, resetPassword } from '@/shared/api/emailAuth';
import { useAuthStore } from '@/shared/store/authStore';
import { ApiError, User } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { MESSAGES } from '@/shared/constants/messages';

type RouteParams = RouteProp<RootStackParamList, 'SetPassword'>;

export interface UseSetPasswordScreenResult {
  form: UseSetPasswordFormResult['form'];
  purpose: 'registration' | 'password_reset';
  isSubmitting: boolean;
  bannerError: string;
  handlePasswordChange: (value: string) => void;
  handlePasswordConfirmationChange: (value: string) => void;
  handleTogglePassword: () => void;
  handleSubmit: () => void;
  handleBack: () => void;
}

export function useSetPasswordScreen(): UseSetPasswordScreenResult {
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { email, verifiedToken, purpose, name } = useRoute<RouteParams>().params;
  const { setUser } = useAuthStore();
  const {
    form,
    handlePasswordChange,
    handlePasswordConfirmationChange,
    handleTogglePassword,
    validate,
    applyApiError,
  } = useSetPasswordForm();
  const [bannerError, setBannerError] = useState('');

  const { mutate, isPending: isSubmitting } = useMutation<{ user: User; token: string } | void, ApiError>({
    mutationFn: async () =>
      purpose === 'registration'
        ? completeEmailRegistration(email, name ?? '', form.password, form.passwordConfirmation, verifiedToken)
        : resetPassword(email, form.password, form.passwordConfirmation, verifiedToken),
    onSuccess: (result) => {
      if (purpose === 'registration' && result != null) {
        const authResult = result as { user: User; token: string };
        queryClient.clear();
        setUser(authResult.user, authResult.token);
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    },
    onError: (error: ApiError) => {
      if (error.status === 422 && error.errors !== undefined) {
        applyApiError(error.errors);
      } else {
        setBannerError(error.message ?? MESSAGES.genericError);
      }
    },
  });

  const handleSubmit = useCallback((): void => {
    setBannerError('');
    if (validate()) mutate();
  }, [validate, mutate]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return {
    form,
    purpose,
    isSubmitting,
    bannerError,
    handlePasswordChange,
    handlePasswordConfirmationChange,
    handleTogglePassword,
    handleSubmit,
    handleBack,
  };
}
