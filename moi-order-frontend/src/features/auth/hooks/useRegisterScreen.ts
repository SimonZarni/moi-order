import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';

import { useAppleAuth } from '@/features/auth/hooks/useAppleAuth';
import { useLineAuth } from '@/features/auth/hooks/useLineAuth';
import { usePhoneOtpAuth } from '@/features/auth/hooks/usePhoneOtpAuth';
import { useRegisterForm, UseRegisterFormResult } from '@/features/auth/hooks/useRegisterForm';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import { sendEmailOtp } from '@/shared/api/emailAuth';
import { DOMAIN_ERROR_MESSAGES } from '@/shared/constants/errorCodes';
import { MESSAGES } from '@/shared/constants/messages';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

export interface UseRegisterScreenResult {
  form: UseRegisterFormResult['form'];
  isSubmitting: boolean;
  isGoogleSigningIn: boolean;
  isAppleSigningIn: boolean;
  isLineSigningIn: boolean;
  isRequestingOtp: boolean;
  isVerifyingOtp: boolean;
  resendSecondsLeft: number;
  phoneNumber: string;
  otpCode: string;
  bannerError: string;
  handleNameChange: (value: string) => void;
  handleEmailChange: (value: string) => void;
  handlePhoneNumberChange: (value: string) => void;
  handleOtpCodeChange: (value: string) => void;
  handleSubmit: () => void;
  handleRequestOtp: () => Promise<void>;
  handleVerifyOtp: () => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
  handleAppleSignIn: () => Promise<void>;
  handleLineSignIn: () => Promise<void>;
  handleGoToLogin: () => void;
}

export function useRegisterScreen(): UseRegisterScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    form,
    handleNameChange,
    handleEmailChange,
    validateBasic,
    applyApiError,
  } = useRegisterForm();
  const phoneOtp = usePhoneOtpAuth({ purpose: 'register', getName: () => form.name });
  const { handleGoogleSignIn, isGoogleSigningIn, googleBannerError } = useGoogleAuth();
  const { handleAppleSignIn, isAppleSigningIn, appleBannerError }    = useAppleAuth();
  const { handleLineSignIn, isLineSigningIn, lineBannerError }        = useLineAuth();
  const [bannerError, setBannerError] = useState('');

  const { mutate, isPending: isSubmitting } = useMutation({
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
      } else if (error.status === 409) {
        setBannerError(DOMAIN_ERROR_MESSAGES[error.code] ?? error.message ?? MESSAGES.genericError);
      } else {
        setBannerError(error.message ?? MESSAGES.genericError);
      }
    },
  });

  const handleSubmit = useCallback((): void => {
    setBannerError('');
    if (validateBasic()) mutate();
  }, [validateBasic, mutate]);

  const handleGoToLogin = useCallback((): void => {
    navigation.navigate('Login');
  }, [navigation]);

  return {
    form,
    isSubmitting,
    isGoogleSigningIn,
    isAppleSigningIn,
    isLineSigningIn,
    isRequestingOtp:    phoneOtp.isRequestingOtp,
    isVerifyingOtp:     phoneOtp.isVerifyingOtp,
    resendSecondsLeft:  phoneOtp.resendSecondsLeft,
    phoneNumber:        phoneOtp.phoneNumber,
    otpCode:            phoneOtp.otpCode,
    bannerError:        bannerError || phoneOtp.otpError || googleBannerError || appleBannerError || lineBannerError,
    handleNameChange,
    handleEmailChange,
    handlePhoneNumberChange: phoneOtp.handlePhoneNumberChange,
    handleOtpCodeChange:     phoneOtp.handleOtpCodeChange,
    handleSubmit,
    handleRequestOtp:  phoneOtp.handleRequestOtp,
    handleVerifyOtp:   phoneOtp.handleVerifyOtp,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleLineSignIn,
    handleGoToLogin,
  };
}
