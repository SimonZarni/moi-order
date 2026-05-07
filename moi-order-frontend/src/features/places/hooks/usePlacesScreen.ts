import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as Location from 'expo-location';

import { usePlaces } from '@/features/places/hooks/usePlaces';
import { usePlacesSearch } from '@/features/places/hooks/usePlacesSearch';
import { useFavoritePlaceIds } from '@/features/places/hooks/useFavoritePlaceIds';
import { fetchPlaceDetail, fetchAllPlaces } from '@/shared/api/places';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { distanceKm, formatDistance } from '@/shared/utils/geo';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { Category, Place, Tag, ApiError } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

const SEARCH_DEBOUNCE_MS = 300;

// Mode cycles: all → nearby → favorites → all
export type PlacesMode = 'all' | 'nearby' | 'favorites';
export type PlacesLayout = 'feed' | 'grid';

export interface UsePlacesScreenResult {
  placesListRef: React.RefObject<FlatList<Place> | null>;
  displayedPlaces: Place[];
  categories: Category[];
  allTags: Tag[];
  isPlacesLoading: boolean;
  isPlacesError: boolean;
  isPlacesRefreshing: boolean;
  isPlacesFetchingNextPage: boolean;
  error: ApiError | null;
  query: string;
  selectedCategory: number | null;
  selectedCategoryLabel: string;
  selectedTagIds: number[];
  showPartialMatches: boolean;
  isCategoryModalOpen: boolean;
  isTagsModalOpen: boolean;
  mode: PlacesMode;
  layoutMode: PlacesLayout;
  distanceFor: (place: Place) => string | null;
  isFavorited: (placeId: number) => boolean;
  handleQueryChange: (text: string) => void;
  handleCategorySelectAndClose: (id: number | null) => void;
  handleCategoryModalOpen: () => void;
  handleCategoryModalClose: () => void;
  handleTagsModalOpen: () => void;
  handleTagsModalClose: () => void;
  handleTagToggle: (id: number) => void;
  handleClearAllTags: () => void;
  handlePlacesEndReached: () => void;
  handlePlacesRefresh: () => void;
  handlePlacePress: (placeId: number) => void;
  handleFavoritePress: (placeId: number) => void;
  handleModeToggle: () => void;
  handleSetLayout: (layout: PlacesLayout) => void;
  handleBack: () => void;
}

