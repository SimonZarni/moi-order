import { useCallback, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';

import { useTestServiceForm, UseTestServiceFormResult } from './useTestServiceForm';
import { submitTestService } from '@/shared/api/submissions';
import { useAuthStore } from '@/shared/store/authStore';
import { MESSAGES } from '@/shared/constants/messages';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { stripAsset } from '@/shared/utils/stripAsset';

type RouteParams = RouteProp<RootStackParamList, 'TestServiceForm'>;

export interface UseTestServiceFormScreenResult {
  form:                 UseTestServiceFormResult['form'];
  price:                number;
  isSubmitting:         boolean;
  bannerError:          string;
  handleFullNameChange: (value: string) => void;
  handlePhoneChange:    (value: string) => void;
  handlePickPhoto:      () => Promise<void>;
  handleSubmit:         () => void;
  handleBack:           () => void;
}

export function useTestServiceFormScreen(): UseTestServiceFormScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route      = useRoute<RouteParams>();
  const { serviceTypeId, price } = route.params;
  const { isLoggedIn } = useAuthStore();

  const { form, handleFullNameChange, handlePhoneChange, handlePhotoChange, validate, applyApiError } =
    useTestServiceForm();

  const [bannerError, setBannerError] = useState('');

  const pickImage = useCallback(async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!granted) {
      const request = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!request.granted) {
        setBannerError('Photo library access is required to upload a photo.');
        return null;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality:    0.85,
      allowsEditing: false,
      base64: false,
    });
    if (result.canceled || result.assets.length === 0) return null;
    const asset = result.assets[0];
    return asset != null ? stripAsset(asset) : null;
  }, []);

  const handlePickPhoto = useCallback(async (): Promise<void> => {
    const asset = await pickImage();
    if (asset) handlePhotoChange(asset);
  }, [pickImage, handlePhotoChange]);

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: () =>
      submitTestService({
        idempotencyKey: Crypto.randomUUID(),
        serviceTypeId,
        fullName:       form.fullName.trim(),
        phone:          form.phone.trim(),
        photo:          form.photo!,
      }),
    onSuccess: (submission) => navigation.navigate('Payment', { submissionId: submission.id }),
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
    handlePickPhoto,
    handleSubmit,
    handleBack,
  };
}
