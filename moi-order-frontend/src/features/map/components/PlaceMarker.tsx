import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
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
  // Mapbox PointAnnotation snapshots the React Native view at mount time.
  // Changing the key forces a full remount + fresh snapshot with correct styles.
  // imgReady always starts false so onLoad fires a key change after the native
  // Image has rendered its pixels — starting true causes Mapbox to snapshot
  // before pixels are composited, producing a blank marker.
  const uri = place.cover_image ?? null;
  const [imgReady, setImgReady] = useState<boolean>(false);

  if (!place.latitude || !place.longitude) return null;

  const emoji = CATEGORY_EMOJI[(place.categories[0]?.name_en ?? '').toLowerCase()] ?? CATEGORY_EMOJI['default'];

  return (
    <MapboxGL.PointAnnotation
      id={`marker-${place.id}`}
      key={`marker-${place.id}-${isSelected ? 's' : 'n'}-${imgReady ? '1' : '0'}`}
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
        <View style={[styles.bubble, isSelected && styles.bubbleSelected]}>
          {uri ? (
            <Image
              source={{ uri }}
              style={styles.coverImage}
              resizeMode="cover"
              onLoad={() => setImgReady(true)}
            />
          ) : (
            <View style={styles.imageFallback}>
              <Text style={styles.fallbackEmoji}>{emoji}</Text>
            </View>
          )}
        </View>
        <View style={[styles.tail, isSelected && styles.tailSelected]} />
      </View>
    </MapboxGL.PointAnnotation>
  );
}, (prev, next) =>
  prev.place.id === next.place.id &&
  prev.isSelected === next.isSelected,
);
