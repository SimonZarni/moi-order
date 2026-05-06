import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAppleAuth } from '@/features/auth/hooks/useAppleAuth';
import { useLineAuth } from '@/features/auth/hooks/useLineAuth';
import { useLoginForm, UseLoginFormResult } from '@/features/auth/hooks/useLoginForm';
import { usePhoneOtpAuth } from '@/features/auth/hooks/usePhoneOtpAuth';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import { checkEmail as checkEmailApi, login } from '@/shared/api/auth';
import { useAuthStore } from '@/shared/store/authStore';
import { getAccountErrorMessage, DOMAIN_ERROR_MESSAGES, ERROR_CODES } from '@/shared/constants/errorCodes';
import { MESSAGES } from '@/shared/constants/messages';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

export interface UseLoginScreenResult {
  form: UseLoginFormResult['form'];
  step: 'email' | 'password';
  isCheckingEmail: boolean;
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
  handleEmailChange: (value: string) => void;
  handlePasswordChange: (value: string) => void;
  handlePhoneNumberChange: (value: string) => void;
  handleOtpCodeChange: (value: string) => void;
  handleTogglePassword: () => void;
  handleContinue: () => void;
  handleBackToEmail: () => void;
  handleSubmit: () => void;
  handleRequestOtp: () => Promise<void>;
  handleVerifyOtp: () => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
  handleAppleSignIn: () => Promise<void>;
  handleLineSignIn: () => Promise<void>;
  handleGoToRegister: () => void;
  handleGoToForgotPassword: () => void;
}

export function useLoginScreen(): UseLoginScreenResult {
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const { form, handleEmailChange, handlePasswordChange, validateEmail, validate, applyApiError } = useLoginForm();
  const phoneOtp = usePhoneOtpAuth({ purpose: 'login' });
  const { handleGoogleSignIn, isGoogleSigningIn, googleBannerError } = useGoogleAuth(form.email.trim());
  const { handleAppleSignIn, isAppleSigningIn, appleBannerError }    = useAppleAuth();
  const { handleLineSignIn, isLineSigningIn, lineBannerError }        = useLineAuth();
  const [step, setStep]             = useState<'email' | 'password'>('email');
  const [bannerError, setBannerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: runCheckEmail, isPending: isCheckingEmail } = useMutation({
    mutationFn: () => checkEmailApi(form.email.trim().toLowerCase()),
    onSuccess: ({ method }) => {
      setBannerError('');
      if (method === 'not_found') {
        setBannerError('No account found with this email. Create one?');
        return;
      }
      if (method === 'google') { void handleGoogleSignIn(); return; }
      if (method === 'apple')  { void handleAppleSignIn();  return; }
      if (method === 'line')   { void handleLineSignIn();   return; }
      setStep('password');
    },
    onError: (error: ApiError) => {
      setBannerError(
        DOMAIN_ERROR_MESSAGES[error.code] ?? error.message ?? MESSAGES.genericError,
      );
    },
  });

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

  const handleContinue = useCallback((): void => {
    setBannerError('');
    if (validateEmail()) runCheckEmail();
  }, [validateEmail, runCheckEmail]);

  const handleBackToEmail = useCallback((): void => {
    setStep('email');
    setBannerError('');
  }, []);

  const handleSubmit = useCallback((): void => {
    setBannerError('');
    if (validate()) mutate();
  }, [validate, mutate]);

  const handleTogglePassword = useCallback((): void => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleGoToRegister = useCallback((): void => {
    navigation.navigate('Register');
  }, [navigation]);

  const handleGoToForgotPassword = useCallback((): void => {
    navigation.navigate('ForgotPassword');
  }, [navigation]);

  const combinedBannerError = bannerError
    || phoneOtp.otpError
    || googleBannerError
    || appleBannerError
    || lineBannerError;

  return {
    form,
    step,
    isCheckingEmail,
    isSubmitting,
    isGoogleSigningIn,
    isAppleSigningIn,
    isLineSigningIn,
    isRequestingOtp:    phoneOtp.isRequestingOtp,
    isVerifyingOtp:     phoneOtp.isVerifyingOtp,
    resendSecondsLeft:  phoneOtp.resendSecondsLeft,
    phoneNumber:        phoneOtp.phoneNumber,
    otpCode:            phoneOtp.otpCode,
    bannerError:        combinedBannerError,
    showPassword,
    handleEmailChange,
    handlePasswordChange,
    handlePhoneNumberChange: phoneOtp.handlePhoneNumberChange,
    handleOtpCodeChange:     phoneOtp.handleOtpCodeChange,
    handleTogglePassword,
    handleContinue,
    handleBackToEmail,
    handleSubmit,
    handleRequestOtp:  phoneOtp.handleRequestOtp,
    handleVerifyOtp:   phoneOtp.handleVerifyOtp,
    handleGoogleSignIn,
    handleAppleSignIn,
    handleLineSignIn,
    handleGoToRegister,
    handleGoToForgotPassword,
  };
}
