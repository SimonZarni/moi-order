import { useCallback, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';

import { useTestServiceForm, UseTestServiceFormResult } from './useTestServiceForm';
import { submitTestService } from '@/shared/api/submissions';
import { useAuthStore } from '@/shared/store/authStore';
import { MESSAGES } from '@/shared/constants/messages';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

type RouteParams = RouteProp<RootStackParamList, 'TestServiceForm'>;

export interface UseTestServiceFormScreenResult {
  form:                 UseTestServiceFormResult['form'];
  price:                number;
  isSubmitting:         boolean;
  bannerError:          string;
  handleFullNameChange: (value: string) => void;
  handlePhoneChange:    (value: string) => void;
  handleSubmit:         () => void;
  handleBack:           () => void;
}

export function useTestServiceFormScreen(): UseTestServiceFormScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route      = useRoute<RouteParams>();
  const { serviceTypeId, price } = route.params;
  const { isLoggedIn } = useAuthStore();

  const { form, handleFullNameChange, handlePhoneChange, validate, applyApiError } =
    useTestServiceForm();

  const [bannerError, setBannerError] = useState('');

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: () =>
      submitTestService({
        idempotencyKey: Crypto.randomUUID(),
        serviceTypeId,
        fullName:       form.fullName.trim(),
        phone:          form.phone.trim(),
      }),
    onSuccess: (submission) => navigation.navigate('Payment', { kind: 'submission', submissionId: submission.id }),
    onError: (error: ApiError) => {
      if (error.status === 422 && error.errors !== undefined) {
        applyApiError(error.errors);
      } else {
        setBannerError(error.message ?? MESSAGES.genericError);
      }
    },
  });

  const handleSubmit = useCallback((): void => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
    setBannerError('');
    if (validate()) mutate();
  }, [isLoggedIn, navigation, validate, mutate]);

  const handleBack = useCallback((): void => { navigation.goBack(); }, [navigation]);

  return {
    form,
    price,
    isSubmitting,
    bannerError,
    handleFullNameChange,
    handlePhoneChange,
    handleSubmit,
    handleBack,
  };
}
