import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useStrings } from '@/shared/i18n';
import { styles } from './MapSearchBar.styles';
import type { Place } from '@/types/models';
import type { GeocodingResult } from '@/shared/api/mapbox';
import type { GooglePlaceSuggestion } from '@/shared/api/googlePlaces';

const TAB_NEARBY = 'nearby';
const TAB_ALL    = 'all';

interface Props {
  value:                  string;
  onChangeText:           (v: string) => void;
  onClear:                () => void;
  onSelectPlace:          (place: Place) => void;
  onSelectGeocoding:      (result: GeocodingResult) => void;
  onSelectGooglePlace:    (place: GooglePlaceSuggestion) => void;
  placeSuggestions:       Place[];
  geoSuggestions:         GeocodingResult[];
  googleSuggestions:      GooglePlaceSuggestion[];
  isGeoLoading:           boolean;
  isGoogleLoading:        boolean;
  activeTab:              string | null;
  onTabPress:             (tabId: string) => void;
  activeTagCount:         number;
  onFilterPress:          () => void;
}

export function MapSearchBar({
  value, onChangeText, onClear,
  onSelectPlace, onSelectGeocoding, onSelectGooglePlace,
  placeSuggestions, geoSuggestions, googleSuggestions,
  isGeoLoading, isGoogleLoading,
  activeTab, onTabPress,
  activeTagCount, onFilterPress,
}: Props): React.JSX.Element {
  const inputRef    = useRef<TextInput>(null);
  const focusScale  = useSharedValue(0);

  // Local tab state for instant visual feedback — syncs from parent after data loads.
  const [localTab, setLocalTab] = useState<string | null>(activeTab);
  useEffect(() => { setLocalTab(activeTab); }, [activeTab]);
  const s = useStrings();

  const hasQuery     = value.trim().length > 1;
  const hasPlaces    = placeSuggestions.length > 0;
  const hasGeo       = geoSuggestions.length > 0;
  const hasGoogle    = googleSuggestions.length > 0;
  const showDropdown = hasQuery && (hasPlaces || hasGeo || hasGoogle || isGeoLoading || isGoogleLoading);
  const filterActive = activeTagCount > 0;

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 + focusScale.value * 0.005, { damping: 20 }) }],
  }));

  const handleFocus = useCallback(() => { focusScale.value = 1; }, [focusScale]);
  const handleBlur  = useCallback(() => { focusScale.value = 0; }, [focusScale]);

  const handleSelectPlace  = useCallback((place: Place) => onSelectPlace(place), [onSelectPlace]);
  const handleSelectGeo    = useCallback((r: GeocodingResult) => onSelectGeocoding(r), [onSelectGeocoding]);
  const handleSelectGoogle = useCallback((p: GooglePlaceSuggestion) => onSelectGooglePlace(p), [onSelectGooglePlace]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {/* ── Search pill ─────────────────────────────────── */}
        <Animated.View style={[styles.pill, focusScale.value > 0 && styles.pillFocused, pillStyle]}>
          <Pressable style={styles.searchIconWrap} onPress={() => inputRef.current?.focus()}
            accessibilityRole="button" accessibilityLabel="Search">
            <Text style={[styles.searchIcon, hasQuery && styles.searchIconActive]}>🔍</Text>
          </Pressable>

          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder="Search places, cities…"
            placeholderTextColor={styles.placeholder.color}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            onFocus={handleFocus}
            onBlur={handleBlur}
            accessibilityLabel="Search places"
          />

          {value.length > 0 && (
            <Pressable onPress={onClear} style={styles.clearBtn}
              accessibilityRole="button" accessibilityLabel="Clear search">
              <Text style={styles.clearText}>✕</Text>
            </Pressable>
          )}
        </Animated.View>

        {/* ── Filter button ────────────────────────────────── */}
        <Pressable
          onPress={onFilterPress}
          style={[styles.filterBtn, filterActive && styles.filterBtnActive]}
          accessibilityRole="button"
          accessibilityLabel={filterActive ? `${activeTagCount} tag filters active` : 'Filter by tags'}
        >
          <Ionicons
            name="funnel-outline"
            size={19}
            color={filterActive ? '#ffffff' : '#224e4a'}
          />
          {activeTagCount > 0 && (
            <View style={[styles.filterBadge, filterActive && styles.filterBadgeActive]}>
              <Text style={[styles.filterBadgeText, filterActive && styles.filterBadgeTextActive]}>
                {activeTagCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* ── Nearby / All tabs (shown when no dropdown) ── */}
      {!showDropdown && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow} keyboardShouldPersistTaps="handled"
          decelerationRate="fast">
          <Pressable
            onPressIn={() => setLocalTab(t => t === TAB_NEARBY ? null : TAB_NEARBY)}
            onPress={() => onTabPress(TAB_NEARBY)}
            style={[styles.tab, localTab === TAB_NEARBY && styles.tabActive]}
            accessibilityRole="button" accessibilityLabel="Show nearby places">
            <Text style={[styles.tabText, localTab === TAB_NEARBY && styles.tabTextActive]}>
              {s.map.nearby}
            </Text>
          </Pressable>
          <Pressable
            onPressIn={() => setLocalTab(t => t === TAB_ALL ? null : TAB_ALL)}
            onPress={() => onTabPress(TAB_ALL)}
            style={[styles.tab, localTab === TAB_ALL && styles.tabActive]}
            accessibilityRole="button" accessibilityLabel="Show all places">
            <Text style={[styles.tabText, localTab === TAB_ALL && styles.tabTextActive]}>
              {s.map.all}
            </Text>
          </Pressable>
        </ScrollView>
      )}

      {/* ── Dropdown suggestions ── */}
      {showDropdown && (
        <ScrollView
          style={styles.dropdown}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {hasPlaces && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>📌 Your Places</Text>
              </View>
              {placeSuggestions.map((place, i) => (
                <Pressable key={place.id} onPress={() => handleSelectPlace(place)}
                  style={[styles.suggestionRow, i < placeSuggestions.length - 1 && styles.rowBorder]}
                  accessibilityRole="button" accessibilityLabel={`Select ${place.name_en}`}>
                  <View style={styles.thumbCircle}>
                    {place.cover_image
                      ? <Image source={{ uri: place.cover_image }} style={styles.thumbImage} contentFit="cover" transition={150} />
                      : <Text style={styles.thumbEmoji}>📍</Text>
                    }
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowName} numberOfLines={1}>{place.name_en}</Text>
                    <Text style={styles.rowSub} numberOfLines={1}>
                      {place.categories[0]?.name_en ?? ''}{place.city ? ` · ${place.city}` : ''}
                    </Text>
                  </View>
                  <View style={styles.appBadge}>
                    <Text style={styles.appBadgeText}>MOI</Text>
                  </View>
                </Pressable>
              ))}
            </>
          )}

          {(hasGoogle || isGoogleLoading) && (
            <>
              <View style={[styles.sectionHeader, hasPlaces && styles.sectionHeaderBorderTop]}>
                <Text style={styles.sectionLabel}>🔍 Google Places</Text>
                {isGoogleLoading && <Text style={styles.loadingDot}>…</Text>}
              </View>
              {googleSuggestions.map((result, i) => (
                <Pressable key={result.place_id} onPress={() => handleSelectGoogle(result)}
                  style={[styles.suggestionRow, i < googleSuggestions.length - 1 && styles.rowBorder]}
                  accessibilityRole="button" accessibilityLabel={`Select ${result.name}`}>
                  <View style={[styles.thumbCircle, styles.thumbGoogle]}>
                    <Text style={styles.thumbGoogleText}>G</Text>
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowName} numberOfLines={1}>{result.name}</Text>
                    {!!result.address && (
                      <Text style={styles.rowSub} numberOfLines={1}>{result.address}</Text>
                    )}
                  </View>
                  <View style={styles.googleBadge}>
                    <Text style={styles.googleBadgeText}>Maps</Text>
                  </View>
                </Pressable>
              ))}
            </>
          )}

          {(hasGeo || isGeoLoading) && (
            <>
              <View style={[styles.sectionHeader, (hasPlaces || hasGoogle) && styles.sectionHeaderBorderTop]}>
                <Text style={styles.sectionLabel}>🗺 Other Locations</Text>
                {isGeoLoading && <Text style={styles.loadingDot}>…</Text>}
              </View>
              {geoSuggestions.map((result, i) => (
                <Pressable key={result.id} onPress={() => handleSelectGeo(result)}
                  style={[styles.suggestionRow, i < geoSuggestions.length - 1 && styles.rowBorder]}
                  accessibilityRole="button" accessibilityLabel={`Go to ${result.name}`}>
                  <View style={[styles.thumbCircle, styles.thumbGeo]}>
                    <Text style={styles.thumbEmoji}>🌐</Text>
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowName} numberOfLines={1}>{result.name}</Text>
                    <Text style={styles.rowSub} numberOfLines={1}>{result.full_address}</Text>
                  </View>
                </Pressable>
              ))}
            </>
          )}

          {hasQuery && !hasPlaces && !hasGoogle && !hasGeo && !isGeoLoading && !isGoogleLoading && (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>No results for "{value}"</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
