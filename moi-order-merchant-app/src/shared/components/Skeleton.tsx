import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps): React.JSX.Element {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        { width: width as number, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

export function SkeletonCard({ style }: { style?: ViewStyle }): React.JSX.Element {
  return (
    <View style={[styles.card, style]}>
      <Skeleton height={14} width="50%" borderRadius={6} style={styles.mb} />
      <Skeleton height={28} width="70%" borderRadius={6} style={styles.mb} />
      <Skeleton height={12} width="35%" borderRadius={6} />
    </View>
  );
}

const styles = StyleSheet.create({
  base:  { backgroundColor: '#E5E7EB' },
  card:  { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#F3F4F6' },
  mb:    { marginBottom: 8 },
});
