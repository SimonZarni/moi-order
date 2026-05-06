import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';

import { useEmailRegisterForm, UseEmailRegisterFormResult } from './useEmailRegisterForm';
import { sendEmailOtp } from '@/shared/api/emailAuth';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { MESSAGES } from '@/shared/constants/messages';

export interface UseEmailRegisterScreenResult {
  form: UseEmailRegisterFormResult['form'];
  isSending: boolean;
  bannerError: string;
  handleNameChange: (value: string) => void;
  handleEmailChange: (value: string) => void;
  handleSendOtp: () => void;
  handleBack: () => void;
}

export function useEmailRegisterScreen(): UseEmailRegisterScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { form, handleNameChange, handleEmailChange, validate, applyApiError } = useEmailRegisterForm();
  const [bannerError, setBannerError] = useState('');

  const { mutate, isPending: isSending } = useMutation({
    mutationFn: () => sendEmailOtp(form.email.trim().toLowerCase(), 'registration'),
    onSuccess: () => {
      navigation.navigate('EmailOtp', {
        email:   form.email.trim().toLowerCase(),
        purpose: 'registration',
        name:    form.name.trim(),
      });
    },
    onError: (error: ApiError) => {
      if (error.status === 422 && error.errors !== undefined) {
        applyApiError(error.errors);
      } else {
        setBannerError(error.message ?? MESSAGES.genericError);
      }
    },
  });

  const handleSendOtp = useCallback((): void => {
    setBannerError('');
    if (validate()) mutate();
  }, [validate, mutate]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return {
    form,
    isSending,
    bannerError,
    handleNameChange,
    handleEmailChange,
    handleSendOtp,
    handleBack,
  };
}
