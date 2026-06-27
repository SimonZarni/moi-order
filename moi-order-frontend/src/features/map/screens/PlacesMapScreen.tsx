import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapboxGL from '@rnmapbox/maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/types/navigation';
import { usePlacesMapScreen } from '../hooks/usePlacesMapScreen';
import { PlaceMarker } from '../components/PlaceMarker';
import { PlaceBottomSheet } from '../components/PlaceBottomSheet';
import { MapSearchBar } from '../components/MapSearchBar';
import { MapFAB } from '../components/MapFAB';
import { MyLocationButton } from '../components/MyLocationButton';
import { LocationOptionsSheet } from '../components/LocationOptionsSheet';
import { TagFilterSheet } from '../components/TagFilterSheet';
import { GooglePlaceCard } from '../components/GooglePlaceCard';
import { styles } from './PlacesMapScreen.styles';
import { MAP_COLORS } from '@/shared/theme/mapTheme';

const MAPBOX_TOKEN = process.env['EXPO_PUBLIC_MAPBOX_TOKEN'] ?? '';
const MAPBOX_STYLE = process.env['EXPO_PUBLIC_MAPBOX_STYLE'] ?? 'mapbox://styles/mapbox/streets-v12';
const DEFAULT_CENTRE: [number, number] = [102.6331, 17.9757];

MapboxGL.setAccessToken(MAPBOX_TOKEN);

const ROUTE_CASING = {
  lineColor: MAP_COLORS.white, lineWidth: 9,
  lineJoin: 'round' as const, lineCap: 'round' as const, lineOpacity: 0.7,
};
const ROUTE_LINE = {
  lineColor: MAP_COLORS.primary, lineWidth: 5,
  lineJoin: 'round' as const, lineCap: 'round' as const, lineOpacity: 0.9,
};
const LONG_PRESS_STYLE = {
  circleRadius: 10, circleColor: MAP_COLORS.primary, circleOpacity: 0.9,
  circleStrokeWidth: 3, circleStrokeColor: MAP_COLORS.white,
};
const GOOGLE_PLACE_STYLE = {
  circleRadius: 11, circleColor: '#4285F4', circleOpacity: 0.95,
  circleStrokeWidth: 3, circleStrokeColor: MAP_COLORS.white,
};

