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
import { submitDynamic } from '@/shared/api/submissions';
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
    mutationFn: () => {
      const fields: Record<string, string> = {
        full_name:        form.fullName.trim(),
        passport_no:      form.passportNo.trim(),
        identity_card_no: form.identityCardNo.trim(),
        myanmar_address:  form.myanmarAddress.trim(),
        thai_address:     form.thaiAddress.trim(),
        phone:            form.phone.trim(),
        bank_name:        form.bankName.trim(),
      };
      const job     = form.currentJob.trim();
      const company = form.company.trim();
      if (job)     fields.current_job = job;
      if (company) fields.company     = company;

      return submitDynamic({
        idempotencyKey: Crypto.randomUUID(),
        serviceTypeId,
        fields,
        files: {
          passport_size_photo:  form.passportSizePhoto!,
          passport_bio_page:    form.passportBioPage!,
          visa_page:            form.visaPage!,
          identity_card_front:  form.identityCardFront!,
          identity_card_back:   form.identityCardBack!,
          tm30:                 form.tm30!,
        },
      });
    },
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