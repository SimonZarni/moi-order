import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useBusinessProfileData } from './useBusinessProfileData';
import { useBusinessProfileForm } from './useBusinessProfileForm';
import type { MerchantStackParamList } from '../../../types/navigation';
import type { BusinessProfile } from '../../../types/models';
import type { KycDocType } from '../../../types/enums';
import type { ApiError } from '../../../api/client';

export interface UseBusinessProfileScreenResult {
  profile: BusinessProfile | null;
  isLoading: boolean;
  isError: boolean;
  // phone editing
  isEditingPhone: boolean;
  phoneValue: string;
  phoneError: string | undefined;
  handleStartEditPhone: () => void;
  handleCancelEditPhone: () => void;
  handleChangePhone: (val: string) => void;
  handleSavePhone: () => Promise<void>;
  isSavingPhone: boolean;
  // document upload
  handleUploadDocument: (type: KycDocType) => Promise<void>;
  uploadingDocType: KycDocType | null;
  // navigation
  handleBack: () => void;
}

export function useBusinessProfileScreen(): UseBusinessProfileScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();

  const { profile, isLoading, isError, updatePhone, uploadDocument } = useBusinessProfileData();
  const form = useBusinessProfileForm();

  const [uploadingDocType, setUploadingDocType] = useState<KycDocType | null>(null);

  const handleStartEditPhone = useCallback(() => {
    form.handleStartEdit(profile?.kyc?.business_phone ?? null);
  }, [form, profile]);

  const handleSavePhone = useCallback(async () => {
    if (!form.validate()) return;
    const phone = form.values.business_phone.trim() || null;
    try {
      await updatePhone.mutateAsync(phone);
      form.handleCancelEdit();
    } catch (err) {
      form.applyApiError(err as ApiError);
    }
  }, [form, updatePhone]);

  const handleUploadDocument = useCallback(
    async (type: KycDocType) => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.85,
      });
      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      setUploadingDocType(type);
      try {
        await uploadDocument.mutateAsync({
          type,
          file: {
            uri: asset.uri,
            name: asset.uri.split('/').pop() ?? 'document.jpg',
            type: 'image/jpeg',
          },
        });
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
    isEditingPhone: form.isEditing,
    phoneValue: form.values.business_phone,
    phoneError: form.errors.business_phone,
    handleStartEditPhone,
    handleCancelEditPhone: form.handleCancelEdit,
    handleChangePhone: form.handleChangePhone,
    handleSavePhone,
    isSavingPhone: updatePhone.isPending,
    handleUploadDocument,
    uploadingDocType,
    handleBack,
  };
}
