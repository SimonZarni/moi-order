import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { CATEGORY_EMOJI } from '@/shared/theme/mapTheme';
import { styles, BUBBLE_SIZE, BUBBLE_SELECTED } from './PlaceMarker.styles';
import type { Place } from '@/types/models';

const GREEN = '#10B981';

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
  const [imgReady, setImgReady] = useState(!place.cover_image);

  useEffect(() => {
    progress.value = withSpring(isSelected ? 1 : 0, { damping: 20, stiffness: 280 });
  }, [isSelected, progress]);

  // Outer ring: transparent when unselected, green bordered ring when selected.
  // padding creates the gap between ring border and bubble edge.
  const ringWrapStyle = useAnimatedStyle(() => {
    'worklet';
    const bubbleSize  = interpolate(progress.value, [0, 1], [BUBBLE_SIZE, BUBBLE_SELECTED], Extrapolation.CLAMP);
    const ringPad     = interpolate(progress.value, [0, 1], [0, 4], Extrapolation.CLAMP);
    const ringBorder  = interpolate(progress.value, [0, 1], [0, 3], Extrapolation.CLAMP);
    const total       = bubbleSize + ringPad * 2;
    return {
      width:        total,
      height:       total,
      borderRadius: total / 2,
      padding:      ringPad,
      borderWidth:  ringBorder,
      borderColor:  GREEN,
    };
  });

  // Bubble: grows slightly, border stays white (ring wrap provides green)
  const bubbleStyle = useAnimatedStyle(() => {
    'worklet';
    const size = interpolate(progress.value, [0, 1], [BUBBLE_SIZE, BUBBLE_SELECTED], Extrapolation.CLAMP);
    return {
      width:        size,
      height:       size,
      borderRadius: size / 2,
    };
  });

  const labelStyle = useAnimatedStyle(() => ({
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
      {/* Exactly 1 subview — Reanimated Animated.View is safe; expo-image is not
          (its transition injects a 2nd native view during Mapbox's snapshot). */}
      <View
        style={styles.pressable}
        collapsable={false}
        accessibilityRole="button"
        accessibilityLabel={`View ${place.name_en}`}
      >
        {/* Ring wrap: green border ring that grows around the bubble on select */}
        <Animated.View style={[styles.ringWrap, ringWrapStyle]}>
          <Animated.View style={[styles.bubbleBase, bubbleStyle]}>
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
        </Animated.View>

        <Animated.View style={[styles.labelBubble, labelStyle]} pointerEvents="none">
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
