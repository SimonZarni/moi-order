import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { CATEGORY_EMOJI } from '@/shared/theme/mapTheme';
import { styles, BUBBLE_SIZE, BUBBLE_SELECTED } from './PlaceMarker.styles';
import type { Place } from '@/types/models';

const GREEN = '#10B981';
const WHITE = '#FFFFFF';

interface Props {
  place:      Place;
  isSelected: boolean;
  onPress:    (place: Place) => void;
}

export const PlaceMarker = React.memo(function PlaceMarker(
  { place, isSelected, onPress }: Props,
): React.JSX.Element | null {
  // All hooks before early return
  // useNativeDriver: false — layout/color properties cannot use native driver.
  // RN Animated (JS thread) works correctly inside Mapbox PointAnnotation;
  // Reanimated worklets (native thread) do not — Mapbox snapshots the view
  // before native-thread updates propagate.
  const progress = useRef(new Animated.Value(isSelected ? 1 : 0)).current;
  const [imgReady, setImgReady] = useState(!place.cover_image);

  useEffect(() => {
    Animated.spring(progress, {
      toValue:          isSelected ? 1 : 0,
      useNativeDriver:  false,
      damping:          20,
      stiffness:        280,
    }).start();
  }, [isSelected, progress]);

  // Ring wrap — grows from 0→4px padding + 0→3px green border
  const ringSize    = progress.interpolate({ inputRange: [0, 1], outputRange: [BUBBLE_SIZE, BUBBLE_SELECTED + 8] });
  const ringPad     = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 4] });
  const ringBorder  = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 3] });
  const ringColor   = progress.interpolate({ inputRange: [0, 1], outputRange: ['rgba(16,185,129,0)', GREEN] });
  const ringRadius  = (ringSize as any).interpolate
    ? (ringSize as Animated.AnimatedInterpolation<number>).interpolate({ inputRange: [BUBBLE_SIZE, BUBBLE_SELECTED + 8], outputRange: [BUBBLE_SIZE / 2, (BUBBLE_SELECTED + 8) / 2] })
    : BUBBLE_SIZE / 2;

  // Bubble — grows from BUBBLE_SIZE → BUBBLE_SELECTED
  const bubbleSize  = progress.interpolate({ inputRange: [0, 1], outputRange: [BUBBLE_SIZE, BUBBLE_SELECTED] });
  const bubbleRadius = progress.interpolate({ inputRange: [0, 1], outputRange: [BUBBLE_SIZE / 2, BUBBLE_SELECTED / 2] });

  // Label fades in
  const labelOpacity = progress;

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
      {/* Exactly 1 subview. Using RN Animated (not Reanimated) so updates are
          visible inside Mapbox PointAnnotation's view hierarchy. */}
      <View
        style={styles.pressable}
        collapsable={false}
        accessibilityRole="button"
        accessibilityLabel={`View ${place.name_en}`}
      >
        {/* Ring wrap: green border ring appears on select */}
        <Animated.View style={[
          styles.ringWrap,
          {
            width:        ringSize,
            height:       ringSize,
            borderRadius: ringRadius,
            padding:      ringPad,
            borderWidth:  ringBorder,
            borderColor:  ringColor,
          },
        ]}>
          <Animated.View style={[
            styles.bubbleBase,
            {
              width:        bubbleSize,
              height:       bubbleSize,
              borderRadius: bubbleRadius,
            },
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
