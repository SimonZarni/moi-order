import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useBusinessProfileData } from './useBusinessProfileData';
import { useBusinessProfileForm } from './useBusinessProfileForm';
import type { MerchantStackParamList } from '../../../types/navigation';
import type { BusinessProfile } from '../../../types/models';
import type { KycDocType } from '../../../types/enums';
import { extractApiError } from '../../../api/client';
import { normalizePickedImage } from '../../../shared/utils/imageUtils';
import { DOMAIN_MESSAGES, MESSAGES } from '../../../shared/constants/messages';

export interface UseBusinessProfileScreenResult {
  profile: BusinessProfile | null;
  isLoading: boolean;
  isError: boolean;
  // phone editing
  isEditingPhone: boolean;
  phoneValue: string;
  phoneError: string | undefined;
  isSavingPhone: boolean;
  handleStartEditPhone: () => void;
  handleCancelEditPhone: () => void;
  handleChangePhone: (val: string) => void;
  handleSavePhone: () => void;
  // email editing
  isEditingEmail: boolean;
  emailValue: string;
  emailError: string | undefined;
  isSavingEmail: boolean;
  handleStartEditEmail: () => void;
  handleCancelEditEmail: () => void;
  handleChangeEmail: (val: string) => void;
  handleSaveEmail: () => void;
  // document upload
  handleUploadDocument: (type: KycDocType) => Promise<void>;
  uploadingDocType: KycDocType | null;
  docUploadError: string | null;
  // navigation
  handleBack: () => void;
}

export function useBusinessProfileScreen(): UseBusinessProfileScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();

  const { profile, isLoading, isError, updatePhone, updateEmail, uploadDocument } = useBusinessProfileData();
  const form = useBusinessProfileForm();

  const [uploadingDocType, setUploadingDocType] = useState<KycDocType | null>(null);
  const [docUploadError, setDocUploadError] = useState<string | null>(null);

  const handleStartEditPhone = useCallback(() => {
    form.handleStartEditPhone(profile?.kyc?.business_phone ?? null);
  }, [form, profile]);

  const handleStartEditEmail = useCallback(() => {
    form.handleStartEditEmail(profile?.user.email ?? '');
  }, [form, profile]);

  const handleSavePhone = useCallback(() => {
    if (!form.validate()) return;
    const phone = form.values.business_phone.trim() || null;
    updatePhone.mutate(phone, {
      onSuccess: () => form.handleCancelEdit(),
      onError: (err) => form.applyApiError(extractApiError(err)),
    });
  }, [form, updatePhone]);

  const handleSaveEmail = useCallback(() => {
    if (!form.validate()) return;
    const email = form.values.email.trim();
    updateEmail.mutate(email, {
      onSuccess: () => form.handleCancelEdit(),
      onError: (err) => form.applyApiError(extractApiError(err)),
    });
  }, [form, updateEmail]);

  const handleUploadDocument = useCallback(
    async (type: KycDocType) => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: false,
        quality: 0.85,
      });
      if (result.canceled || !result.assets[0]) return;
      const img = await normalizePickedImage(result.assets[0], 'document');
      setUploadingDocType(type);
      setDocUploadError(null);
      try {
        await uploadDocument.mutateAsync({ type, file: img });
      } catch (err) {
        const apiError = extractApiError(err as Error);
        const message = (apiError.code ? DOMAIN_MESSAGES[apiError.code] : undefined) ?? MESSAGES.genericError;
        setDocUploadError(message);
      } finally {
        setUploadingDocType(null);
      }
    },
    [uploadDocument],
  );

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  return {
    profile,
    isLoading,
    isError,
    isEditingPhone: form.isEditingPhone,
    phoneValue: form.values.business_phone,
    phoneError: form.errors.business_phone,
    isSavingPhone: updatePhone.isPending,
    handleStartEditPhone,
    handleCancelEditPhone: form.handleCancelEdit,
    handleChangePhone: form.handleChangePhone,
    handleSavePhone,
    isEditingEmail: form.isEditingEmail,
    emailValue: form.values.email,
    emailError: form.errors.email,
    isSavingEmail: updateEmail.isPending,
    handleStartEditEmail,
    handleCancelEditEmail: form.handleCancelEdit,
    handleChangeEmail: form.handleChangeEmail,
    handleSaveEmail,
    handleUploadDocument,
    uploadingDocType,
    docUploadError,
    handleBack,
  };
}
