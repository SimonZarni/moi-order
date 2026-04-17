import { useCallback, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';

import {
  useCompanyRegistrationForm,
  UseCompanyRegistrationFormResult,
} from './useCompanyRegistrationForm';
import { submitDynamic } from '@/shared/api/submissions';
import { useAuthStore } from '@/shared/store/authStore';
import { MESSAGES } from '@/shared/constants/messages';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { stripAsset } from '@/shared/utils/stripAsset';

type RouteParams = RouteProp<RootStackParamList, 'CompanyRegistrationForm'>;

export interface UseCompanyRegistrationFormScreenResult {
  form: UseCompanyRegistrationFormResult['form'];
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

export function useCompanyRegistrationFormScreen(): UseCompanyRegistrationFormScreenResult {
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
  } = useCompanyRegistrationForm();

  const [bannerError, setBannerError] = useState('');
  const [isSuccess, setIsSuccess]     = useState(false);

  // ── Image picker ─────────────────────────────────────────────────────────

  const pickImage = useCallback(async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!granted) {
      const request = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!request.granted) {
        setBannerError('Photo library access is required to upload documents.');
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

  const handlePickPassportBioPage   = useCallback(async () => { const a = await pickImage(); if (a) handlePassportBioPageChange(a); },   [pickImage, handlePassportBioPageChange]);
  const handlePickVisaPage          = useCallback(async () => { const a = await pickImage(); if (a) handleVisaPageChange(a); },          [pickImage, handleVisaPageChange]);
  const handlePickIdentityCardFront = useCallback(async () => { const a = await pickImage(); if (a) handleIdentityCardFrontChange(a); }, [pickImage, handleIdentityCardFrontChange]);
  const handlePickIdentityCardBack  = useCallback(async () => { const a = await pickImage(); if (a) handleIdentityCardBackChange(a); },  [pickImage, handleIdentityCardBackChange]);
  const handlePickTm30              = useCallback(async () => { const a = await pickImage(); if (a) handleTm30Change(a); },              [pickImage, handleTm30Change]);

  // ── Submit ────────────────────────────────────────────────────────────────

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: () => submitDynamic({
      idempotencyKey: Crypto.randomUUID(),
      serviceTypeId,
      fields: { full_name: form.fullName.trim(), phone: form.phone.trim() },
      files:  {
        passport_bio_page:   form.passportBioPage!,
        visa_page:           form.visaPage!,
        identity_card_front: form.identityCardFront!,
        identity_card_back:  form.identityCardBack!,
        tm30:                form.tm30!,
      },
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