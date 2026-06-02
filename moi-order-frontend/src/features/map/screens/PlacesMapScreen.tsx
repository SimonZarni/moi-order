import React, { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  } = usePlacesMapScreen();

  const handleReadMore = useCallback(() => {
    if (selectedPlace) navigation.navigate('PlaceDetail', { placeId: selectedPlace.id });
  }, [selectedPlace, navigation]);

  const topControlsAnim  = useRef(new Animated.Value(0)).current;
  const buttonsRightAnim = useRef(new Animated.Value(0)).current;

  const topControlsHidden = isFullscreen || isBottomSheetFullyExpanded;

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

          {displayedPlaces.map((place) => (
            <PlaceMarker key={place.id} place={place}
              isSelected={selectedPlace?.id === place.id}
              onPress={handleMarkerPress} />
          ))}
        </MapboxGL.MapView>

        {userLocation && !userLocation.isGPS && (
          <View style={styles.locationBanner}>
            <Text style={styles.locationBannerText}>📌 Origin: {userLocation.label}</Text>
            <Text style={styles.locationBannerHint}>Hold map to change</Text>
          </View>
        )}

        {(isLoadingPlaces || isTabSwitching) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={MAP_COLORS.primary} size="small" />
            <Text style={styles.loadingText}>Loading places…</Text>
          </View>
        )}

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
