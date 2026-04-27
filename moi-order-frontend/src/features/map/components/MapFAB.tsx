import React, { useCallback, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDecay,
  withDelay,
  withTiming,
  clamp as rClamp,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { CATEGORY_EMOJI } from '@/shared/theme/mapTheme';
import {
  styles,
  RADIUS, STEP_DEG, ITEM_SIZE,
  ARC_AREA, FAB_CX, FAB_CY,
} from './MapFAB.styles';
import type { Category } from '@/types/models';

const DEG2RAD   = Math.PI / 180;
// Visible arc window — items outside fade out.
const FADE_MIN  = 172;
const FADE_MAX  = 278;
// Midpoint of the arc — items here get the largest scale.
const ARC_MID   = 225;
// Stagger delay between each item's entry animation (ms).
const STAGGER   = 48;

// ── Arc item ─────────────────────────────────────────────────────────────────

interface ArcItemProps {
  category:     Category;
  index:        number;
  scrollOffset: SharedValue<number>;
  isActive:     boolean;
  isFABOpen:    boolean;
  onPress:      () => void;
}

function ArcItem({
  category, index, scrollOffset, isActive, isFABOpen, onPress,
}: ArcItemProps): React.JSX.Element {
  const emoji      = CATEGORY_EMOJI[(category.name_en ?? '').toLowerCase()] ?? '🏷';
  const entryScale = useSharedValue(0);

  // Water-bubble entry: each item springs up from the FAB with a staggered delay.
  useEffect(() => {
    if (isFABOpen) {
      entryScale.value = 0;
      entryScale.value = withDelay(
        index * STAGGER,
        withSpring(1, { damping: 22, stiffness: 220 }),
      );
    } else {
      entryScale.value = withTiming(0, { duration: 120 });
    }
  }, [isFABOpen, index, entryScale]);

  const animStyle = useAnimatedStyle(() => {
    'worklet';
    const angle = 270 - index * STEP_DEG + scrollOffset.value;
    const rad   = angle * DEG2RAD;

    // Absolute position of item centre within arcArea.
    const left = FAB_CX + Math.cos(rad) * RADIUS - ITEM_SIZE / 2;
    const top  = FAB_CY + Math.sin(rad) * RADIUS  - ITEM_SIZE / 2;

    // Fade at arc edges.
    const fadeOpacity = interpolate(
      angle,
      [FADE_MIN - 14, FADE_MIN + 8, FADE_MAX - 8, FADE_MAX + 14],
      [0, 1, 1, 0],
      Extrapolation.CLAMP,
    );

    // Middle items slightly larger; edge items slightly smaller.
    const arcScale = interpolate(
      angle,
      [FADE_MIN, ARC_MID - 22, ARC_MID, ARC_MID + 22, FADE_MAX],
      [0.80, 1.00, 1.20, 1.00, 0.80],
      Extrapolation.CLAMP,
    );

    // Entry animation: scale in + rise from FAB (translateY 28 → 0).
    const e       = entryScale.value;
    const entryTY = interpolate(e, [0, 1], [28, 0], Extrapolation.CLAMP);

    return {
      position: 'absolute',
      left,
      top,
      opacity:   fadeOpacity * e,
      transform: [{ scale: arcScale * e }, { translateY: entryTY }],
    };
  });

  return (
    <Animated.View style={animStyle} pointerEvents="box-none">
      <Pressable
        onPress={onPress}
        style={[styles.arcItem, isActive && styles.arcItemActive]}
        accessibilityRole="button"
        accessibilityLabel={`Filter by ${category.name_en}`}
        hitSlop={8}
      >
        <Text style={styles.arcEmoji}>{emoji}</Text>
      </Pressable>
      <View style={styles.arcLabel} pointerEvents="none">
        <Text
          style={[styles.arcLabelText, isActive && styles.arcLabelTextActive]}
          numberOfLines={1}
        >
          {category.name_en}
        </Text>
      </View>
    </Animated.View>
  );
}

// ── Main FAB ─────────────────────────────────────────────────────────────────

interface Props {
  categories:       Category[];
  activeCategory:   number | null;
  isFABOpen:        boolean;
  onToggleFAB:      () => void;
  onSelectCategory: (id: number | null) => void;
}

export function MapFAB({
  categories, activeCategory, isFABOpen, onToggleFAB, onSelectCategory,
}: Props): React.JSX.Element {
  const scrollOffset = useSharedValue(0);
  const savedOffset  = useSharedValue(0);
  const fabRotate    = useSharedValue(0);

  const N         = categories.length;
  const maxOffset = Math.max(0, (N - 4) * STEP_DEG);

  // Rotate FAB icon: + (0°) → × (45°) when open.
  useEffect(() => {
    fabRotate.value = withSpring(isFABOpen ? 1 : 0, { damping: 12, stiffness: 200 });
    if (!isFABOpen) {
      scrollOffset.value = withSpring(0, { damping: 16, stiffness: 220 });
    }
  }, [isFABOpen, fabRotate, scrollOffset]);

  const fabIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(fabRotate.value, [0, 1], [0, 45])}deg` }],
  }));

  // Pan gesture on the full-screen overlay scrolls the arc categories.
  const panGesture = Gesture.Pan()
    .minDistance(8)
    .onStart(() => {
      'worklet';
      savedOffset.value = scrollOffset.value;
    })
    .onUpdate((e) => {
      'worklet';
      const delta = (-e.translationY / RADIUS) * (180 / Math.PI);
      scrollOffset.value = rClamp(savedOffset.value + delta, 0, maxOffset);
    })
    .onEnd((e) => {
      'worklet';
      const vel = (-e.velocityY / RADIUS) * (180 / Math.PI);
      scrollOffset.value = withDecay({ velocity: vel, clamp: [0, maxOffset] });
    });

  const handleSelect = useCallback((id: number) => {
    onSelectCategory(activeCategory === id ? null : id);
  }, [activeCategory, onSelectCategory]);

  return (
    // GestureDetector wraps root so the pan gesture captures drags anywhere on
    // the open overlay — including spaces between and around arc items.
    <GestureDetector gesture={panGesture}>
      <View
        style={styles.root}
        // When open: intercept all touches so pan works everywhere.
        // When closed: pass touches through so the map remains interactive.
        pointerEvents={isFABOpen ? 'auto' : 'box-none'}
      >
        {/* Full-screen dim overlay — tap fires onToggleFAB to close; pan is
            handled by the parent GestureDetector before onPress can fire. */}
        {isFABOpen && (
          <Pressable
            style={styles.overlay}
            onPress={onToggleFAB}
            accessibilityRole="button"
            accessibilityLabel="Close category filter"
          />
        )}

        {/* Arc item layer — renders above overlay */}
        <View style={styles.arcArea} pointerEvents="box-none">
          {categories.map((cat, i) => (
            <ArcItem
              key={cat.id}
              category={cat}
              index={i}
              scrollOffset={scrollOffset}
              isActive={activeCategory === cat.id}
              isFABOpen={isFABOpen}
              onPress={() => handleSelect(cat.id)}
            />
          ))}
        </View>

        {/* FAB button — always on top */}
        <Pressable
          onPress={onToggleFAB}
          style={[styles.fab, isFABOpen && styles.fabOpen]}
          accessibilityRole="button"
          accessibilityLabel={isFABOpen ? 'Close category filter' : 'Browse by category'}
        >
          <Animated.Text style={[styles.fabIcon, fabIconStyle]}>+</Animated.Text>
        </Pressable>
      </View>
    </GestureDetector>
  );
}
