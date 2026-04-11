import { useCallback, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';

import {
  useAirportFastTrackForm,
  UseAirportFastTrackFormResult,
} from './useAirportFastTrackForm';
import { submitAirportFastTrack } from '@/shared/api/submissions';
import { useAuthStore } from '@/shared/store/authStore';
import { MESSAGES } from '@/shared/constants/messages';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

type RouteParams = RouteProp<RootStackParamList, 'AirportFastTrackForm'>;

export interface UseAirportFastTrackFormScreenResult {
  form: UseAirportFastTrackFormResult['form'];
  price: number;
  isSubmitting: boolean;
  isSuccess: boolean;
  bannerError: string;
  handleFullNameChange:       (value: string) => void;
  handlePhoneChange:          (value: string) => void;
  handlePickUpperBodyPhoto:   () => Promise<void>;
  handlePickAirplaneTicket:   () => Promise<void>;
  handleSubmit: () => void;
  handleBack:   () => void;
}

export function useAirportFastTrackFormScreen(): UseAirportFastTrackFormScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { serviceTypeId, price } = route.params;
  const { isLoggedIn } = useAuthStore();

  const {
    form,
    handleFullNameChange,
    handlePhoneChange,
    handleUpperBodyPhotoChange,
    handleAirplaneTicketChange,
    validate,
    applyApiError,
  } = useAirportFastTrackForm();

  const [bannerError, setBannerError] = useState('');
  const [isSuccess, setIsSuccess]     = useState(false);

  // ── Image picker ─────────────────────────────────────────────────────────

  const pickImage = useCallback(async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setBannerError('Photo library access is required to upload documents.');
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality:    0.85,
      allowsEditing: false,
    });
    if (result.canceled || result.assets.length === 0) return null;
    return result.assets[0] ?? null;
  }, []);

  const handlePickUpperBodyPhoto = useCallback(async (): Promise<void> => {
    const asset = await pickImage();
    if (asset) handleUpperBodyPhotoChange(asset);
  }, [pickImage, handleUpperBodyPhotoChange]);

  const handlePickAirplaneTicket = useCallback(async (): Promise<void> => {
    const asset = await pickImage();
    if (asset) handleAirplaneTicketChange(asset);
  }, [pickImage, handleAirplaneTicketChange]);

  // ── Submit ────────────────────────────────────────────────────────────────

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: () =>
      submitAirportFastTrack({
        idempotencyKey: Crypto.randomUUID(),
        serviceTypeId,
        fullName:       form.fullName.trim(),
        phone:          form.phone.trim(),
        upperBodyPhoto: form.upperBodyPhoto!,
        airplaneTicket: form.airplaneTicket!,
      }),
    onSuccess: () => setIsSuccess(true),
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
    isSuccess,
    bannerError,
    handleFullNameChange,
    handlePhoneChange,
    handlePickUpperBodyPhoto,
    handlePickAirplaneTicket,
    handleSubmit,
    handleBack,
  };
}
