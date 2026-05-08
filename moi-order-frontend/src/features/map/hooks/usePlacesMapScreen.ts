import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Keyboard, Linking } from 'react-native';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { useMapStore } from '@/shared/store/mapStore';

import { usePlacesList, usePlaceDetailForMap, useTagsList } from './usePlacesMapData';
import {
  geocodeQueryApi,
  getBothDirectionsApi,
  type GeocodingResult,
  type DirectionsResult,
} from '@/shared/api/mapbox';
import type { Place, Category, Tag } from '@/types/models';
import type { Camera } from '@rnmapbox/maps';

const NEARBY_KM  = 50;
const TAB_NEARBY = 'nearby';
const TAB_ALL    = 'all';

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R    = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface UserLocation {
  coords: [number, number];
  label:  string;
  isGPS:  boolean;
}

export interface UsePlacesMapScreenResult {
  displayedPlaces:  Place[];
  selectedPlace:    Place | null;
  selectedDetail:   Place | null;
  isLoadingPlaces:  boolean;
  isLoadingTags:    boolean;
  isTabSwitching:   boolean;
  isLoadingDetail:  boolean;
  isError:          boolean;
  cameraRef:        React.RefObject<Camera | null>;
  gpsCoords:        [number, number] | null;
  userLocation:     UserLocation | null;
  searchQuery:      string;
  placeSuggestions: Place[];
  geoSuggestions:   GeocodingResult[];
  isGeoLoading:     boolean;
  categories:       Category[];
  allTags:          Tag[];
  activeTab:        string | null;
  activeCategories: number[];
  activeTags:       number[];
  isFABOpen:                   boolean;
  showTagFilter:               boolean;
  isFullscreen:                boolean;
  isBottomSheetFullyExpanded:  boolean;
  handleBottomSheetSnapChange: (index: number) => void;
  drivingRoute:     DirectionsResult | null;
  walkingRoute:     DirectionsResult | null;
  isLoadingRoutes:  boolean;
  longPressCoords:        [number, number] | null;
  showLocationOptions:    boolean;
  longPressMarker:        [number, number] | null;
  handleTabPress:             (tabId: string) => void;
  handleMarkerPress:          (place: Place) => void;
  handleMapPress:             () => void;
  handleMapLongPress:         (coords: [number, number]) => void;
  handleMyLocation:           () => void;
  handleSearchChange:         (q: string) => void;
  handleClearSearch:          () => void;
  handleSelectPlace:          (place: Place) => void;
  handleSelectGeocoding:      (result: GeocodingResult) => void;
  handleGetDirections:        () => void;
  handleDismiss:              () => void;
  handleNavigate:             () => void;
  handleRefetch:              () => void;
  handleUseCurrentGPS:        () => void;
  handleUseMapLocation:       () => void;
  handleDismissLocationOptions: () => void;
  handleToggleFAB:            () => void;
  handleSelectCategory:       (id: number) => void;
  handleShowTagFilter:        () => void;
  handleApplyTags:            (tagIds: number[]) => void;
  handleDismissTagFilter:     () => void;
}

