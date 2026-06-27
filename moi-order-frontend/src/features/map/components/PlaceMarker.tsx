import React, { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
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
  // PointAnnotation bitmaps the view at mount. refresh() forces a new snapshot:
  //   • onLoad  → image pixels are rendered → fresh snapshot captures them
  //   • isSelected effect → styles updated → fresh snapshot captures new size/colour
  // MarkerView was tried but its native onTouchEnd stopPropagation blocks map
  // panning on Android. PointAnnotation avoids this entirely.
  // Android tap detection is handled by ShapeSource.onPress in PlacesMapScreen.
  const annotationRef = useRef<MapboxGL.PointAnnotation>(null);

  useEffect(() => {
    const t = setTimeout(() => annotationRef.current?.refresh(), 50);
    return () => clearTimeout(t);
  }, [isSelected]);

  if (!place.latitude || !place.longitude) return null;

  const uri   = place.cover_image ?? null;
  const emoji = CATEGORY_EMOJI[(place.categories[0]?.name_en ?? '').toLowerCase()] ?? CATEGORY_EMOJI['default'];

  return (
    <MapboxGL.PointAnnotation
      ref={annotationRef}
      id={`marker-${place.id}`}
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
              cachePolicy="memory-disk"
            onLoad={() => setTimeout(() => annotationRef.current?.refresh(), 0)}
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
