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
  // Mapbox PointAnnotation snapshots the React Native view at mount time.
  // Neither Reanimated nor RN Animated propagate post-mount updates.
  // The ONLY way to update the visual is to change the key, forcing a
  // full remount and fresh snapshot with the correct static styles.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [imgReady, setImgReady] = useState(!place.cover_image);

  if (!place.latitude || !place.longitude) return null;

  const emoji = CATEGORY_EMOJI[(place.categories[0]?.name_en ?? '').toLowerCase()] ?? CATEGORY_EMOJI['default'];

  return (
    <MapboxGL.PointAnnotation
      id={`marker-${place.id}`}
      key={`marker-${place.id}-${isSelected ? 's' : 'n'}-${imgReady ? '1' : '0'}`}
      coordinate={[place.longitude, place.latitude]}
      anchor={{ x: 0.5, y: 1 }}
      onSelected={() => onPress(place)}
      selected={isSelected}
    >
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

        {isSelected && (
          <View style={styles.labelBubble}>
            <Text style={styles.labelText} numberOfLines={1}>{place.name_en}</Text>
          </View>
        )}

        <View style={[styles.tail, isSelected && styles.tailSelected]} />
      </View>
    </MapboxGL.PointAnnotation>
  );
}, (prev, next) =>
  prev.place.id === next.place.id &&
  prev.isSelected === next.isSelected,
);