export function PlacesMapScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    displayedPlaces, selectedPlace, selectedDetail,
    isLoadingPlaces, isLoadingTags, isTabSwitching, isLoadingDetail, isError,
    cameraRef, gpsCoords, userLocation,
    searchQuery, placeSuggestions, geoSuggestions, googleSuggestions,
    isGeoLoading, isGoogleLoading, selectedGooglePlace, googlePlaceCoords,
    categories, allTags, activeTab, activeCategories, activeTags,
    isFABOpen, showTagFilter, isFullscreen, isBottomSheetFullyExpanded,
    handleBottomSheetSnapChange,
    drivingRoute, walkingRoute, isLoadingRoutes,
    longPressMarker, showLocationOptions,
    handleTabPress, handleMarkerPress, handleMapPress, handleMapLongPress,
    handleMyLocation, handleSearchChange, handleClearSearch,
    handleSelectPlace, handleSelectGeocoding,
    handleSelectGooglePlace, handleDismissGooglePlace,
    handleGetDirections, handleDismiss, handleNavigate, handleRefetch,
    handleUseCurrentGPS, handleUseMapLocation, handleDismissLocationOptions,
    handleToggleFAB, handleSelectCategory,
    handleShowTagFilter, handleApplyTags, handleDismissTagFilter,
    markNavigatingToDetail,
  } = usePlacesMapScreen();

  const handleReadMore = useCallback(() => {
    if (selectedPlace) {
      markNavigatingToDetail();
      navigation.navigate('PlaceDetail', { placeId: selectedPlace.id });
    }
  }, [selectedPlace, navigation, markNavigatingToDetail]);

  const insets = useSafeAreaInsets();
  // TAB_BAR_BOTTOM_OFFSET(14) + TAB_BAR_HEIGHT(67) + insets.bottom + 8pt gap
  const loadingBarBottom = 89 + insets.bottom;

  const topControlsAnim  = useRef(new Animated.Value(0)).current;
  const buttonsRightAnim = useRef(new Animated.Value(0)).current;
  const loadingAnim      = useRef(new Animated.Value(0)).current;

  // Image-ready tracking: prefetch all cover images once per data-set.
  // loadedOnceRef resets on tab-switch / re-fetch so new images are prefetched too.
  // It does NOT reset on viewport pans (displayedPlaces length change without loading flag).
  const loadedOnceRef = useRef(false);
  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    if (isLoadingPlaces || isTabSwitching) {
      loadedOnceRef.current = false;
      setImagesReady(false);
      return;
    }
    if (loadedOnceRef.current) return;

    const uris = displayedPlaces
      .map(p => p.cover_image)
      .filter((u): u is string => Boolean(u));

    if (uris.length === 0) {
      loadedOnceRef.current = true;
      setImagesReady(true);
      return;
    }

    let cancelled = false;
    Promise.all(uris.map(uri => Image.prefetch(uri).catch(() => false)))
      .finally(() => {
        if (!cancelled) {
          loadedOnceRef.current = true;
          setImagesReady(true);
        }
      });
    return () => { cancelled = true; };
  }, [isLoadingPlaces, isTabSwitching, displayedPlaces]);

  const topControlsHidden = isFullscreen || isBottomSheetFullyExpanded;
  const isLoading         = isLoadingPlaces || isTabSwitching || !imagesReady;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(topControlsAnim, {
        toValue: topControlsHidden ? -210 : 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsRightAnim, {
        toValue: isFullscreen ? 140 : 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [topControlsHidden, isFullscreen, topControlsAnim, buttonsRightAnim]);

  useEffect(() => {
    Animated.timing(loadingAnim, {
      toValue: isLoading ? 1 : 0,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [isLoading, loadingAnim]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>

        {/* Top controls — slide up when fullscreen */}
        <Animated.View
          style={[styles.topControls, { transform: [{ translateY: topControlsAnim }] }]}
          pointerEvents={topControlsHidden ? 'none' : 'box-none'}
        >
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}
            accessibilityRole="button" accessibilityLabel="Go back">
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <MapSearchBar
            value={searchQuery}
            onChangeText={handleSearchChange}
            onClear={handleClearSearch}
            onSelectPlace={handleSelectPlace}
            onSelectGeocoding={handleSelectGeocoding}
            onSelectGooglePlace={handleSelectGooglePlace}
            placeSuggestions={placeSuggestions}
            geoSuggestions={geoSuggestions}
            googleSuggestions={googleSuggestions}
            isGeoLoading={isGeoLoading}
            isGoogleLoading={isGoogleLoading}
            activeTab={activeTab}
            onTabPress={handleTabPress}
            activeTagCount={activeTags.length}
            onFilterPress={handleShowTagFilter}
            showTabs={false}
          />
        </Animated.View>

        {/* MapboxGL.MapView stays always mounted — tab bar is rendered outside
            NavigationContainer in App.tsx so it sits above the SurfaceView. */}
        <MapboxGL.MapView
          style={styles.map}
          styleURL={MAPBOX_STYLE}
          onPress={handleMapPress}
          onLongPress={(e) => {
            const geometry = e.geometry as GeoJSON.Point;
            const [lng, lat] = geometry.coordinates as [number, number];
            handleMapLongPress([lng, lat]);
          }}
          attributionEnabled={false}
          logoEnabled={false}
          // Reduce post-swipe glide. iOS default (0.998) is too slow to decelerate —
          // a tiny flick sends the map far. 0.996 stops it ~5× faster without feeling abrupt.
          // Cast needed: panDecelerationFactor is in Mapbox source but missing from TS types v10.3.0.
          {...(Platform.OS === 'ios' ? { panDecelerationFactor: 0.996 } as object : {})}
        >
          {/* centerCoordinate is a STATIC fallback only — all camera movement
              is driven imperatively via cameraRef.setCamera() in the hook.
              Binding it to userLocation would re-animate on every GPS tick. */}
          <MapboxGL.Camera
            ref={cameraRef}
            zoomLevel={12}
            centerCoordinate={DEFAULT_CENTRE}
            animationMode="flyTo"
            animationDuration={800}
          />

          {/* Custom location dot backed by hook state — instant on tab revisit. */}
          {gpsCoords && (
            <MapboxGL.ShapeSource
              id="user-gps-location"
              shape={{ type: 'Feature', geometry: { type: 'Point', coordinates: gpsCoords }, properties: {} }}
            >
              <MapboxGL.CircleLayer
                id="user-gps-dot"
                style={{
                  circleRadius: 9,
                  circleColor: '#4A90E2',
                  circleOpacity: 0.95,
                  circleStrokeWidth: 3,
                  circleStrokeColor: '#FFFFFF',
                }}
              />
            </MapboxGL.ShapeSource>
          )}

          {longPressMarker && (
            <MapboxGL.ShapeSource id="long-press-marker"
              shape={{ type: 'Feature', geometry: { type: 'Point', coordinates: longPressMarker }, properties: {} }}>
              <MapboxGL.CircleLayer id="long-press-circle" style={LONG_PRESS_STYLE} />
            </MapboxGL.ShapeSource>
          )}

          {googlePlaceCoords && (
            <MapboxGL.ShapeSource id="google-place-marker"
              shape={{ type: 'Feature', geometry: { type: 'Point', coordinates: googlePlaceCoords }, properties: {} }}>
              <MapboxGL.CircleLayer id="google-place-circle" style={GOOGLE_PLACE_STYLE} />
            </MapboxGL.ShapeSource>
          )}

          {userLocation && !userLocation.isGPS && (
            <MapboxGL.ShapeSource id="custom-origin"
              shape={{ type: 'Feature', geometry: { type: 'Point', coordinates: userLocation.coords }, properties: {} }}>
              <MapboxGL.CircleLayer id="custom-origin-circle" style={{
                circleRadius: 12, circleColor: MAP_COLORS.primary, circleOpacity: 0.85,
                circleStrokeWidth: 3, circleStrokeColor: MAP_COLORS.white,
              }} />
            </MapboxGL.ShapeSource>
          )}

          {drivingRoute && (
            <>
              <MapboxGL.ShapeSource id="route-casing"
                shape={{ type: 'Feature', geometry: drivingRoute.geometry, properties: {} }}>
                <MapboxGL.LineLayer id="route-casing-layer" style={ROUTE_CASING} />
              </MapboxGL.ShapeSource>
              <MapboxGL.ShapeSource id="route-line"
                shape={{ type: 'Feature', geometry: drivingRoute.geometry, properties: {} }}>
                <MapboxGL.LineLayer id="route-line-layer" style={ROUTE_LINE} />
              </MapboxGL.ShapeSource>
            </>
          )}

          {/* Gate on imagesReady so PointAnnotation's first bitmap snapshot always
              captures the loaded image — prevents the emoji→photo flash. */}
          {imagesReady && displayedPlaces.map((place) => (
            <PlaceMarker key={place.id} place={place}
              isSelected={selectedPlace?.id === place.id}
              onPress={handleMarkerPress} />
          ))}

          {/* Android tap detection — invisible circles at each marker coordinate.
              MarkerView content has pointerEvents="none" so MapboxMapView owns all
              touches (pan works). Mapbox's own hit-test fires onPress for taps. */}
          {Platform.OS === 'android' && (
            <MapboxGL.ShapeSource
              id="place-tap-targets"
              shape={{
                type: 'FeatureCollection',
                features: displayedPlaces
                  .filter(p => p.latitude && p.longitude)
                  .map(p => ({
                    type: 'Feature' as const,
                    geometry: {
                      type: 'Point' as const,
                      coordinates: [p.longitude!, p.latitude!],
                    },
                    properties: { placeId: p.id },
                  })),
              }}
              onPress={(e) => {
                const placeId = (e.features[0]?.properties as { placeId?: number } | null)?.placeId;
                const found = displayedPlaces.find(p => p.id === placeId);
                if (found) handleMarkerPress(found);
              }}
            >
              <MapboxGL.CircleLayer
                id="place-tap-circles"
                style={{ circleRadius: 50, circleOpacity: 0, circleStrokeWidth: 0 }}
              />
            </MapboxGL.ShapeSource>
          )}
        </MapboxGL.MapView>

        {userLocation && !userLocation.isGPS && (
          <View style={styles.locationBanner}>
            <Text style={styles.locationBannerText}>📌 Origin: {userLocation.label}</Text>
            <Text style={styles.locationBannerHint}>Hold map to change</Text>
          </View>
        )}

        {/* Loading bar — always mounted so enter/exit animation plays.
            Positioned dynamically to float 8pt above the floating tab bar. */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.loadingBar,
            {
              bottom: loadingBarBottom,
              opacity: loadingAnim,
              transform: [{
                translateY: loadingAnim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }),
              }],
            },
          ]}
        >
          <ActivityIndicator color={MAP_COLORS.primary} size="small" />
          <Text style={styles.loadingText}>Loading places…</Text>
        </Animated.View>

        {isError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠ Could not load places. </Text>
            <Text style={styles.errorRetry} onPress={handleRefetch}>Retry</Text>
          </View>
        )}

        <Animated.View
          style={{ transform: [{ translateX: buttonsRightAnim }], zIndex: selectedPlace ? 1 : 20 }}
          pointerEvents={isFullscreen ? 'none' : 'box-none'}
        >
          <MyLocationButton onPress={handleMyLocation} />
        </Animated.View>

        <MapFAB
          isFABOpen={isFABOpen}
          categories={categories}
          activeCategories={activeCategories}
          onToggleFAB={handleToggleFAB}
          onSelectCategory={handleSelectCategory}
          isFullscreen={isFullscreen}
          behindCard={!!selectedPlace}
        />

        {selectedPlace && (
          <PlaceBottomSheet
            place={selectedPlace}
            detail={selectedDetail}
            isLoading={isLoadingDetail}
            drivingRoute={drivingRoute}
            walkingRoute={walkingRoute}
            isLoadingRoutes={isLoadingRoutes}
            hasUserLocation={!!userLocation}
            onDismiss={handleDismiss}
            onGetDirections={handleGetDirections}
            onNavigate={handleNavigate}
            onReadMore={handleReadMore}
            onSnapChange={handleBottomSheetSnapChange}
          />
        )}

        {selectedGooglePlace && (
          <GooglePlaceCard
            place={selectedGooglePlace}
            onDismiss={handleDismissGooglePlace}
          />
        )}

        <LocationOptionsSheet
          visible={showLocationOptions}
          hasGPS={true}
          onUseCurrentGPS={handleUseCurrentGPS}
          onUseMapLocation={handleUseMapLocation}
          onDismiss={handleDismissLocationOptions}
        />

        <TagFilterSheet
          visible={showTagFilter}
          allTags={allTags}
          isLoading={isLoadingTags}
          activeTags={activeTags}
          onApply={handleApplyTags}
          onDismiss={handleDismissTagFilter}
        />

      </View>
    </SafeAreaView>
  );
}
