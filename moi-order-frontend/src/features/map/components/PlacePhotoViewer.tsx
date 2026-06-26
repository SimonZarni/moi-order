import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Modal, Pressable, StatusBar, Text, View, useWindowDimensions, type ViewToken } from 'react-native';
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

  const translateY      = useSharedValue(0);
  const backdropOpacity = useSharedValue(1);

  useEffect(() => {
    StatusBar.setHidden(true, 'fade');
    return () => StatusBar.setHidden(false, 'fade');
  }, []);

  useEffect(() => {
    if (images.length > 1) {
      listRef.current?.scrollToOffset({ offset: initialIndex * width, animated: false });
    }
  }, [initialIndex, width, images.length]);

  // Stable ref so gesture worklet can call it via runOnJS without stale closure.
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  const callClose = useCallback(() => closeRef.current(), []);

  // Pan gesture that activates only on clear vertical swipe so horizontal
  // FlatList scrolling is never stolen. failOffsetX kicks in when the user
  // moves horizontally before vertically — RNGH then lets FlatList handle it.
  const panGesture = Gesture.Pan()
    .activeOffsetY([-8, 8])
    .failOffsetX([-15, 15])
    .onUpdate((e) => {
      translateY.value = e.translationY;
      backdropOpacity.value = Math.max(0, 1 - Math.abs(e.translationY) / (height * 0.5));
    })
    .onEnd((e) => {
      const shouldDismiss =
        Math.abs(e.translationY) > DISMISS_THRESHOLD_PX ||
        Math.abs(e.velocityY) > DISMISS_VELOCITY_PPS;

      if (shouldDismiss) {
        const toY = e.translationY > 0 ? height : -height;
        translateY.value = withTiming(toY, { duration: 230 });
        backdropOpacity.value = withTiming(0, { duration: 230 }, () => runOnJS(callClose)());
      } else {
        translateY.value = withSpring(0, { damping: 22, stiffness: 220 });
        backdropOpacity.value = withTiming(1, { duration: 160 });
      }
    });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

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
      {/* GestureHandlerRootView is required inside Modal for RNGH gestures to work */}
      <GestureHandlerRootView style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.container, containerStyle]}>
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
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}
