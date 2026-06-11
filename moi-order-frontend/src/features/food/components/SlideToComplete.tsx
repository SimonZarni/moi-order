import React, { useRef } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { styles, TRACK_WIDTH, THUMB_SIZE } from './SlideToComplete.styles';

interface Props {
  onComplete: () => void;
  disabled?: boolean;
}

const THRESHOLD = TRACK_WIDTH - THUMB_SIZE - 8;

export function SlideToComplete({ onComplete, disabled = false }: Props): React.JSX.Element {
  const translateX = useSharedValue(0);
  const completed  = useRef(false);

  const gesture = Gesture.Pan()
    .enabled(!disabled)
    .onUpdate((e) => {
      translateX.value = Math.max(0, Math.min(THRESHOLD, e.translationX));
    })
    .onEnd((e) => {
      if (e.translationX >= THRESHOLD * 0.85 && !completed.current) {
        completed.current = true;
        translateX.value = withSpring(THRESHOLD, { damping: 18, stiffness: 200 });
        runOnJS(onComplete)();
      } else {
        translateX.value = withSpring(0, { damping: 14, stiffness: 160 });
      }
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, THRESHOLD * 0.6], [1, 0], 'clamp'),
  }));

  return (
    <View style={[styles.track, disabled && styles.trackDisabled]}>
      <Animated.Text style={[styles.trackLabel, labelStyle]}>Slide to Complete Order</Animated.Text>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[styles.thumb, thumbStyle]}
          accessibilityRole="button"
          accessibilityLabel="Slide to complete order"
        >
          <Ionicons name="chevron-forward-outline" size={22} color={colours.white} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
