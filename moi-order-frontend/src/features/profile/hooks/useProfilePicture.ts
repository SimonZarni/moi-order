import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';

import { uploadProfilePicture, removeProfilePicture } from '@/shared/api/profile';
import { useAuthStore } from '@/shared/store/authStore';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { ApiError, User } from '@/types/models';

export interface UseProfilePictureResult {
  isUploadingPicture: boolean;
  isRemovingPicture: boolean;
  handlePickAndUpload: () => Promise<void>;
  handleRemovePicture: () => void;
}

export function useProfilePicture(user: User | null): UseProfilePictureResult {
  const queryClient = useQueryClient();
  const [isUploadingPicture, setIsUploading] = useState(false);
  const [isRemovingPicture, setIsRemoving]   = useState(false);

  const syncUser = useCallback((updated: User): void => {
    queryClient.setQueryData(QUERY_KEYS.AUTH.ME, updated);
    useAuthStore.getState().updateUser(updated);
  }, [queryClient]);

  const handlePickAndUpload = useCallback(async (): Promise<void> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow access to your photo library to set a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (!asset) return;

    try {
      setIsUploading(true);
      const updated = await uploadProfilePicture(asset.uri);
      syncUser(updated);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      Alert.alert('Upload failed', apiError.message ?? 'Could not upload profile picture.');
    } finally {
      setIsUploading(false);
    }
  }, [syncUser]);

  const handleRemovePicture = useCallback((): void => {
    if (!user?.profile_picture_url) return;

    Alert.alert('Remove photo', 'Remove your profile picture?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsRemoving(true);
            const updated = await removeProfilePicture();
            syncUser(updated);
          } catch (error: unknown) {
            const apiError = error as ApiError;
            Alert.alert('Error', apiError.message ?? 'Could not remove profile picture.');
          } finally {
            setIsRemoving(false);
          }
        },
      },
    ]);
  }, [user?.profile_picture_url, syncUser]);

  return { isUploadingPicture, isRemovingPicture, handlePickAndUpload, handleRemovePicture };
}
