import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';

import { useForgotPasswordForm, UseForgotPasswordFormResult } from './useForgotPasswordForm';
import { sendEmailOtp } from '@/shared/api/emailAuth';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { MESSAGES } from '@/shared/constants/messages';

export interface UseForgotPasswordScreenResult {
  form: UseForgotPasswordFormResult['form'];
  isSending: boolean;
  bannerError: string;
  handleEmailChange: (value: string) => void;
  handleSendOtp: () => void;
  handleBack: () => void;
}

export function useForgotPasswordScreen(): UseForgotPasswordScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { form, handleEmailChange, validate, applyApiError } = useForgotPasswordForm();
  const [bannerError, setBannerError] = useState('');

  const { mutate, isPending: isSending } = useMutation({
    mutationFn: () => sendEmailOtp(form.email.trim().toLowerCase(), 'password_reset'),
    onSuccess: () => {
      navigation.navigate('EmailOtp', {
        email:   form.email.trim().toLowerCase(),
        purpose: 'password_reset',
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

  return { form, isSending, bannerError, handleEmailChange, handleSendOtp, handleBack };
}
