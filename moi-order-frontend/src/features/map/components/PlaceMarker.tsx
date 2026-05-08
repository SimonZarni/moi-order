import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { CATEGORY_EMOJI } from '@/shared/theme/mapTheme';
import { styles, BUBBLE_SIZE, BUBBLE_SELECTED } from './PlaceMarker.styles';
import type { Place } from '@/types/models';

interface Props {
  place:      Place;
  isSelected: boolean;
  onPress:    (place: Place) => void;
}

export const PlaceMarker = React.memo(function PlaceMarker(
  { place, isSelected, onPress }: Props,
): React.JSX.Element | null {
  // RN Animated (useNativeDriver:false) works inside Mapbox PointAnnotation;
  // Reanimated worklets do not (native thread vs Mapbox's snapshot cycle).
  const progress = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  // imgReady changes key → Mapbox re-snapshots with loaded cover image.
  // isSelected does NOT change the key — animation handles visual update.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [imgReady, setImgReady] = useState(!place.cover_image);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    Animated.timing(progress, {
      toValue:         isSelected ? 1 : 0,
      duration:        220,
      useNativeDriver: false, // border colour + layout → must be false
    }).start();
  }, [isSelected, progress]);

  if (!place.latitude || !place.longitude) return null;

  const emoji = CATEGORY_EMOJI[(place.categories[0]?.name_en ?? '').toLowerCase()] ?? CATEGORY_EMOJI['default'];

  // Animate size and border directly on the bubble — no wrapper ring needed.
  const size         = progress.interpolate({ inputRange: [0, 1], outputRange: [BUBBLE_SIZE, BUBBLE_SELECTED] });
  const radius       = progress.interpolate({ inputRange: [0, 1], outputRange: [BUBBLE_SIZE / 2, BUBBLE_SELECTED / 2] });
  const borderColor  = progress.interpolate({ inputRange: [0, 1], outputRange: ['#FFFFFF', '#10B981'] });
  const borderWidth  = progress.interpolate({ inputRange: [0, 1], outputRange: [2, 3.5] });
  const labelOpacity = progress;

  return (
    <MapboxGL.PointAnnotation
      id={`marker-${place.id}`}
      key={`marker-${place.id}-${imgReady ? '1' : '0'}`}
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
        {/* Bubble — border colour transitions white→green on select */}
        <Animated.View style={[
          styles.bubble,
          { width: size, height: size, borderRadius: radius, borderColor, borderWidth },
        ]}>
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
        </Animated.View>

        <Animated.View style={[styles.labelBubble, { opacity: labelOpacity }]} pointerEvents="none">
          <Text style={styles.labelText} numberOfLines={1}>{place.name_en}</Text>
        </Animated.View>

        <View style={[styles.tail, isSelected && styles.tailSelected]} />
      </View>
    </MapboxGL.PointAnnotation>
  );
}, (prev, next) =>
  prev.place.id === next.place.id &&
  prev.isSelected === next.isSelected,
);
