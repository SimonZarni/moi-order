import React, { useRef, useCallback } from 'react';
import { Animated, PanResponder, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { styles, TRACK_WIDTH, THUMB_SIZE } from './SlideToComplete.styles';

interface Props {
  onComplete: () => void;
  disabled?: boolean;
}

const THRESHOLD = TRACK_WIDTH - THUMB_SIZE - 8;

export function SlideToComplete({ onComplete, disabled = false }: Props): React.JSX.Element {
  const translateX = useRef(new Animated.Value(0)).current;
  const completed  = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        Animated.spring(translateX, { toValue: 4, useNativeDriver: true, friction: 8 }).start();
      },
      onPanResponderMove: (_, gs) => {
        const clamped = Math.max(0, Math.min(THRESHOLD, gs.dx));
        translateX.setValue(clamped);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx >= THRESHOLD * 0.85 && !completed.current) {
          completed.current = true;
          Animated.spring(translateX, { toValue: THRESHOLD, useNativeDriver: true }).start();
          onComplete();
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true, friction: 6 }).start();
        }
      },
    }),
  ).current;

  const opacity = translateX.interpolate({ inputRange: [0, THRESHOLD * 0.6], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <View style={[styles.track, disabled && styles.trackDisabled]}>
      <Animated.Text style={[styles.trackLabel, { opacity }]}>Slide to Complete Order</Animated.Text>
      <Animated.View
        style={[styles.thumb, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
        accessibilityRole="button"
        accessibilityLabel="Slide to complete order"
      >
        <Ionicons name="chevron-forward-outline" size={22} color={colours.white} />
      </Animated.View>
    </View>
  );
}
