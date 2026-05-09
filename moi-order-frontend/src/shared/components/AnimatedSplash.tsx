import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Platform, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_W } = Dimensions.get('window');
const LOGO_SIZE  = SCREEN_W;
const SPLASH_BG  = '#063B21';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ICON = require('../../../assets/splash-icon.png');

interface Props {
  canHide: boolean;
  onHidden: () => void;
}

export function AnimatedSplash({ canHide, onHidden }: Props): React.JSX.Element {
  const shineX    = useRef(new Animated.Value(-LOGO_SIZE)).current;
  const opacity   = useRef(new Animated.Value(1)).current;
  const shineRef  = useRef<Animated.CompositeAnimation | null>(null);
  const hidingRef = useRef(false);

  // Android: skip JS splash entirely — the native splash (splashscreen.xml) already
  // covers the launch. Call onHidden immediately so the app renders without delay.
  useEffect(() => {
    if (Platform.OS === 'android') { onHidden(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shineX, { toValue: LOGO_SIZE * 1.6, duration: 900, useNativeDriver: true }),
        Animated.delay(700),
        Animated.timing(shineX, { toValue: -LOGO_SIZE, duration: 0, useNativeDriver: true }),
      ]),
    );
    shineRef.current = loop;
    loop.start();
    return () => loop.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') return;
    if (!canHide || hidingRef.current) return;
    hidingRef.current = true;
    shineRef.current?.stop();
    Animated.timing(opacity, { toValue: 0, duration: 350, useNativeDriver: true }).start(onHidden);
  }, [canHide, opacity, onHidden]);

  if (Platform.OS === 'android') return <View />;

  return (
    <Animated.View style={[styles.root, { opacity }]}>
      <View style={styles.logoWrap}>
        <Image source={ICON} style={styles.logo} resizeMode="contain" />
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { transform: [{ translateX: shineX }] }]}
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
    backgroundColor: SPLASH_BG,
    alignItems:      'center',
    justifyContent:  'center',
    zIndex:          9999,
  },
  logoWrap: {
    width:    LOGO_SIZE,
    height:   LOGO_SIZE,
    overflow: 'hidden',
  },
  logo: {
    width:  '100%',
    height: '100%',
  },
  shine: {
    width:     70,
    height:    '100%',
    transform: [{ skewX: '-18deg' }],
  },
});
