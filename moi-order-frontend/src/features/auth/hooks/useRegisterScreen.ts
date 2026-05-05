import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppleAuth } from '@/features/auth/hooks/useAppleAuth';
import { useLineAuth } from '@/features/auth/hooks/useLineAuth';
import { usePhoneOtpAuth } from '@/features/auth/hooks/usePhoneOtpAuth';
import { useRegisterForm, UseRegisterFormResult } from '@/features/auth/hooks/useRegisterForm';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import { requestEmailOtp } from '@/shared/api/emailOtp';
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
  showPassword: boolean;
  handleNameChange: (value: string) => void;
  handleEmailChange: (value: string) => void;
  handlePasswordChange: (value: string) => void;
  handlePasswordConfirmationChange: (value: string) => void;
  handlePhoneNumberChange: (value: string) => void;
  handleOtpCodeChange: (value: string) => void;
  handleTogglePassword: () => void;
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
    handlePasswordChange,
    handlePasswordConfirmationChange,
    validate,
    applyApiError,
  } = useRegisterForm();
  const phoneOtp = usePhoneOtpAuth({ purpose: 'register', getName: () => form.name });
  const { handleGoogleSignIn, isGoogleSigningIn, googleBannerError } = useGoogleAuth();
  const { handleAppleSignIn, isAppleSigningIn, appleBannerError } = useAppleAuth();
  const { handleLineSignIn, isLineSigningIn, lineBannerError } = useLineAuth();
  const [bannerError, setBannerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback((): void => {
    setBannerError('');
    if (!form.name.trim()) { applyApiError({ name: ['Please enter your full name.'] }); return; }
    if (!form.email.trim()) { applyApiError({ email: ['Please enter your email address.'] }); return; }

    setIsSubmitting(true);
    requestEmailOtp(form.email.trim(), 'register')
      .then((response) => {
        navigation.navigate('EmailOtp', {
          purpose: 'register',
          prefillEmail: form.email.trim(),
          prefillName: form.name.trim(),
          prefillOtpRequestId: response.otp_request_id,
        });
      })
      .catch((error: unknown) => {
        const apiError = error as ApiError;
        if (apiError.status === 422 && apiError.errors !== undefined) {
          applyApiError(apiError.errors);
        } else {
          setBannerError(apiError.message ?? 'Failed to send verification code.');
        }
      })
      .finally(() => setIsSubmitting(false));
  }, [form.email, form.name, navigation, applyApiError]);

  const handleTogglePassword = useCallback((): void => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleGoToLogin = useCallback((): void => {
    navigation.navigate('Login');
  }, [navigation]);

  return {
    form,
    isSubmitting,
    isGoogleSigningIn,
    isAppleSigningIn,
    isLineSigningIn,
    isRequestingOtp: phoneOtp.isRequestingOtp,
    isVerifyingOtp: phoneOtp.isVerifyingOtp,
    resendSecondsLeft: phoneOtp.resendSecondsLeft,
    phoneNumber: phoneOtp.phoneNumber,
    otpCode: phoneOtp.otpCode,
    bannerError: bannerError || phoneOtp.otpError || googleBannerError || appleBannerError || lineBannerError,
    showPassword,
    handleNameChange,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmationChange,
    handlePhoneNumberChange: phoneOtp.handlePhoneNumberChange,
    handleOtpCodeChange: phoneOtp.handleOtpCodeChange,
    handleTogglePassword,
    handleSubmit,
    handleRequestOtp: phoneOtp.handleRequestOtp,
    handleVerifyOtp: phoneOtp.handleVerifyOtp,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleLineSignIn,
    handleGoToLogin,
  };
}
