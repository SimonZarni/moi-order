import React, { useEffect, useMemo, useRef } from 'react';
import { Image, Platform, Text, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
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
  // iOS only: PointAnnotation bitmaps the view at mount; refresh() forces a new
  // snapshot after isSelected style change or after the Image finishes loading.
  const annotationRef = useRef<MapboxGL.PointAnnotation>(null);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const t = setTimeout(() => annotationRef.current?.refresh(), 50);
    return () => clearTimeout(t);
  }, [isSelected]);

  // Android only: RNGH Tap gesture — automatically fails when the user pans,
  // which lets the native Mapbox pan recogniser pick up the touch.
  // This is the RNGH v2 interop guarantee; Pressable/onTouchEnd do NOT release
  // the touch to the native layer on Android, which blocks map panning.
  const tapGesture = useMemo(
    () => Gesture.Tap().onEnd(() => { runOnJS(onPress)(place); }),
    [onPress, place],
  );

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
            onLoad={Platform.OS === 'ios' ? () => annotationRef.current?.refresh() : undefined}
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

  // ── Android: MarkerView + RNGH Tap ────────────────────────────────────────
  // MarkerView renders the RN view directly as a native overlay — no bitmap
  // snapshot is taken, so async Image loads display correctly (fixes blank markers).
  // RNGH Tap releases the touch on pan, so the Mapbox pan recogniser works even
  // when the drag starts on a marker (fixes stuck scroll + can't-pan-on-marker).
  if (Platform.OS === 'android') {
    return (
      <MapboxGL.MarkerView
        id={`marker-${place.id}`}
        coordinate={[place.longitude, place.latitude]}
        anchor={{ x: 0.5, y: 1 }}
      >
        <GestureDetector gesture={tapGesture}>
          {content}
        </GestureDetector>
      </MapboxGL.MarkerView>
    );
  }

  // ── iOS: PointAnnotation ──────────────────────────────────────────────────
  // onSelected is the Mapbox-native tap handler; onLoad + refresh() keep the
  // bitmap snapshot in sync with async Image loads and selection state changes.
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
