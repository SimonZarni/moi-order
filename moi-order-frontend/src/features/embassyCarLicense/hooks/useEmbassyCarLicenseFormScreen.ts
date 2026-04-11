import { useCallback, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';

import {
  useEmbassyCarLicenseForm,
  UseEmbassyCarLicenseFormResult,
} from './useEmbassyCarLicenseForm';
import { submitEmbassyCarLicense } from '@/shared/api/submissions';
import { useAuthStore } from '@/shared/store/authStore';
import { MESSAGES } from '@/shared/constants/messages';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

type RouteParams = RouteProp<RootStackParamList, 'EmbassyCarLicenseForm'>;

export interface UseEmbassyCarLicenseFormScreenResult {
  form: UseEmbassyCarLicenseFormResult['form'];
  price: number;
  isSubmitting: boolean;
  isSuccess: boolean;
  bannerError: string;
  handleFullNameChange:          (value: string) => void;
  handlePhoneChange:             (value: string) => void;
  handlePickPassportBioPage:     () => Promise<void>;
  handlePickVisaPage:            () => Promise<void>;
  handlePickIdentityCardFront:   () => Promise<void>;
  handlePickIdentityCardBack:    () => Promise<void>;
  handlePickTm30:                () => Promise<void>;
  handleSubmit: () => void;
  handleBack:   () => void;
}

export function useEmbassyCarLicenseFormScreen(): UseEmbassyCarLicenseFormScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { serviceTypeId, price } = route.params;
  const { isLoggedIn } = useAuthStore();

  const {
    form,
    handleFullNameChange,
    handlePhoneChange,
    handlePassportBioPageChange,
    handleVisaPageChange,
    handleIdentityCardFrontChange,
    handleIdentityCardBackChange,
    handleTm30Change,
    validate,
    applyApiError,
  } = useEmbassyCarLicenseForm();

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

  const handlePickPassportBioPage   = useCallback(async () => { const a = await pickImage(); if (a) handlePassportBioPageChange(a); },   [pickImage, handlePassportBioPageChange]);
  const handlePickVisaPage          = useCallback(async () => { const a = await pickImage(); if (a) handleVisaPageChange(a); },          [pickImage, handleVisaPageChange]);
  const handlePickIdentityCardFront = useCallback(async () => { const a = await pickImage(); if (a) handleIdentityCardFrontChange(a); }, [pickImage, handleIdentityCardFrontChange]);
  const handlePickIdentityCardBack  = useCallback(async () => { const a = await pickImage(); if (a) handleIdentityCardBackChange(a); },  [pickImage, handleIdentityCardBackChange]);
  const handlePickTm30              = useCallback(async () => { const a = await pickImage(); if (a) handleTm30Change(a); },              [pickImage, handleTm30Change]);

  // ── Submit ────────────────────────────────────────────────────────────────

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: () =>
      submitEmbassyCarLicense({
        idempotencyKey:    Crypto.randomUUID(),
        serviceTypeId,
        fullName:          form.fullName.trim(),
        phone:             form.phone.trim(),
        passportBioPage:   form.passportBioPage!,
        visaPage:          form.visaPage!,
        identityCardFront: form.identityCardFront!,
        identityCardBack:  form.identityCardBack!,
        tm30:              form.tm30!,
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
    handlePickPassportBioPage,
    handlePickVisaPage,
    handlePickIdentityCardFront,
    handlePickIdentityCardBack,
    handlePickTm30,
    handleSubmit,
    handleBack,
  };
}