export function usePlacesScreen(): UsePlacesScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();

  const placesListRef = useRef<FlatList<Place>>(null);

  const [query, setQuery] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [mode, setMode] = useState<PlacesMode>('all');
  const [layoutMode, setLayoutMode] = useState<PlacesLayout>('feed');
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);

  useFocusEffect(
    useCallback(() => {
      placesListRef.current?.scrollToOffset({ offset: 0, animated: false });
      return () => { setQuery(''); };
    }, [])
  );

  // All places (unfiltered) — used for nearby sort and deriving tag list
  const { data: allPlaces = [] } = useQuery({
    queryKey: QUERY_KEYS.PLACES.ALL(),
    queryFn:  fetchAllPlaces,
    staleTime: CACHE_TTL.USER_DATA,
  });

  const {
    places,
    isLoading: isPlacesLoading,
    isError: isPlacesError,
    isRefreshing: isPlacesRefreshing,
    error,
    hasNextPage: placesHasNextPage,
    isFetchingNextPage: isPlacesFetchingNextPage,
    fetchNextPage: fetchPlacesNextPage,
    refetch: refetchPlaces,
  } = usePlaces(debouncedQuery);

  const { selectedCategory, filteredPlaces, categories, handleCategorySelect } = usePlacesSearch(places);
  const { favoriteIds, isFavorited, toggleFavoriteMutation } = useFavoritePlaceIds();

  useEffect(() => {
    filteredPlaces.forEach(p => {
      if (p.cover_image !== null) Image.prefetch(p.cover_image);
    });
  }, [filteredPlaces]);

  const selectedCategoryLabel = useMemo(
    () => categories.find(c => c.id === selectedCategory)?.name_en ?? 'All',
    [categories, selectedCategory],
  );

  // Distinct tags from all places — stable list for the filter row
  const allTags = useMemo((): Tag[] => {
    const seen = new Set<number>();
    return allPlaces.reduce<Tag[]>((acc, place) => {
      place.tags.forEach(tag => {
        if (!seen.has(tag.id)) {
          seen.add(tag.id);
          acc.push(tag);
        }
      });
      return acc;
    }, []);
  }, [allPlaces]);

  // Tag filtering: AND logic, fall back to OR when AND yields zero results
  const { tagFilteredPlaces, showPartialMatches } = useMemo(() => {
    if (selectedTagIds.length === 0) {
      return { tagFilteredPlaces: filteredPlaces, showPartialMatches: false };
    }
    const andResult = filteredPlaces.filter(p =>
      selectedTagIds.every(id => p.tags.some(t => t.id === id)),
    );
    if (andResult.length > 0) {
      return { tagFilteredPlaces: andResult, showPartialMatches: false };
    }
    const orResult = filteredPlaces.filter(p =>
      selectedTagIds.some(id => p.tags.some(t => t.id === id)),
    );
    return { tagFilteredPlaces: orResult, showPartialMatches: true };
  }, [filteredPlaces, selectedTagIds]);

  // Nearby: apply category + tag filters to the full allPlaces set for comprehensive sort
  const nearbyPlaces = useMemo((): Place[] => {
    if (mode !== 'nearby' || userCoords === null) return [];
    const [userLng, userLat] = userCoords;

    let pool = selectedCategory !== null
      ? allPlaces.filter(p => p.categories.some(c => c.id === selectedCategory))
      : allPlaces;

    if (selectedTagIds.length > 0) {
      const and = pool.filter(p => selectedTagIds.every(id => p.tags.some(t => t.id === id)));
      pool = and.length > 0
        ? and
        : pool.filter(p => selectedTagIds.some(id => p.tags.some(t => t.id === id)));
    }

    return pool
      .filter(p => p.latitude != null && p.longitude != null)
      .sort((a, b) =>
        distanceKm(userLat, userLng, a.latitude!, a.longitude!) -
        distanceKm(userLat, userLng, b.latitude!, b.longitude!),
      );
  }, [mode, userCoords, allPlaces, selectedCategory, selectedTagIds]);

  // Favorites: sort already-tag-filtered places
  const favoritesFirstPlaces = useMemo((): Place[] => {
    if (mode !== 'favorites') return [];
    return [...tagFilteredPlaces].sort((a, b) => {
      const aFav = favoriteIds.has(a.id) ? 0 : 1;
      const bFav = favoriteIds.has(b.id) ? 0 : 1;
      return aFav - bFav;
    });
  }, [mode, tagFilteredPlaces, favoriteIds]);

  const displayedPlaces = useMemo((): Place[] => {
    if (mode === 'nearby') return nearbyPlaces;
    if (mode === 'favorites') return favoritesFirstPlaces;
    return tagFilteredPlaces;
  }, [mode, nearbyPlaces, favoritesFirstPlaces, tagFilteredPlaces]);

  const distanceFor = useCallback((place: Place): string | null => {
    if (mode !== 'nearby' || userCoords === null || place.latitude == null || place.longitude == null) return null;
    const [userLng, userLat] = userCoords;
    return formatDistance(distanceKm(userLat, userLng, place.latitude, place.longitude));
  }, [mode, userCoords]);

  // ── Mode toggle ─────────────────────────────────────────────────────────
  const handleModeToggle = useCallback(async (): Promise<void> => {
    if (mode === 'all') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location Required', 'Allow location access to see places sorted by distance.');
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserCoords([loc.coords.longitude, loc.coords.latitude]);
        setMode('nearby');
      } catch {
        Alert.alert('Location Error', 'Could not get your location. Please try again.');
      }
    } else if (mode === 'nearby') {
      setMode('favorites');
    } else {
      setMode('all');
    }
  }, [mode]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleQueryChange       = useCallback((text: string): void => { setQuery(text); }, []);
  const handleCategoryModalOpen  = useCallback((): void => { setIsCategoryModalOpen(true); }, []);
  const handleCategoryModalClose = useCallback((): void => { setIsCategoryModalOpen(false); }, []);
  const handleTagsModalOpen      = useCallback((): void => { setIsTagsModalOpen(true); }, []);
  const handleTagsModalClose     = useCallback((): void => { setIsTagsModalOpen(false); }, []);
  const handleClearAllTags       = useCallback((): void => { setSelectedTagIds([]); }, []);

  const handleCategorySelectAndClose = useCallback((id: number | null): void => {
    handleCategorySelect(id);
    setIsCategoryModalOpen(false);
  }, [handleCategorySelect]);

  const handleTagToggle = useCallback((id: number): void => {
    setSelectedTagIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  }, []);

  const handlePlacesEndReached = useCallback((): void => {
    if (mode === 'all' && placesHasNextPage && !isPlacesFetchingNextPage) fetchPlacesNextPage();
  }, [mode, placesHasNextPage, isPlacesFetchingNextPage, fetchPlacesNextPage]);

  const handlePlacesRefresh = useCallback((): void => { refetchPlaces(); }, [refetchPlaces]);

  const handlePlacePress = useCallback((placeId: number): void => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.PLACES.DETAIL(placeId),
      queryFn:  () => fetchPlaceDetail(placeId),
      staleTime: CACHE_TTL.USER_DATA,
    });
    navigation.navigate('PlaceDetail', { placeId });
  }, [navigation, queryClient]);

  const handleFavoritePress = useCallback((placeId: number): void => {
    toggleFavoriteMutation(placeId);
  }, [toggleFavoriteMutation]);

  const handleSetLayout = useCallback((layout: PlacesLayout): void => { setLayoutMode(layout); }, []);
  const handleBack = useCallback((): void => { navigation.goBack(); }, [navigation]);

  return {
    placesListRef,
    displayedPlaces,
    categories,
    allTags,
    isPlacesLoading,
    isPlacesError,
    isPlacesRefreshing,
    isPlacesFetchingNextPage,
    error,
    query,
    selectedCategory,
    selectedCategoryLabel,
    selectedTagIds,
    showPartialMatches,
    isCategoryModalOpen,
    isTagsModalOpen,
    mode,
    layoutMode,
    distanceFor,
    isFavorited,
    handleQueryChange,
    handleCategorySelectAndClose,
    handleCategoryModalOpen,
    handleCategoryModalClose,
    handleTagsModalOpen,
    handleTagsModalClose,
    handleTagToggle,
    handleClearAllTags,
    handlePlacesEndReached,
    handlePlacesRefresh,
    handlePlacePress,
    handleFavoritePress,
    handleModeToggle,
    handleSetLayout,
    handleBack,
  };
}
