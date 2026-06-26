import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated, FlatList, Modal, PanResponder,
  Pressable, StatusBar, Text, View,
  useWindowDimensions,
  type ViewToken,
} from 'react-native';
import { Image } from 'expo-image';
import { styles } from './PlacePhotoViewer.styles';

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  images:       string[];
  initialIndex: number;
  onClose:      () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DISMISS_THRESHOLD_PX = 100;
const DISMISS_VELOCITY      = 1.5;

// ─── Component ───────────────────────────────────────────────────────────────

export function PlacePhotoViewer({ images, initialIndex, onClose }: Props): React.JSX.Element {
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const listRef       = useRef<FlatList>(null);
  const translateY    = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setHidden(true, 'fade');
    return () => StatusBar.setHidden(false, 'fade');
  }, []);

  useEffect(() => {
    if (images.length > 1) {
      listRef.current?.scrollToOffset({ offset: initialIndex * width, animated: false });
    }
  }, [initialIndex, width, images.length]);

  const animateClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: height, duration: 240, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 240, useNativeDriver: true }),
    ]).start(onClose);
  }, [translateY, backdropOpacity, height, onClose]);

  const panResponder = useRef(
    PanResponder.create({
      // Let touches start without claiming — only claim on clear vertical swipe.
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dy) > 8 && Math.abs(gs.dy) > Math.abs(gs.dx),

      onPanResponderMove: (_, gs) => {
        translateY.setValue(gs.dy);
        const opacity = Math.max(0, 1 - Math.abs(gs.dy) / (height * 0.55));
        backdropOpacity.setValue(opacity);
      },

      onPanResponderRelease: (_, gs) => {
        if (Math.abs(gs.dy) > DISMISS_THRESHOLD_PX || Math.abs(gs.vy) > DISMISS_VELOCITY) {
          animateClose();
        } else {
          Animated.parallel([
            Animated.spring(translateY,      { toValue: 0, useNativeDriver: true }),
            Animated.timing(backdropOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
          ]).start();
        }
      },
    }),
  ).current;

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
      onRequestClose={animateClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />

      <Animated.View
        style={[styles.container, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
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
          onPress={animateClose}
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
    </Modal>
  );
}
