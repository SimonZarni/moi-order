import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_W } = Dimensions.get('window');
const LOGO_SIZE = Math.round(SCREEN_W * 0.55);

interface Props {
  /** When true the splash fades out and calls onHidden. */
  canHide: boolean;
  onHidden: () => void;
}

/**
 * Animated splash screen shown at app launch.
 * Plays a light-sweep shimmer across the logo on loop until canHide → fade out.
 */
export function AnimatedSplash({ canHide, onHidden }: Props): React.JSX.Element {
  const shineX   = useRef(new Animated.Value(-LOGO_SIZE)).current;
  const opacity  = useRef(new Animated.Value(1)).current;
  const shineRef = useRef<Animated.CompositeAnimation | null>(null);
  const hidingRef = useRef(false);

  // Shimmer loop — runs continuously until we start the hide sequence.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shineX, {
          toValue:  LOGO_SIZE * 1.6,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.delay(700),
        Animated.timing(shineX, {
          toValue: -LOGO_SIZE,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    shineRef.current = loop;
    loop.start();
    return () => loop.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fade out as soon as canHide flips to true (guarded against double-fire).
  useEffect(() => {
    if (!canHide || hidingRef.current) return;
    hidingRef.current = true;
    shineRef.current?.stop();
    Animated.timing(opacity, {
      toValue:  0,
      duration: 350,
      useNativeDriver: true,
    }).start(onHidden);
  }, [canHide, opacity, onHidden]);

  return (
    <Animated.View style={[styles.root, { opacity }]}>
      {/* Logo + shine clip container */}
      <View style={styles.logoWrap}>
        <Image
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('../../../assets/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Shine sweep — clipped to the logo bounds by parent overflow:hidden */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { transform: [{ translateX: shineX }] },
          ]}
        >
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.38)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shine}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#063B21',
    alignItems:      'center',
    justifyContent:  'center',
    zIndex:          9999,
  },
  logoWrap: {
    width:    LOGO_SIZE,
    height:   LOGO_SIZE,
    overflow: 'hidden',   // clips the shimmer to the logo area
  },
  logo: {
    width:  '100%',
    height: '100%',
  },
  shine: {
    width:           70,
    height:          '100%',
    // skew gives the diagonal sweep look
    transform:       [{ skewX: '-18deg' }],
  },
});
