import { useCallback, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';

import {
  useEmbassyBankForm,
  UseEmbassyBankFormResult,
} from './useEmbassyBankForm';
import { submitEmbassyBank } from '@/shared/api/submissions';
import { useAuthStore } from '@/shared/store/authStore';
import { MESSAGES } from '@/shared/constants/messages';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { stripAsset } from '@/shared/utils/stripAsset';

type RouteParams = RouteProp<RootStackParamList, 'EmbassyBankForm'>;

export interface UseEmbassyBankFormScreenResult {
  form: UseEmbassyBankFormResult['form'];
  price: number;
  isSubmitting: boolean;
  isSuccess: boolean;
  bannerError: string;
  handleFullNameChange:          (v: string) => void;
  handlePassportNoChange:        (v: string) => void;
  handleIdentityCardNoChange:    (v: string) => void;
  handleCurrentJobChange:        (v: string) => void;
  handleCompanyChange:           (v: string) => void;
  handleMyanmarAddressChange:    (v: string) => void;
  handleThaiAddressChange:       (v: string) => void;
  handlePhoneChange:             (v: string) => void;
  handleBankNameChange:          (v: string) => void;
  handlePickPassportSizePhoto:   () => Promise<void>;
  handlePickPassportBioPage:     () => Promise<void>;
  handlePickVisaPage:            () => Promise<void>;
  handlePickIdentityCardFront:   () => Promise<void>;
  handlePickIdentityCardBack:    () => Promise<void>;
  handlePickTm30:                () => Promise<void>;
  handleSubmit: () => void;
  handleBack:   () => void;
}

export function useEmbassyBankFormScreen(): UseEmbassyBankFormScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route      = useRoute<RouteParams>();
  const { serviceTypeId, price } = route.params;
  const { isLoggedIn } = useAuthStore();

  const {
    form,
    handleFullNameChange,
    handlePassportNoChange,
    handleIdentityCardNoChange,
    handleCurrentJobChange,
    handleCompanyChange,
    handleMyanmarAddressChange,
    handleThaiAddressChange,
    handlePhoneChange,
    handleBankNameChange,
    handlePassportSizePhotoChange,
    handlePassportBioPageChange,
    handleVisaPageChange,
    handleIdentityCardFrontChange,
    handleIdentityCardBackChange,
    handleTm30Change,
    validate,
    applyApiError,
  } = useEmbassyBankForm();

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

  const handlePickPassportSizePhoto  = useCallback(async () => { const a = await pickImage(); if (a) handlePassportSizePhotoChange(a);  }, [pickImage, handlePassportSizePhotoChange]);
  const handlePickPassportBioPage    = useCallback(async () => { const a = await pickImage(); if (a) handlePassportBioPageChange(a);    }, [pickImage, handlePassportBioPageChange]);
  const handlePickVisaPage           = useCallback(async () => { const a = await pickImage(); if (a) handleVisaPageChange(a);           }, [pickImage, handleVisaPageChange]);
  const handlePickIdentityCardFront  = useCallback(async () => { const a = await pickImage(); if (a) handleIdentityCardFrontChange(a);  }, [pickImage, handleIdentityCardFrontChange]);
  const handlePickIdentityCardBack   = useCallback(async () => { const a = await pickImage(); if (a) handleIdentityCardBackChange(a);   }, [pickImage, handleIdentityCardBackChange]);
  const handlePickTm30               = useCallback(async () => { const a = await pickImage(); if (a) handleTm30Change(a);               }, [pickImage, handleTm30Change]);

  // ── Submit ────────────────────────────────────────────────────────────────

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: () =>
      submitEmbassyBank({
        idempotencyKey:    Crypto.randomUUID(),
        serviceTypeId,
        fullName:          form.fullName.trim(),
        passportNo:        form.passportNo.trim(),
        identityCardNo:    form.identityCardNo.trim(),
        currentJob:        form.currentJob.trim() || null,
        company:           form.company.trim()    || null,
        myanmarAddress:    form.myanmarAddress.trim(),
        thaiAddress:       form.thaiAddress.trim(),
        phone:             form.phone.trim(),
        bankName:          form.bankName.trim(),
        passportSizePhoto: form.passportSizePhoto!,
        passportBioPage:   form.passportBioPage!,
        visaPage:          form.visaPage!,
        identityCardFront: form.identityCardFront!,
        identityCardBack:  form.identityCardBack!,
        tm30:              form.tm30!,
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
    handlePassportNoChange,
    handleIdentityCardNoChange,
    handleCurrentJobChange,
    handleCompanyChange,
    handleMyanmarAddressChange,
    handleThaiAddressChange,
    handlePhoneChange,
    handleBankNameChange,
    handlePickPassportSizePhoto,
    handlePickPassportBioPage,
    handlePickVisaPage,
    handlePickIdentityCardFront,
    handlePickIdentityCardBack,
    handlePickTm30,
    handleSubmit,
    handleBack,
  };
}