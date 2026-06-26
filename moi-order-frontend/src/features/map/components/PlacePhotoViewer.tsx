import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList, Modal, Pressable, StatusBar, StyleSheet,
  Text, View, useWindowDimensions, type ViewToken,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS, useAnimatedStyle, useSharedValue,
  withSpring, withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { styles } from './PlacePhotoViewer.styles';

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  images:       string[];
  initialIndex: number;
  onClose:      () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DISMISS_THRESHOLD_PX = 80;
const DISMISS_VELOCITY_PPS = 800;

// ─── Component ───────────────────────────────────────────────────────────────

export function PlacePhotoViewer({ images, initialIndex, onClose }: Props): React.JSX.Element {
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const listRef = useRef<FlatList>(null);

  // translateY  — the whole sheet slides with the finger
  // backdropOp  — black backdrop fades as you drag (reveals map behind modal)
  // imageOp     — photo itself fades, creating the "blend into background" feel
  // imageScale  — subtle shrink so the photo feels like it's receding
  // chromeOp    — counter/X/dots vanish immediately once dragging begins
  const translateY  = useSharedValue(0);
  const backdropOp  = useSharedValue(1);
  const imageOp     = useSharedValue(1);
  const imageScale  = useSharedValue(1);
  const chromeOp    = useSharedValue(1);

  useEffect(() => {
    StatusBar.setHidden(true, 'fade');
    return () => StatusBar.setHidden(false, 'fade');
  }, []);

  useEffect(() => {
    if (images.length > 1) {
      listRef.current?.scrollToOffset({ offset: initialIndex * width, animated: false });
    }
  }, [initialIndex, width, images.length]);

  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  const callClose = useCallback(() => closeRef.current(), []);

  const panGesture = Gesture.Pan()
    .activeOffsetY([-8, 8])
    .failOffsetX([-15, 15])
    .onUpdate((e) => {
      const drag     = Math.abs(e.translationY);
      const progress = drag / height;

      translateY.value = e.translationY;

      // Backdrop and image fade together — full transparency at 50% screen height
      const fade = Math.max(0, 1 - progress * 2);
      backdropOp.value = fade;
      imageOp.value    = Math.max(0.25, 1 - progress * 1.6);

      // Subtle scale — shrinks from 1 → 0.88 at full drag
      imageScale.value = Math.max(0.88, 1 - progress * 0.14);

      // Chrome disappears in the first 35pt of drag then is gone
      chromeOp.value = Math.max(0, 1 - drag / 35);
    })
    .onEnd((e) => {
      const shouldDismiss =
        Math.abs(e.translationY) > DISMISS_THRESHOLD_PX ||
        Math.abs(e.velocityY) > DISMISS_VELOCITY_PPS;

      if (shouldDismiss) {
        // Fly off in the direction of the drag; backdrop + image fade out together
        const toY = e.translationY > 0 ? height : -height;
        translateY.value  = withTiming(toY, { duration: 240 });
        imageOp.value     = withTiming(0,   { duration: 200 });
        imageScale.value  = withTiming(0.88, { duration: 240 });
        backdropOp.value  = withTiming(0,   { duration: 240 }, () => runOnJS(callClose)());
      } else {
        // Snap back — spring for position/scale, timing for opacity
        translateY.value = withSpring(0, { damping: 22, stiffness: 220 });
        imageScale.value = withSpring(1, { damping: 22, stiffness: 220 });
        backdropOp.value = withTiming(1, { duration: 180 });
        imageOp.value    = withTiming(1, { duration: 180 });
        chromeOp.value   = withTiming(1, { duration: 200 });
      }
    });

  const containerStyle  = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  const backdropStyle   = useAnimatedStyle(() => ({ opacity: backdropOp.value }));
  const imageLayerStyle = useAnimatedStyle(() => ({
    opacity:   imageOp.value,
    transform: [{ scale: imageScale.value }],
  }));
  const chromeStyle = useAnimatedStyle(() => ({ opacity: chromeOp.value }));

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const idx = viewableItems[0]?.index;
    if (idx != null) setCurrentIndex(idx);
  }).current;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={callClose}
    >
      <GestureHandlerRootView style={styles.root}>

        {/* Black backdrop — fades as you drag, revealing the map behind the modal */}
        <Animated.View style={[styles.backdrop, backdropStyle]} />

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.container, containerStyle]}>

            {/* Image layer — fades and scales while dragging */}
            <Animated.View style={[StyleSheet.absoluteFillObject, imageLayerStyle]}>
              <FlatList
                ref={listRef}
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item }) => (
                  <View style={{ width, height }}>
                    <Image source={{ uri: item }} style={styles.image} contentFit="contain" />
                  </View>
                )}
                getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                scrollEventThrottle={16}
              />
            </Animated.View>

            {/* Chrome (X, counter, dots) — fades out immediately once drag begins */}
            <Animated.View
              pointerEvents="box-none"
              style={[StyleSheet.absoluteFillObject, chromeStyle]}
            >
              <Pressable
                style={styles.closeBtn}
                onPress={callClose}
                accessibilityRole="button"
                accessibilityLabel="Close photo viewer"
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </Pressable>

              {images.length > 1 && (
                <>
                  <View style={styles.counter}>
                    <Text style={styles.counterText}>
                      {currentIndex + 1} / {images.length}
                    </Text>
                  </View>
                  <View style={styles.dots}>
                    {images.map((_, i) => (
                      <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
                    ))}
                  </View>
                </>
              )}
            </Animated.View>

          </Animated.View>
        </GestureDetector>

      </GestureHandlerRootView>
    </Modal>
  );
}
