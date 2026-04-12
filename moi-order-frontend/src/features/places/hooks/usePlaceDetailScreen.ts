import { useCallback, useMemo, useState } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { usePlaceDetail } from '@/features/places/hooks/usePlaceDetail';
import { usePlaceFavorite } from '@/features/places/hooks/usePlaceFavorite';
import { useAuthStore } from '@/shared/store/authStore';
import { Place, PlaceImage, ApiError } from '@/types/models';

export interface UsePlaceDetailScreenResult {
  place: Place | null;
  coverImage: PlaceImage | null;
  galleryImages: PlaceImage[];
  /** All images as { uri } objects ready for the image viewer. */
  viewerImages: { uri: string }[];
  /** Index of the tapped image within viewerImages. -1 = viewer closed. */
  viewerIndex: number;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  /** Favorite state — only meaningful when isLoggedIn is true. */
  isFavorited: boolean;
  isTogglingFavorite: boolean;
  /** Whether the current user is authenticated (gates heart button rendering). */
  isLoggedIn: boolean;
  handleBack: () => void;
  handleCallPhone: () => void;
  handleOpenWebsite: () => void;
  handleOpenMaps: () => void;
  handleToggleFavorite: () => void;
  handleImagePress: (index: number) => void;
  handleViewAllImages: () => void;
  handleCloseImageViewer: () => void;
}

export function usePlaceDetailScreen(placeId: number): UsePlaceDetailScreenResult {
  const navigation = useNavigation();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { place, isLoading, isError, error } = usePlaceDetail(placeId);
  const { isFavorited, isToggling, handleToggle } = usePlaceFavorite(placeId);
  const [viewerIndex, setViewerIndex] = useState<number>(-1);

  // images is only present on the detail response — guard against undefined
  const coverImage    = useMemo(() => place?.images?.[0] ?? null, [place?.images]);
  const galleryImages = useMemo(() => place?.images?.slice(1) ?? [], [place?.images]);
  // All images as { uri } — format expected by react-native-image-viewing
  const viewerImages = useMemo(
    () => (place?.images ?? []).map((img: PlaceImage) => ({ uri: img.url })),
    [place?.images],
  );

  const handleImagePress = useCallback((index: number) => {
    setViewerIndex(index);
  }, []);

  const handleViewAllImages = useCallback(() => {
    setViewerIndex(0);
  }, []);

  const handleCloseImageViewer = useCallback(() => {
    setViewerIndex(-1);
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleCallPhone = useCallback(() => {
    if (place?.contact_phone) {
      Linking.openURL(`tel:${place.contact_phone}`);
    }
  }, [place?.contact_phone]);

  const handleOpenWebsite = useCallback(() => {
    if (place?.website) {
      Linking.openURL(place.website);
    }
  }, [place?.website]);

  const handleOpenMaps = useCallback(() => {
    if (place?.latitude && place?.longitude) {
      Linking.openURL(`https://maps.google.com/?q=${place.latitude},${place.longitude}`);
    }
  }, [place?.latitude, place?.longitude]);

  return {
    place,
    coverImage,
    galleryImages,
    viewerImages,
    viewerIndex,
    isLoading,
    isError,
    error,
    isFavorited,
    isTogglingFavorite: isToggling,
    isLoggedIn,
    handleBack,
    handleCallPhone,
    handleOpenWebsite,
    handleOpenMaps,
    handleToggleFavorite: handleToggle,
    handleImagePress,
    handleViewAllImages,
    handleCloseImageViewer,
  };
}
