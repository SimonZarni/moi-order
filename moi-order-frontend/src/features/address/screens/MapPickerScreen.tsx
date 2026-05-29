import React from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapboxGL from '@rnmapbox/maps';
import { colours } from '@/shared/theme/colours';
import { MapPickerSuggestionItem } from '../types';
import { useMapPickerScreen } from '../hooks/useMapPickerScreen';
import { styles } from './MapPickerScreen.styles';

const MAPBOX_TOKEN = process.env['EXPO_PUBLIC_MAPBOX_TOKEN'] ?? '';
const MAPBOX_STYLE = process.env['EXPO_PUBLIC_MAPBOX_STYLE'] ?? 'mapbox://styles/mapbox/streets-v12';

// Must be called before any MapboxGL component renders — same pattern as PlacesMapScreen.
MapboxGL.setAccessToken(MAPBOX_TOKEN);

function SuggestionRow({ item, onPress }: { item: MapPickerSuggestionItem; onPress: () => void }): React.JSX.Element {
  const name    = item.source === 'mapbox' ? item.data.name        : item.data.name;
  const subtext = item.source === 'mapbox' ? item.data.full_address : item.data.address;

  return (
    <Pressable
      style={styles.suggestionRow}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={subtext || name}
    >
      {item.source === 'google' ? (
        <View style={styles.googleBadge}><Text style={styles.googleBadgeText}>G</Text></View>
      ) : (
        <Ionicons name="location-outline" size={16} color={colours.textMuted} />
      )}
      <View style={styles.suggestionText}>
        <Text style={styles.suggestionName} numberOfLines={1}>{name}</Text>
        {!!subtext && <Text style={styles.suggestionAddress} numberOfLines={1}>{subtext}</Text>}
      </View>
    </Pressable>
  );
}

export function MapPickerScreen(): React.JSX.Element {
  const {
    cameraRef, resolvedAddress, isGeocoding,
    searchQuery, allSuggestions, isSearching, showSuggestions,
    isLocating, isSelectingPlace,
    handleCameraChanged, handleCurrentLocation,
    handleSearchChange, handleSuggestionSelect,
    handleConfirm, handleBack,
  } = useMapPickerScreen();

  return (
    <View style={styles.root}>
      {/* Full-screen map */}
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MAPBOX_STYLE}
        attributionEnabled={false}
        logoEnabled={false}
        onCameraChanged={handleCameraChanged}
      >
        {/* Camera is fully uncontrolled — positioned imperatively via setCamera()
            to avoid animation conflicts with user panning. See useMapPickerScreen. */}
        <MapboxGL.Camera
          ref={cameraRef}
          animationMode="flyTo"
          animationDuration={500}
        />
        <MapboxGL.UserLocation visible />
      </MapboxGL.MapView>

      {/* Fixed crosshair pin at map center */}
      <View style={styles.crosshairWrapper} pointerEvents="none">
        <Ionicons name="location" size={40} color={colours.primary} />
      </View>

      {/* Solid status-bar background — gives the green navbar above "Confirm Location" */}
      <SafeAreaView edges={['top']} style={styles.statusBarBg} pointerEvents="none" />

      {/* Overlay: header + search bar — full screen so suggestions FlatList is never clipped.
          pointerEvents="box-none" keeps map touches working under this overlay. */}
      <SafeAreaView edges={['top']} style={styles.overlay} pointerEvents="box-none">
        <View style={styles.header} pointerEvents="auto">
          <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
          </Pressable>
          <Text style={styles.headerTitle}>Confirm Location</Text>
        </View>

        {/* Search bar + combined Google + Mapbox suggestions */}
        <View style={styles.searchWrap} pointerEvents="auto">
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colours.textMuted} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearchChange}
              placeholder="Search any place in Thailand…"
              placeholderTextColor={colours.textMuted}
              accessibilityLabel="Search address"
              returnKeyType="search"
            />
            {(isSearching || isSelectingPlace) && (
              <ActivityIndicator size="small" color={colours.textMuted} />
            )}
          </View>

          {showSuggestions && (
            <FlatList<MapPickerSuggestionItem>
              data={allSuggestions}
              keyExtractor={(item) => item.key}
              style={styles.suggestions}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <SuggestionRow
                  item={item}
                  onPress={() => { void handleSuggestionSelect(item); }}
                />
              )}
            />
          )}
        </View>
      </SafeAreaView>

      {/* Bottom panel — KeyboardAvoidingView lifts confirm card above keyboard */}
      <KeyboardAvoidingView
        style={styles.bottomPanelWrap}
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        pointerEvents="box-none"
      >
        <SafeAreaView edges={['bottom']} style={styles.bottomPanel}>
          <Pressable
            style={[styles.locationBtn, isLocating && styles.locationBtnDisabled]}
            onPress={handleCurrentLocation}
            disabled={isLocating}
            accessibilityRole="button"
            accessibilityLabel="Use my current location"
          >
            {isLocating
              ? <ActivityIndicator size="small" color={colours.primary} />
              : <Ionicons name="locate" size={18} color={colours.primary} />
            }
            <Text style={styles.locationBtnText}>
              {isLocating ? 'Locating…' : 'Use my current location'}
            </Text>
          </Pressable>

          <View style={styles.addressCard}>
            {isGeocoding ? (
              <ActivityIndicator size="small" color={colours.primary} />
            ) : (
              <Text style={styles.addressText} numberOfLines={2}>
                {resolvedAddress || 'Move the map to set your delivery point'}
              </Text>
            )}
            <Pressable
              style={[styles.confirmBtn, (isGeocoding || !resolvedAddress) && styles.confirmBtnDisabled]}
              onPress={handleConfirm}
              disabled={isGeocoding || !resolvedAddress}
              accessibilityRole="button"
              accessibilityLabel="Confirm this location"
            >
              <Text style={styles.confirmBtnText}>Confirm Location</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
