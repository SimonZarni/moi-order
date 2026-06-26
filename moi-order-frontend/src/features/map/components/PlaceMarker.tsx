import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { CATEGORY_EMOJI } from '@/shared/theme/mapTheme';
import { styles } from './PlaceMarker.styles';
import type { Place } from '@/types/models';

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
  if (!place.latitude || !place.longitude) return null;

  const uri   = place.cover_image ?? null;
  const emoji = CATEGORY_EMOJI[(place.categories[0]?.name_en ?? '').toLowerCase()] ?? CATEGORY_EMOJI['default'];

  // MarkerView renders as a live React Native view — no snapshotting, so images
  // always display correctly regardless of cache / load timing. PointAnnotation
  // bitmaps the view at mount time which races async image decoding.
  return (
    <MapboxGL.MarkerView
      coordinate={[place.longitude, place.latitude]}
      anchor={{ x: 0.5, y: 1 }}
      allowOverlap
    >
      <Pressable
        style={styles.pressable}
        onPress={() => onPress(place)}
        accessibilityRole="button"
        accessibilityLabel={`View ${place.name_en}`}
      >
        <View style={[styles.bubble, isSelected && styles.bubbleSelected]}>
          {uri ? (
            <Image
              source={{ uri }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imageFallback}>
              <Text style={styles.fallbackEmoji}>{emoji}</Text>
            </View>
          )}
        </View>
        <View style={[styles.tail, isSelected && styles.tailSelected]} />
      </Pressable>
    </MapboxGL.MarkerView>
  );
}, (prev, next) =>
  prev.place.id === next.place.id &&
  prev.isSelected === next.isSelected,
);
