import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getRestaurant, uploadRestaurantPhoto } from '../../../api/restaurant';
import { useAuthStore } from '../../../store/authStore';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL } from '../../../shared/constants/config';
import type { Restaurant, MerchantUser } from '../../../types/models';
import type { MerchantStackParamList } from '../../../types/navigation';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { normalizePickedImage } from '../../../shared/utils/imageUtils';

interface UseProfileScreenResult {
  restaurant: Restaurant | null;
  user: MerchantUser | null;
  isLoading: boolean;
  isError: boolean;
  handleLogout: () => void;
  handleUploadCover: () => Promise<void>;
  handleUploadLogo: () => Promise<void>;
  handleNavigateToBusinessProfile: () => void;
}

export function useProfileScreen(): UseProfileScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();

  const { data: restaurantResult, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.RESTAURANT,
    queryFn: getRestaurant,
    staleTime: CACHE_TTL.USER,
    enabled: !!user?.is_merchant,
  });
  const restaurant = restaurantResult?.restaurant;

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

  const handleNavigateToBusinessProfile = useCallback(() => {
    navigation.navigate('BusinessProfile');
  }, [navigation]);

  const handleUploadPhoto = useCallback(
    async (field: 'cover_photo' | 'logo') => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]) return;
      const img = await normalizePickedImage(result.assets[0], field);
      const formData = new FormData();
      if (Platform.OS === 'web') {
        const blob = await fetch(img.uri).then((r) => r.blob());
        if (img.uri.startsWith('blob:')) URL.revokeObjectURL(img.uri);
        formData.append('file', new File([blob], img.name, { type: img.type }));
      } else {
        formData.append('file', { uri: img.uri, name: img.name, type: img.type } as unknown as Blob);
      }
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
    handleNavigateToBusinessProfile,
  };
}
