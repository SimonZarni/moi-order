import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRestaurant, uploadRestaurantPhoto } from '../../../api/restaurant';
import { useAuthStore } from '../../../store/authStore';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL } from '../../../shared/constants/config';
import type { Restaurant, MerchantUser } from '../../../types/models';
import * as ImagePicker from 'expo-image-picker';

interface UseProfileScreenResult {
  restaurant: Restaurant | null;
  user: MerchantUser | null;
  isLoading: boolean;
  isError: boolean;
  handleLogout: () => void;
  handleUploadCover: () => Promise<void>;
  handleUploadLogo: () => Promise<void>;
}

export function useProfileScreen(): UseProfileScreenResult {
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();

  const { data: restaurant, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.RESTAURANT,
    queryFn: getRestaurant,
    staleTime: CACHE_TTL.USER,
    enabled: !!user?.is_merchant,
  });

  const { mutateAsync: mutatePhoto } = useMutation({
    mutationFn: ({ field, form }: { field: 'cover_photo' | 'logo'; form: FormData }) =>
      uploadRestaurantPhoto(field, form),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESTAURANT });
    },
  });

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleUploadPhoto = useCallback(
    async (field: 'cover_photo' | 'logo') => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        name: asset.uri.split('/').pop() ?? 'photo.jpg',
        type: 'image/jpeg',
      } as unknown as Blob);
      await mutatePhoto({ field, form: formData });
    },
    [mutatePhoto],
  );

  const handleUploadCover = useCallback(
    () => handleUploadPhoto('cover_photo'),
    [handleUploadPhoto],
  );

  const handleUploadLogo = useCallback(
    () => handleUploadPhoto('logo'),
    [handleUploadPhoto],
  );

  const restaurantData = useMemo(() => restaurant ?? null, [restaurant]);

  return {
    restaurant: restaurantData,
    user: user ?? null,
    isLoading,
    isError,
    handleLogout,
    handleUploadCover,
    handleUploadLogo,
  };
}
