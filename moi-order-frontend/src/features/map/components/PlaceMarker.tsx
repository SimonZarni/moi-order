import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  interpolateColor,
  Extrapolation,
} from 'react-native-reanimated';
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
  // All hooks before early return
  const progress = useSharedValue(isSelected ? 1 : 0);

  // imgReady: false until the cover image loads — key change on PointAnnotation
  // forces Mapbox to re-snapshot with the loaded image instead of a white box.
  const [imgReady, setImgReady] = useState(!place.cover_image);

  useEffect(() => {
    progress.value = withSpring(isSelected ? 1 : 0, { damping: 18, stiffness: 260 });
  }, [isSelected, progress]);

  const bubbleAnimStyle = useAnimatedStyle(() => {
    'worklet';
    const size = interpolate(progress.value, [0, 1], [BUBBLE_SIZE, BUBBLE_SELECTED], Extrapolation.CLAMP);
    return {
      width:        size,
      height:       size,
      borderRadius: size / 2,
      borderWidth:  interpolate(progress.value, [0, 1], [2.5, 3.5], Extrapolation.CLAMP),
      borderColor:  interpolateColor(progress.value, [0, 1], ['#FFFFFF', '#10B981']),
      shadowOpacity: interpolate(progress.value, [0, 1], [0.28, 0.55], Extrapolation.CLAMP),
      shadowRadius:  interpolate(progress.value, [0, 1], [4, 12], Extrapolation.CLAMP),
      shadowColor:   interpolateColor(progress.value, [0, 1], ['#000000', '#10B981']),
      elevation:     interpolate(progress.value, [0, 1], [6, 14], Extrapolation.CLAMP),
    };
  });

  const labelAnimStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  if (!place.latitude || !place.longitude) return null;

  const emoji = CATEGORY_EMOJI[(place.categories[0]?.name_en ?? '').toLowerCase()] ?? CATEGORY_EMOJI['default'];

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
          "max 1 subview" native error). RN Image + Reanimated views only. */}
      <View
        style={styles.pressable}
        collapsable={false}
        accessibilityRole="button"
        accessibilityLabel={`View ${place.name_en}`}
      >
        <Animated.View style={[styles.bubbleBase, bubbleAnimStyle]}>
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

        <Animated.View style={[styles.labelBubble, labelAnimStyle]} pointerEvents="none">
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
