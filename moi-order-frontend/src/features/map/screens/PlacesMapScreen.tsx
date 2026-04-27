import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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

export function PlacesMapScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    displayedPlaces, selectedPlace, selectedDetail,
    isLoadingPlaces, isLoadingDetail, isError,
    cameraRef, userLocation,
    searchQuery, placeSuggestions, geoSuggestions, isGeoLoading,
    categories, allTags, activeTab, activeCategory, activeTags,
    isFABOpen, showTagFilter,
    drivingRoute, walkingRoute, isLoadingRoutes,
    longPressMarker, showLocationOptions,
    handleTabPress, handleMarkerPress, handleMapPress, handleMapLongPress,
    handleMyLocation, handleSearchChange, handleClearSearch,
    handleSelectPlace, handleSelectGeocoding,
    handleGetDirections, handleDismiss, handleNavigate, handleRefetch,
    handleUseCurrentGPS, handleUseMapLocation, handleDismissLocationOptions,
    handleToggleFAB, handleSelectCategory,
    handleShowTagFilter, handleApplyTags, handleDismissTagFilter,
  } = usePlacesMapScreen();

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Back button */}
        <View style={styles.backBtn}>
          <Text style={styles.backText} onPress={() => navigation.goBack()}>← Back</Text>
        </View>

        <View style={styles.container}>
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
          >
            <MapboxGL.Camera
              ref={cameraRef}
              zoomLevel={12}
              centerCoordinate={DEFAULT_CENTRE}
              animationMode="flyTo"
              animationDuration={800}
            />
            <MapboxGL.UserLocation visible animated />

            {longPressMarker && (
              <MapboxGL.ShapeSource id="long-press-marker"
                shape={{ type: 'Feature', geometry: { type: 'Point', coordinates: longPressMarker }, properties: {} }}>
                <MapboxGL.CircleLayer id="long-press-circle" style={LONG_PRESS_STYLE} />
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

          <MapSearchBar
            value={searchQuery}
            onChangeText={handleSearchChange}
            onClear={handleClearSearch}
            onSelectPlace={handleSelectPlace}
            onSelectGeocoding={handleSelectGeocoding}
            placeSuggestions={placeSuggestions}
            geoSuggestions={geoSuggestions}
            isGeoLoading={isGeoLoading}
            activeTab={activeTab}
            onTabPress={handleTabPress}
            activeTagCount={activeTags.length}
            onFilterPress={handleShowTagFilter}
          />

          {userLocation && !userLocation.isGPS && (
            <View style={styles.locationBanner}>
              <Text style={styles.locationBannerText}>📌 Origin: {userLocation.label}</Text>
              <Text style={styles.locationBannerHint}>Hold map to change</Text>
            </View>
          )}

          {isLoadingPlaces && (
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

          <MyLocationButton onPress={handleMyLocation} />

          <MapFAB
            isFABOpen={isFABOpen}
            categories={categories}
            activeCategory={activeCategory}
            onToggleFAB={handleToggleFAB}
            onSelectCategory={handleSelectCategory}
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
            activeTags={activeTags}
            onApply={handleApplyTags}
            onDismiss={handleDismissTagFilter}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
