import { useCallback, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';

import { useNinetyDayReportForm, UseNinetyDayReportFormResult } from './useNinetyDayReportForm';
import { submitDynamic } from '@/shared/api/submissions';
import { useAuthStore } from '@/shared/store/authStore';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { navigateAfterSubmission } from '@/shared/utils/navigateAfterOrder';
import { MESSAGES } from '@/shared/constants/messages';
import { pickAndCompressImage } from '@/shared/utils/pickAndCompressImage';

type RouteParams = RouteProp<RootStackParamList, 'NinetyDayReportForm'>;

export interface UseNinetyDayReportFormScreenResult {
  form: UseNinetyDayReportFormResult['form'];
  serviceTypeName: string;
  serviceTypeNameEn: string;
  price: number;
  isSubmitting: boolean;
  isSuccess: boolean;
  bannerError: string;
  handleFullNameChange: (value: string) => void;
  handlePhoneChange: (value: string) => void;
  handlePickPassportBioPage: () => Promise<void>;
  handlePickVisaPage: () => Promise<void>;
  handlePickOldSlip: () => Promise<void>;
  handleSubmit: () => void;
  handleBack: () => void;
}

export function useNinetyDayReportFormScreen(): UseNinetyDayReportFormScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { serviceTypeId, serviceTypeName, serviceTypeNameEn, price } = route.params;
  const { isLoggedIn } = useAuthStore();

  const {
    form,
    handleFullNameChange,
    handlePhoneChange,
    handlePassportBioPageChange,
    handleVisaPageChange,
    handleOldSlipChange,
    validate,
    applyApiError,
  } = useNinetyDayReportForm();

  const [bannerError, setBannerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // ── Image pickers ────────────────────────────────────────────────────────

  const pickImage = useCallback(
    (): Promise<ImagePicker.ImagePickerAsset | null> => pickAndCompressImage((msg) => setBannerError(msg)),
    [],
  );

  const handlePickPassportBioPage = useCallback(async (): Promise<void> => {
    const asset = await pickImage();
    if (asset !== null) handlePassportBioPageChange(asset);
  }, [pickImage, handlePassportBioPageChange]);

  const handlePickVisaPage = useCallback(async (): Promise<void> => {
    const asset = await pickImage();
    if (asset !== null) handleVisaPageChange(asset);
  }, [pickImage, handleVisaPageChange]);

  const handlePickOldSlip = useCallback(async (): Promise<void> => {
    const asset = await pickImage();
    if (asset !== null) handleOldSlipChange(asset);
  }, [pickImage, handleOldSlipChange]);

  // ── Submit ────────────────────────────────────────────────────────────────

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: () => submitDynamic({
      idempotencyKey: Crypto.randomUUID(),
      serviceTypeId,
      fields: { full_name: form.fullName.trim(), phone: form.phone.trim() },
      files:  {
        passport_bio_page: form.passportBioPage!,
        visa_page:         form.visaPage!,
        old_slip:          form.oldSlip!,
      },
    }),
    onSuccess: (submission) => navigateAfterSubmission(navigation, submission),
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

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return {
    form,
    serviceTypeName,
    serviceTypeNameEn,
    price,
    isSubmitting,
    isSuccess,
    bannerError,
    handleFullNameChange,
    handlePhoneChange,
    handlePickPassportBioPage,
    handlePickVisaPage,
    handlePickOldSlip,
    handleSubmit,
    handleBack,
  };
}