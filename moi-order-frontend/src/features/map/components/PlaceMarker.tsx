import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { CATEGORY_EMOJI } from '@/shared/theme/mapTheme';
import { styles } from './PlaceMarker.styles';
import type { Place } from '@/types/models';

interface Props {
  place:      Place;
  isSelected: boolean;
  onPress:    (place: Place) => void;
}

export const PlaceMarker = React.memo(function PlaceMarker(
  { place, isSelected, onPress }: Props,
): React.JSX.Element | null {
  if (!place.latitude || !place.longitude) return null;

  const emoji = CATEGORY_EMOJI[(place.categories[0]?.name_en ?? '').toLowerCase()] ?? CATEGORY_EMOJI['default'];

  // Mapbox PointAnnotation snapshots the view at mount — before async Image loads.
  // Changing the key after onLoad forces a re-snapshot with the actual image.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [imgReady, setImgReady] = useState(!place.cover_image);

  return (
    <MapboxGL.PointAnnotation
      id={`marker-${place.id}`}
      key={`marker-${place.id}-${imgReady ? '1' : '0'}`}
      coordinate={[place.longitude, place.latitude]}
      anchor={{ x: 0.5, y: 1 }}
      onSelected={() => onPress(place)}
      selected={isSelected}
    >
      {/* Exactly 1 subview — no expo-image (its transition animation injects a
          second native view during the bitmap snapshot, causing the PointAnnotation
          "max 1 subview" native error). Emoji + RN views only. */}
      <View
        style={styles.pressable}
        collapsable={false}
        accessibilityRole="button"
        accessibilityLabel={`View ${place.name_en}`}
      >
        <View style={[styles.bubble, isSelected && styles.bubbleSelected]}>
          {place.cover_image ? (
            <Image
              source={{ uri: place.cover_image }}
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

        <View style={[styles.labelBubble, { opacity: isSelected ? 1 : 0 }]}>
          <Text style={styles.labelText} numberOfLines={1}>{place.name_en}</Text>
        </View>

        <View style={[styles.tail, isSelected && styles.tailSelected]} />
      </View>
    </MapboxGL.PointAnnotation>
  );
}, (prev, next) =>
  prev.place.id === next.place.id &&
  prev.isSelected === next.isSelected,
);
