import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { Camera } from '@rnmapbox/maps';
import type { MapState } from '@rnmapbox/maps';

type CameraRef = React.ElementRef<typeof Camera>;
import { RootStackParamList } from '@/types/navigation';
import { reverseGeocodeApi, geocodeQueryApi, GeocodingResult } from '@/shared/api/mapbox';
import { searchGooglePlaces, getGooglePlaceLocation } from '@/shared/api/googlePlaces';
import { MapPickerSuggestionItem } from '../types';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'MapPicker'>;

const DEFAULT_CENTER: [number, number] = [100.5018, 13.7563]; // Bangkok
const INITIAL_ZOOM            = 13;
const CURRENT_LOCATION_ZOOM   = 15;
const REVERSE_GEOCODE_DEBOUNCE_MS = 600;
/** Cached GPS is valid for 3 minutes — avoids 5-7 s GPS cold-start. */
const LOCATION_MAX_AGE_MS = 3 * 60 * 1000;

export interface UseMapPickerScreenResult {
  cameraRef: React.RefObject<CameraRef | null>;
  center: [number, number];
  resolvedAddress: string;
  isGeocoding: boolean;
  searchQuery: string;
  allSuggestions: MapPickerSuggestionItem[];
  isSearching: boolean;
  showSuggestions: boolean;
  isLocating: boolean;
  isSelectingPlace: boolean;
  handleCameraChanged: (state: MapState) => void;
  handleCurrentLocation: () => Promise<void>;
  handleSearchChange: (text: string) => void;
  handleSuggestionSelect: (item: MapPickerSuggestionItem) => Promise<void>;
  handleConfirm: () => void;
  handleBack: () => void;
}

export function useMapPickerScreen(): UseMapPickerScreenResult {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { initialLat, initialLng, initialAddress } = route.params ?? {};

  const startCenter: [number, number] = initialLng !== undefined && initialLat !== undefined
    ? [initialLng, initialLat]
    : DEFAULT_CENTER;

  const cameraRef      = useRef<CameraRef>(null);
  const debounceRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [center, setCenter]                   = useState<[number, number]>(startCenter);
  const [resolvedAddress, setResolvedAddress] = useState(initialAddress ?? '');
  const [isGeocoding, setIsGeocoding]         = useState(false);
  const [searchQuery, setSearchQuery]         = useState('');
  const [allSuggestions, setAllSuggestions]   = useState<MapPickerSuggestionItem[]>([]);
  const [isSearching, setIsSearching]         = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLocating, setIsLocating]           = useState(false);
  const [isSelectingPlace, setIsSelectingPlace] = useState(false);

  // Set initial camera position imperatively on mount — Camera is fully uncontrolled
  // to avoid animation conflicts with user panning.
  useEffect(() => {
    const timer = setTimeout(() => {
      cameraRef.current?.setCamera({
        centerCoordinate: startCenter,
        zoomLevel: INITIAL_ZOOM,
        animationDuration: 0,
      });
    }, 50);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reverse geocode on map stop (debounced).
  const handleCameraChanged = useCallback(
    (state: MapState) => {
      const [lng, lat] = state.properties.center as [number, number];
      const newCenter: [number, number] = [lng, lat];
      setCenter(newCenter);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        setIsGeocoding(true);
        const address = await reverseGeocodeApi(newCenter[0], newCenter[1]);
        setResolvedAddress(address ?? '');
        setIsGeocoding(false);
      }, REVERSE_GEOCODE_DEBOUNCE_MS);
    },
    [],
  );

  // Combined Mapbox + Google search with debounce and error guard.
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);

    if (!text.trim()) {
      setAllSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchDebounce.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Run both providers in parallel — Google for broad TH coverage, Mapbox for address accuracy.
        const [googleRes, mapboxRes] = await Promise.allSettled([
          searchGooglePlaces(text, center[1], center[0]),
          geocodeQueryApi(text, center),
        ]);

        const google = googleRes.status === 'fulfilled' ? googleRes.value : [];
        const mapbox = mapboxRes.status === 'fulfilled' ? mapboxRes.value : [];

        const combined: MapPickerSuggestionItem[] = [
          ...google.map((g) => ({ key: `g-${g.place_id}`, source: 'google' as const, data: g })),
          ...mapbox.map((m) => ({ key: `m-${m.id}`,       source: 'mapbox' as const, data: m })),
        ];
        setAllSuggestions(combined);
        setShowSuggestions(combined.length > 0);
      } catch {
        setAllSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  }, [center]);

  const handleSuggestionSelect = useCallback(async (item: MapPickerSuggestionItem) => {
    setSearchQuery('');
    setAllSuggestions([]);
    setShowSuggestions(false);

    if (item.source === 'mapbox') {
      const [lng, lat] = item.data.coordinates;
      const newCenter: [number, number] = [lng, lat];
      setCenter(newCenter);
      setResolvedAddress(item.data.full_address);
      cameraRef.current?.setCamera({ centerCoordinate: newCenter, zoomLevel: 15, animationDuration: 500 });
      return;
    }

    // Google place — need a coord lookup.
    setIsSelectingPlace(true);
    try {
      const loc = await getGooglePlaceLocation(item.data.place_id);
      if (!loc) return;
      const newCenter: [number, number] = [loc.lng, loc.lat];
      setCenter(newCenter);
      // Reverse geocode fires automatically from onCameraChanged after camera moves.
      setResolvedAddress(item.data.address || item.data.name);
      cameraRef.current?.setCamera({ centerCoordinate: newCenter, zoomLevel: 15, animationDuration: 500 });
    } catch {
      // silently ignore — user can try again
    } finally {
      setIsSelectingPlace(false);
    }
  }, []);

  // Current location — try instant cached fix first to avoid 5-7 s GPS cold start.
  const handleCurrentLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    setIsLocating(true);
    try {
      // 1. Try cached location first — instant (age ≤ 3 min).
      const cached = await Location.getLastKnownPositionAsync({ maxAge: LOCATION_MAX_AGE_MS });
      if (cached) {
        const newCenter: [number, number] = [cached.coords.longitude, cached.coords.latitude];
        setCenter(newCenter);
        cameraRef.current?.setCamera({ centerCoordinate: newCenter, zoomLevel: CURRENT_LOCATION_ZOOM, animationDuration: 500 });
        return;
      }
      // 2. No cache — use Balanced accuracy (1-2 s vs 5-7 s for High).
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const newCenter: [number, number] = [loc.coords.longitude, loc.coords.latitude];
      setCenter(newCenter);
      cameraRef.current?.setCamera({ centerCoordinate: newCenter, zoomLevel: CURRENT_LOCATION_ZOOM, animationDuration: 500 });
    } finally {
      setIsLocating(false);
    }
  }, []);

  const handleBack    = useCallback(() => navigation.goBack(), [navigation]);

  const handleConfirm = useCallback(() => {
    navigation.navigate('AddEditAddress', {
      pickedLat:     center[1],
      pickedLng:     center[0],
      pickedAddress: resolvedAddress,
    });
  }, [navigation, center, resolvedAddress]);

  // Cleanup debounce timers.
  useEffect(() => {
    return () => {
      if (debounceRef.current)    clearTimeout(debounceRef.current);
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
    };
  }, []);

  return {
    cameraRef,
    center,
    resolvedAddress,
    isGeocoding,
    searchQuery,
    allSuggestions,
    isSearching,
    showSuggestions,
    isLocating,
    isSelectingPlace,
    handleCameraChanged,
    handleCurrentLocation,
    handleSearchChange,
    handleSuggestionSelect,
    handleConfirm,
    handleBack,
  };
}
