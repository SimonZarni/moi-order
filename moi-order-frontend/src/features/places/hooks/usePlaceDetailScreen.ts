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
  isRefreshing: boolean;
  isError: boolean;
  error: ApiError | null;
  /** Favorite state — only meaningful when isLoggedIn is true. */
  isFavorited: boolean;
  isTogglingFavorite: boolean;
  /** Whether the current user is authenticated (gates heart button rendering). */
  isLoggedIn: boolean;
  isDescriptionExpanded: boolean;
  isLongDescription: boolean;
  handleToggleDescription: () => void;
  handleRefresh: () => void;
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
  const { place, isLoading, isRefreshing, isError, error, refetch } = usePlaceDetail(placeId);
  const { isFavorited, isToggling, handleToggle } = usePlaceFavorite(placeId);
  const [viewerIndex, setViewerIndex] = useState<number>(-1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // images is only present on the detail response — guard against undefined
  const coverImage    = useMemo(() => place?.images?.[0] ?? null, [place?.images]);
  const galleryImages = useMemo(() => place?.images?.slice(1) ?? [], [place?.images]);

  // Description longer than this threshold gets collapsed to 5 lines
  const isLongDescription = useMemo(
    () => (place?.long_description?.length ?? 0) > 320,
    [place?.long_description],
  );

  // All images as { uri } — format expected by react-native-image-viewing
  const viewerImages = useMemo(
    () => (place?.images ?? []).map((img: PlaceImage) => ({ uri: img.url })),
    [place?.images],
  );

  const handleToggleDescription = useCallback((): void => {
    setIsDescriptionExpanded(prev => !prev);
  }, []);

  const handleImagePress = useCallback((index: number) => {
    setViewerIndex(index);
  }, []);

  const handleViewAllImages = useCallback(() => {
    setViewerIndex(0);
  }, []);

  const handleCloseImageViewer = useCallback(() => {
    setViewerIndex(-1);
  }, []);

  const handleRefresh = useCallback(() => { refetch(); }, [refetch]);

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
    if (place?.google_map_url) {
      Linking.openURL(place.google_map_url);
    } else if (place?.latitude && place?.longitude) {
      Linking.openURL(`https://maps.google.com/?q=${place.latitude},${place.longitude}`);
    }
  }, [place?.google_map_url, place?.latitude, place?.longitude]);

  return {
    place,
    coverImage,
    galleryImages,
    viewerImages,
    viewerIndex,
    isLoading,
    isRefreshing,
    isError,
    error,
    isFavorited,
    isTogglingFavorite: isToggling,
    isLoggedIn,
    isDescriptionExpanded,
    isLongDescription,
    handleToggleDescription,
    handleRefresh,
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