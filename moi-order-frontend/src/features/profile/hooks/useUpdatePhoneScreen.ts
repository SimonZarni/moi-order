import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { requestPhoneUpdateOtp, updatePhone, PhoneOtpResult } from '@/shared/api/profile';
import { useAuthStore } from '@/shared/store/authStore';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { ApiError, User } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { MESSAGES } from '@/shared/constants/messages';

export interface UseUpdatePhoneScreenResult {
  phoneNumber: string;
  otp: string;
  phoneError: string | null;
  otpError: string | null;
  bannerError: string;
  otpRequestId: string | null;
  expiresIn: number | null;
  isSendingOtp: boolean;
  isUpdating: boolean;
  handlePhoneChange: (value: string) => void;
  handleOtpChange: (value: string) => void;
  handleRequestOtp: () => void;
  handleUpdatePhone: () => void;
  handleBack: () => void;
}

export function useUpdatePhoneScreen(): UseUpdatePhoneScreenResult {
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  const [phoneNumber, setPhoneNumber]       = useState('');
  const [otp, setOtp]                       = useState('');
  const [phoneError, setPhoneError]         = useState<string | null>(null);
  const [otpError, setOtpError]             = useState<string | null>(null);
  const [bannerError, setBannerError]       = useState('');
  const [otpRequestId, setOtpRequestId]     = useState<string | null>(null);
  const [expiresIn, setExpiresIn]           = useState<number | null>(null);

  const { mutate: sendOtp, isPending: isSendingOtp } = useMutation({
    mutationFn: () => requestPhoneUpdateOtp(phoneNumber.trim()),
    onSuccess: (result: PhoneOtpResult) => {
      setBannerError('');
      setOtpRequestId(result.otp_request_id);
      setExpiresIn(result.expires_in);
      setOtp('');
      setOtpError(null);
    },
    onError: (error: ApiError) => {
      if (error.status === 422 && error.errors !== undefined) {
        setPhoneError(error.errors['phone_number']?.[0] ?? null);
      } else {
        setBannerError(error.message ?? MESSAGES.genericError);
      }
    },
  });

  const { mutate: submitUpdate, isPending: isUpdating } = useMutation({
    mutationFn: () => updatePhone(otpRequestId!, phoneNumber.trim(), otp.trim()),
    onSuccess: (user: User) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, user);
      updateUser(user);
      navigation.goBack();
    },
    onError: (error: ApiError) => {
      if (error.status === 422 && error.errors !== undefined) {
        setOtpError(
          error.errors['otp']?.[0]
          ?? error.errors['otp_request_id']?.[0]
          ?? error.errors['phone_number']?.[0]
          ?? null,
        );
      } else {
        setBannerError(error.message ?? MESSAGES.genericError);
      }
    },
  });

  const handlePhoneChange = useCallback((value: string): void => {
    setPhoneNumber(value);
    setPhoneError(null);
    setBannerError('');
    setOtpRequestId(null);
    setExpiresIn(null);
    setOtp('');
    setOtpError(null);
  }, []);

  const handleOtpChange = useCallback((value: string): void => {
    setOtp(value);
    setOtpError(null);
  }, []);

  const handleRequestOtp = useCallback((): void => {
    if (!phoneNumber.trim()) {
      setPhoneError('Phone number is required.');
      return;
    }
    sendOtp();
  }, [phoneNumber, sendOtp]);

  const handleUpdatePhone = useCallback((): void => {
    if (!otp.trim()) {
      setOtpError('Verification code is required.');
      return;
    }
    submitUpdate();
  }, [otp, submitUpdate]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return {
    phoneNumber,
    otp,
    phoneError,
    otpError,
    bannerError,
    otpRequestId,
    expiresIn,
    isSendingOtp,
    isUpdating,
    handlePhoneChange,
    handleOtpChange,
    handleRequestOtp,
    handleUpdatePhone,
    handleBack,
  };
}
