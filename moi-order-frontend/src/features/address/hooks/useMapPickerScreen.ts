import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { Camera } from '@rnmapbox/maps';
import type { MapState } from '@rnmapbox/maps';

type CameraRef = React.ElementRef<typeof Camera>;
import { RootStackParamList } from '@/types/navigation';
import { reverseGeocodeApi, geocodeQueryApi, GeocodingResult } from '@/shared/api/mapbox';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'MapPicker'>;

const DEFAULT_CENTER: [number, number] = [100.5018, 13.7563]; // Bangkok
const REVERSE_GEOCODE_DEBOUNCE_MS = 600;

export interface UseMapPickerScreenResult {
  cameraRef: React.RefObject<CameraRef | null>;
  center: [number, number];
  resolvedAddress: string;
  isGeocoding: boolean;
  searchQuery: string;
  suggestions: GeocodingResult[];
  isSearching: boolean;
  showSuggestions: boolean;
  handleCameraChanged: (state: MapState) => void;
  handleCurrentLocation: () => Promise<void>;
  handleSearchChange: (text: string) => void;
  handleSuggestionSelect: (result: GeocodingResult) => void;
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

  const cameraRef = useRef<CameraRef>(null);
  const debounceRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchDebounce  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [center, setCenter]                   = useState<[number, number]>(startCenter);
  const [resolvedAddress, setResolvedAddress] = useState(initialAddress ?? '');
  const [isGeocoding, setIsGeocoding]         = useState(false);
  const [searchQuery, setSearchQuery]         = useState('');
  const [suggestions, setSuggestions]         = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching]         = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Reverse geocode when the map stops moving (debounced).
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

  // Autocomplete search with debounce.
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);

    if (!text.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchDebounce.current = setTimeout(async () => {
      setIsSearching(true);
      const results = await geocodeQueryApi(text, center);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setIsSearching(false);
    }, 400);
  }, [center]);

  const handleSuggestionSelect = useCallback((result: GeocodingResult) => {
    const [lng, lat] = result.coordinates;
    const newCenter: [number, number] = [lng, lat];
    setCenter(newCenter);
    setResolvedAddress(result.full_address);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    cameraRef.current?.setCamera({ centerCoordinate: newCenter, zoomLevel: 16, animationDuration: 400 });
  }, []);

  const handleCurrentLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const newCenter: [number, number] = [loc.coords.longitude, loc.coords.latitude];
    setCenter(newCenter);
    cameraRef.current?.setCamera({ centerCoordinate: newCenter, zoomLevel: 17, animationDuration: 400 });
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
    suggestions,
    isSearching,
    showSuggestions,
    handleCameraChanged,
    handleCurrentLocation,
    handleSearchChange,
    handleSuggestionSelect,
    handleConfirm,
    handleBack,
  };
}
