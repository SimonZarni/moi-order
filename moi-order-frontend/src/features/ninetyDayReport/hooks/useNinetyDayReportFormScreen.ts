import { useCallback, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';

import { useNinetyDayReportForm, UseNinetyDayReportFormResult } from './useNinetyDayReportForm';
import { submitNinetyDayReport } from '@/shared/api/submissions';
import { useAuthStore } from '@/shared/store/authStore';
import { ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { MESSAGES } from '@/shared/constants/messages';
import { stripAsset } from '@/shared/utils/stripAsset';

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
    mutationFn: () => {
      return submitNinetyDayReport({
        idempotencyKey:  Crypto.randomUUID(),
        serviceTypeId,
        fullName:        form.fullName.trim(),
        phone:           form.phone.trim(),
        passportBioPage: form.passportBioPage!,
        visaPage:        form.visaPage!,
        oldSlip:         form.oldSlip!,
      });
    },
    onSuccess: (submission) => {
      navigation.navigate('Payment', { kind: 'submission', submissionId: submission.id });
    },
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