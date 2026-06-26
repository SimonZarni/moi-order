import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { CATEGORY_EMOJI } from '@/shared/theme/mapTheme';
import { styles } from './PlaceMarker.styles';
import type { Place } from '@/types/models';

// ─── Module-level cache ───────────────────────────────────────────────────────
// Persists across React remounts (which Mapbox forces on every key change).
// If a cover_image URL was loaded before, the next remount starts with
// imgReady=true so Mapbox snapshots the image instead of the white placeholder.
const loadedImageUris = new Set<string>();

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  place:      Place;
  isSelected: boolean;
  onPress:    (place: Place) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const PlaceMarker = React.memo(function PlaceMarker(
  { place, isSelected, onPress }: Props,
): React.JSX.Element | null {
  // Mapbox PointAnnotation snapshots the React Native view at mount time.
  // Neither Reanimated nor RN Animated propagate post-mount updates.
  // The ONLY way to update the visual is to change the key, forcing a
  // full remount and fresh snapshot with the correct static styles.
  //
  // White flash fix: if the image was loaded in a previous render cycle
  // (tracked in the module-level Set), start imgReady=true so the snapshot
  // sees the cached image immediately rather than the white background.
  const uri = place.cover_image ?? null;
  const [imgReady, setImgReady] = useState<boolean>(
    () => !uri || loadedImageUris.has(uri),
  );

  if (!place.latitude || !place.longitude) return null;

  const emoji = CATEGORY_EMOJI[(place.categories[0]?.name_en ?? '').toLowerCase()] ?? CATEGORY_EMOJI['default'];

  return (
    <MapboxGL.PointAnnotation
      id={`marker-${place.id}`}
      key={`marker-${place.id}-${imgReady ? '1' : '0'}`}
      coordinate={[place.longitude, place.latitude]}
      anchor={{ x: 0.5, y: 1 }}
      onSelected={() => onPress(place)}
    >
      <View
        style={styles.pressable}
        collapsable={false}
        accessibilityRole="button"
        accessibilityLabel={`View ${place.name_en}`}
      >
        <View style={styles.bubble}>
          {uri ? (
            <Image
              source={{ uri }}
              style={styles.coverImage}
              resizeMode="cover"
              onLoad={() => {
                loadedImageUris.add(uri);
                setImgReady(true);
              }}
            />
          ) : (
            <View style={styles.imageFallback}>
              <Text style={styles.fallbackEmoji}>{emoji}</Text>
            </View>
          )}
        </View>
        <View style={styles.tail} />
      </View>
    </MapboxGL.PointAnnotation>
  );
}, (prev, next) =>
  prev.place.id === next.place.id &&
  prev.isSelected === next.isSelected,
);
