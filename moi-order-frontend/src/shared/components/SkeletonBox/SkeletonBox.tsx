/**
 * Principle: SRP — renders one animated shimmer rectangle; zero domain logic.
 * Generic building block for skeleton screens. Accepts baseColor so it works on
 * both dark (place cards) and light (detail section cards) backgrounds.
 */
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, ViewStyle } from 'react-native';

import { styles } from './SkeletonBox.styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SHIMMER_WIDTH = SCREEN_WIDTH * 2;

interface SkeletonBoxProps {
  height: number;
  borderRadius?: number;
  /** Fill colour of the static skeleton shape. */
  baseColor?: string;
  /** Highlight colour of the moving shimmer strip. */
  shimmerColor?: string;
  style?: ViewStyle;
}

export function SkeletonBox({
  height,
  borderRadius = 0,
  baseColor = '#e2e8f0',
  shimmerColor = 'rgba(255,255,255,0.65)',
  style,
}: SkeletonBoxProps): React.JSX.Element {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1300,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <Animated.View
      style={[styles.base, { height, borderRadius, backgroundColor: baseColor }, style]}
    >
      <Animated.View style={[styles.shimmerTrack, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={['transparent', shimmerColor, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ width: SHIMMER_WIDTH, height: '100%' }}
        />
      </Animated.View>
    </Animated.View>
  );
}