export function usePlacesMapScreen(): UsePlacesMapScreenResult {
  const cameraRef = useRef<Camera>(null);
  // Guards against Android propagating button-press touches to the native Mapbox onPress.
  const ignoreNextMapPressRef = useRef(false);

  const [gpsCoords, setGpsCoords]           = useState<[number, number] | null>(null);
  const [userLocation, setUserLocation]     = useState<UserLocation | null>(null);
  const [selectedPlace, setSelectedPlace]   = useState<Place | null>(null);
  const [searchQuery, setSearchQuery]       = useState('');
  const [geoSuggestions, setGeoSuggestions] = useState<GeocodingResult[]>([]);
  const [isGeoLoading, setIsGeoLoading]     = useState(false);
  const [drivingRoute, setDrivingRoute]     = useState<DirectionsResult | null>(null);
  const [walkingRoute, setWalkingRoute]     = useState<DirectionsResult | null>(null);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [activeTab, setActiveTab]           = useState<string | null>(TAB_NEARBY);
  const [activeCategories, setActiveCategories] = useState<number[]>([]);
  const [activeTags, setActiveTags]         = useState<number[]>([]);
  const [isFABOpen, setIsFABOpen]           = useState(false);
  const [showTagFilter, setShowTagFilter]   = useState(false);
  const [isFullscreen, setIsFullscreen]               = useState(false);
  const [isBottomSheetFullyExpanded, setSheetExpanded] = useState(false);
  const setMapFullscreen      = useMapStore((s) => s.setFullscreen);
  const setMapBottomSheetOpen = useMapStore((s) => s.setBottomSheetOpen);
  const [longPressCoords, setLongPressCoords]     = useState<[number, number] | null>(null);
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [longPressMarker, setLongPressMarker]     = useState<[number, number] | null>(null);
  const [isTabSwitching, setIsTabSwitching]       = useState(false);
  const tabSwitchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { places, isLoading: isLoadingPlaces, isError, refetch } = usePlacesList();
  const { place: selectedDetail, isLoading: isLoadingDetail } =
    usePlaceDetailForMap(selectedPlace?.id ?? null);
  const { tags: fetchedTags, isLoading: isLoadingTags } = useTagsList();

  // ── GPS — watch while focused, stop on blur to save battery ─────────────
  useFocusEffect(
    useCallback(() => {
      let sub: Location.LocationSubscription | null = null;

      (async () => {
        // Check without prompting first — only request if never asked.
        const { status: existing } = await Location.getForegroundPermissionsAsync();
        let status = existing;
        if (existing === Location.PermissionStatus.UNDETERMINED) {
          ({ status } = await Location.requestForegroundPermissionsAsync());
        }
        if (status !== Location.PermissionStatus.GRANTED) return;

        // Seed the camera instantly from the device's cached position — zero network
        // request, zero dialog, no Vientiane fallback on subsequent visits.
        const lastKnown = await Location.getLastKnownPositionAsync();
        if (lastKnown) {
          const coords: [number, number] = [lastKnown.coords.longitude, lastKnown.coords.latitude];
          setGpsCoords(coords);
          setUserLocation(prev => (!prev || prev.isGPS) ? { coords, label: 'Current Location', isGPS: true } : prev);
        }

        // Continuous watch — single LocationSettingsRequest, updates gpsCoords live.
        sub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Low, distanceInterval: 10 },
          (loc) => {
            const coords: [number, number] = [loc.coords.longitude, loc.coords.latitude];
            setGpsCoords(coords);
            setUserLocation(prev => (!prev || prev.isGPS) ? { coords, label: 'Current Location', isGPS: true } : prev);
          },
        );
      })();

      return () => { sub?.remove(); };
    }, []),
  );

  useEffect(() => {
    if (!gpsCoords) return;
    cameraRef.current?.setCamera({
      centerCoordinate: gpsCoords, zoomLevel: 13,
      animationMode: 'flyTo', animationDuration: 1200,
    });
  }, [gpsCoords]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const categories = useMemo<Category[]>(() => {
    const seen = new Set<number>();
    return places.reduce<Category[]>((acc, p) => {
      for (const cat of p.categories) {
        if (!seen.has(cat.id)) {
          seen.add(cat.id);
          acc.push(cat);
        }
      }
      return acc;
    }, []).sort((a, b) => a.name_en.localeCompare(b.name_en));
  }, [places]);

  const nearbyPlaces = useMemo(() => {
    const coords = userLocation?.coords ?? gpsCoords;
    if (!coords) return places.slice(0, 30);
    const [lng, lat] = coords;
    return places
      .filter(p => p.latitude !== null && p.longitude !== null)
      .map(p => ({ place: p, dist: distanceKm(lat, lng, p.latitude!, p.longitude!) }))
      .filter(({ dist }) => dist <= NEARBY_KM)
      .sort((a, b) => a.dist - b.dist)
      .map(({ place }) => place);
  }, [places, userLocation, gpsCoords]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return places.filter(p =>
      p.name_en.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      (p.categories[0]?.name_en ?? '').toLowerCase().includes(q)
    );
  }, [places, searchQuery]);

  const displayedPlaces = useMemo(() => {
    if (searchQuery.trim().length > 0) return searchResults;
    if (!activeTab) return [];

    let base: Place[] =
      activeTab === TAB_NEARBY
        ? nearbyPlaces
        : places.filter(p => p.latitude !== null);

    if (activeCategories.length > 0) {
      base = base.filter(p => p.categories.some(c => activeCategories.includes(c.id)));
    }
    if (activeTags.length > 0) {
      base = base.filter(p => (p.tags ?? []).some(t => activeTags.includes(t.id)));
    }
    return base;
  }, [activeTab, searchQuery, searchResults, nearbyPlaces, places, activeCategories, activeTags]);

  const placeSuggestions = useMemo(() =>
    searchQuery.trim().length > 1 ? searchResults.slice(0, 3) : [],
    [searchResults, searchQuery],
  );

  // ── Reset nav bar whenever the map screen loses focus (back button, tab switch) ──
  useFocusEffect(
    useCallback(() => () => {
      setMapFullscreen(false);
      setMapBottomSheetOpen(false);
      setIsFullscreen(false);
      setSheetExpanded(false);
    }, [setMapFullscreen, setMapBottomSheetOpen]),
  );

  // ── Fullscreen + bottom sheet sync ────────────────────────────────────────
  useEffect(() => { setMapFullscreen(isFullscreen); }, [isFullscreen, setMapFullscreen]);
  useEffect(() => {
    setMapBottomSheetOpen(selectedPlace !== null);
    if (selectedPlace !== null) { setIsFullscreen(false); setSheetExpanded(false); }
  }, [selectedPlace, setMapBottomSheetOpen]);
  useEffect(() => { if (searchQuery.length > 0) setIsFullscreen(false); }, [searchQuery]);
  // Reset store on unmount so the nav bar comes back when leaving the map.
  useEffect(() => () => { setMapFullscreen(false); setMapBottomSheetOpen(false); }, [setMapFullscreen, setMapBottomSheetOpen]);

  // ── Geocoding ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (searchQuery.trim().length < 2) { setGeoSuggestions([]); return; }
    setIsGeoLoading(true);
    const t = setTimeout(async () => {
      try {
        const r = await geocodeQueryApi(searchQuery, userLocation?.coords);
        setGeoSuggestions(r);
      } catch { setGeoSuggestions([]); }
      finally  { setIsGeoLoading(false); }
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery, userLocation]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleTabPress = useCallback((tabId: string) => {
    setActiveTab(prev => prev === tabId ? null : tabId);
    setSelectedPlace(null);
    setDrivingRoute(null);
    setWalkingRoute(null);
    setIsFABOpen(false);
    if (tabSwitchTimer.current) clearTimeout(tabSwitchTimer.current);
    setIsTabSwitching(true);
    tabSwitchTimer.current = setTimeout(() => setIsTabSwitching(false), 350);
  }, []);

  const handleToggleFAB = useCallback(() => {
    ignoreNextMapPressRef.current = true;
    setTimeout(() => { ignoreNextMapPressRef.current = false; }, 400);
    setIsFABOpen(prev => !prev);
  }, []);

  const handleSelectCategory = useCallback((id: number) => {
    setActiveCategories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  }, []);

  const handleShowTagFilter    = useCallback(() => setShowTagFilter(true), []);
  const handleDismissTagFilter = useCallback(() => setShowTagFilter(false), []);
  // index 2 = 78% snap = fully expanded
  const handleBottomSheetSnapChange = useCallback((index: number) => {
    setSheetExpanded(index === 2);
  }, []);
  const handleApplyTags        = useCallback((tagIds: number[]) => {
    setActiveTags(tagIds);
    setShowTagFilter(false);
  }, []);

  const handleGetDirections = useCallback(async () => {
    const from = userLocation?.coords;
    if (!from || !selectedPlace?.latitude || !selectedPlace?.longitude) return;
    setIsLoadingRoutes(true);
    try {
      const { driving, walking } = await getBothDirectionsApi(
        from, [selectedPlace.longitude, selectedPlace.latitude],
      );
      setDrivingRoute(driving);
      setWalkingRoute(walking);
    } finally { setIsLoadingRoutes(false); }
  }, [userLocation, selectedPlace]);

  const handleNavigate = useCallback(() => {
    if (!selectedPlace?.latitude || !selectedPlace?.longitude) return;
    const { latitude: lat, longitude: lng, name_en } = selectedPlace;
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_name=${encodeURIComponent(name_en)}&travelmode=driving`
    );
  }, [selectedPlace]);

  const handleDismiss = useCallback(() => {
    setSelectedPlace(null);
    setDrivingRoute(null);
    setWalkingRoute(null);
  }, []);

  const handleMapPress = useCallback(() => {
    // On Android, tapping a button over the map also fires the native Mapbox onPress.
    // Ignore the map press for a short window after any overlay button was tapped.
    if (ignoreNextMapPressRef.current) return;
    Keyboard.dismiss();
    setIsFABOpen(false);
    if (selectedPlace === null && searchQuery.length === 0) {
      setIsFullscreen(prev => !prev);
    }
  }, [selectedPlace, searchQuery]);

  const handleMapLongPress = useCallback((coords: [number, number]) => {
    Keyboard.dismiss();
    setLongPressCoords(coords);
    setLongPressMarker(coords);
    setShowLocationOptions(true);
    setIsFABOpen(false);
  }, []);

  const handleUseCurrentGPS = useCallback(() => {
    if (!gpsCoords) return;
    setUserLocation({ coords: gpsCoords, label: 'Current Location', isGPS: true });
    setLongPressMarker(null);
    setShowLocationOptions(false);
    setLongPressCoords(null);
    setActiveTab(TAB_NEARBY);
    cameraRef.current?.setCamera({
      centerCoordinate: gpsCoords, zoomLevel: 13,
      animationMode: 'flyTo', animationDuration: 800,
    });
  }, [gpsCoords]);

  const handleUseMapLocation = useCallback(() => {
    if (!longPressCoords) return;
    const [lng, lat] = longPressCoords;
    setUserLocation({ coords: longPressCoords, label: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, isGPS: false });
    setShowLocationOptions(false);
    setLongPressCoords(null);
    setActiveTab(TAB_NEARBY);
    cameraRef.current?.setCamera({
      centerCoordinate: longPressCoords, zoomLevel: 13,
      animationMode: 'flyTo', animationDuration: 800,
    });
  }, [longPressCoords]);

  const handleDismissLocationOptions = useCallback(() => {
    setShowLocationOptions(false);
    setLongPressCoords(null);
    setLongPressMarker(null);
  }, []);

  const flyToPlace = useCallback((place: Place) => {
    if (!place.latitude || !place.longitude) return;
    cameraRef.current?.setCamera({
      centerCoordinate: [place.longitude, place.latitude - 0.003],
      zoomLevel: 15, animationMode: 'flyTo', animationDuration: 700,
    });
  }, []);

  const handleMarkerPress = useCallback((place: Place) => {
    Keyboard.dismiss();
    setSelectedPlace(place);
    setDrivingRoute(null);
    setWalkingRoute(null);
    setSearchQuery('');
    setIsFABOpen(false);
    flyToPlace(place);
  }, [flyToPlace]);

  const handleSelectPlace = useCallback((place: Place) => {
    setSearchQuery('');
    setGeoSuggestions([]);
    setSelectedPlace(place);
    setDrivingRoute(null);
    setWalkingRoute(null);
    flyToPlace(place);
  }, [flyToPlace]);

  const handleSelectGeocoding = useCallback((result: GeocodingResult) => {
    setSearchQuery('');
    setGeoSuggestions([]);
    setSelectedPlace(null);
    setDrivingRoute(null);
    setWalkingRoute(null);
    cameraRef.current?.setCamera({
      centerCoordinate: result.coordinates, zoomLevel: 14,
      animationMode: 'flyTo', animationDuration: 800,
    });
  }, []);

  const handleMyLocation = useCallback(async () => {
    ignoreNextMapPressRef.current = true;
    setTimeout(() => { ignoreNextMapPressRef.current = false; }, 400);
    const coords = userLocation?.coords ?? gpsCoords;
    if (coords) {
      cameraRef.current?.setCamera({
        centerCoordinate: coords, zoomLevel: 14,
        animationMode: 'flyTo', animationDuration: 800,
      });
      return;
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Location unavailable', 'Enable location access in Settings to use this feature.');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
    const newCoords: [number, number] = [loc.coords.longitude, loc.coords.latitude];
    setGpsCoords(newCoords);
    setUserLocation({ coords: newCoords, label: 'Current Location', isGPS: true });
    cameraRef.current?.setCamera({
      centerCoordinate: newCoords, zoomLevel: 14,
      animationMode: 'flyTo', animationDuration: 800,
    });
  }, [userLocation, gpsCoords]);

  const handleSearchChange = useCallback((q: string) => setSearchQuery(q), []);
  const handleClearSearch  = useCallback(() => { setSearchQuery(''); setGeoSuggestions([]); }, []);
  const handleRefetch      = useCallback(() => refetch(), [refetch]);

  useEffect(() => () => { if (tabSwitchTimer.current) clearTimeout(tabSwitchTimer.current); }, []);

  return {
    displayedPlaces, selectedPlace, selectedDetail,
    isLoadingPlaces, isLoadingTags, isTabSwitching, isLoadingDetail, isError,
    cameraRef, gpsCoords, userLocation,
    searchQuery, placeSuggestions, geoSuggestions, isGeoLoading,
    categories, allTags: fetchedTags, activeTab, activeCategories, activeTags,
    isFABOpen, showTagFilter, isFullscreen, isBottomSheetFullyExpanded,
    handleBottomSheetSnapChange,
    drivingRoute, walkingRoute, isLoadingRoutes,
    longPressCoords, showLocationOptions, longPressMarker,
    handleTabPress, handleMarkerPress, handleMapPress, handleMapLongPress,
    handleMyLocation, handleSearchChange, handleClearSearch,
    handleSelectPlace, handleSelectGeocoding,
    handleGetDirections, handleDismiss, handleNavigate, handleRefetch,
    handleUseCurrentGPS, handleUseMapLocation, handleDismissLocationOptions,
    handleToggleFAB, handleSelectCategory,
    handleShowTagFilter, handleApplyTags, handleDismissTagFilter,
  };
}
