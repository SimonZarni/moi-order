import React, { useEffect, useRef } from 'react';
import { Image, Platform, Text, View } from 'react-native';
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
  const annotationRef = useRef<MapboxGL.PointAnnotation>(null);

  useEffect(() => {
    const t = setTimeout(() => annotationRef.current?.refresh(), 50);
    return () => clearTimeout(t);
  }, [isSelected]);

  if (!place.latitude || !place.longitude) return null;

  const uri   = place.cover_image ?? null;
  const emoji = CATEGORY_EMOJI[(place.categories[0]?.name_en ?? '').toLowerCase()] ?? CATEGORY_EMOJI['default'];

  const content = (
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
            onLoad={() => annotationRef.current?.refresh()}
          />
        ) : (
          <View style={styles.imageFallback}>
            <Text style={styles.fallbackEmoji}>{emoji}</Text>
          </View>
        )}
      </View>
      <View style={[styles.tail, isSelected && styles.tailSelected]} />
    </View>
  );

  // ── Both platforms: PointAnnotation ──────────────────────────────────────
  // onSelected is Mapbox's own hit-test — bypasses the RN touch system so
  // MapboxMapView owns all touches and panning is never blocked by markers.
  // onLoad → refresh() re-bitmaps after the async Image finishes loading.
  return (
    <MapboxGL.PointAnnotation
      ref={annotationRef}
      id={`marker-${place.id}`}
      coordinate={[place.longitude, place.latitude]}
      anchor={{ x: 0.5, y: 1 }}
      onSelected={() => onPress(place)}
    >
      {content}
    </MapboxGL.PointAnnotation>
  );
}, (prev, next) =>
  prev.place.id === next.place.id &&
  prev.isSelected === next.isSelected,
);
