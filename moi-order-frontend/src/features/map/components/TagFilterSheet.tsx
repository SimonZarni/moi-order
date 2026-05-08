import React, { useCallback, useState, useEffect } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { styles } from './TagFilterSheet.styles';
import type { Tag } from '@/types/models';

interface Props {
  visible:    boolean;
  allTags:    Tag[];
  isLoading:  boolean;
  activeTags: number[];
  onApply:    (tagIds: number[]) => void;
  onDismiss:  () => void;
}

// Smooth ease-out curve — no bounce/jump on open.
const OPEN_EASING  = Easing.out(Easing.bezier(0.25, 0.46, 0.45, 0.94));
const CLOSE_EASING = Easing.in(Easing.bezier(0.25, 0.46, 0.45, 0.94));

export function TagFilterSheet({ visible, allTags, isLoading, activeTags, onApply, onDismiss }: Props): React.JSX.Element {
  const [selected, setSelected] = useState<Set<number>>(new Set(activeTags));
  const allSelected = selected.size === allTags.length && allTags.length > 0;

  const [modalVisible, setModalVisible] = useState(visible);

  const backdropOpacity = useSharedValue(0);
  const cardTranslateY  = useSharedValue(500);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      setSelected(new Set(activeTags));
      cardTranslateY.value = 500; // always start fully off-screen
      backdropOpacity.value = withTiming(1, { duration: 200 });
      cardTranslateY.value  = withTiming(0, { duration: 320, easing: OPEN_EASING });
    } else {
      // If already dismissed by drag gesture, card is > 200 off-screen.
      // Skip the re-animation to avoid the glitch of sliding back up then hiding.
      if (cardTranslateY.value > 200) {
        backdropOpacity.value = 0;
        setModalVisible(false);
        return;
      }
      cancelAnimation(cardTranslateY);
      backdropOpacity.value = withTiming(0, { duration: 200 });
      cardTranslateY.value  = withTiming(500, { duration: 260, easing: CLOSE_EASING }, () => {
        runOnJS(setModalVisible)(false);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const cardStyle     = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
  }));

  // Drag handle — runs on native thread for smooth 60fps.
  // Dragging down follows finger; release decides dismiss or snap back.
  const dragGesture = Gesture.Pan()
    .onUpdate((e) => {
      'worklet';
      if (e.translationY > 0) cardTranslateY.value = e.translationY;
    })
    .onEnd((e) => {
      'worklet';
      if (e.translationY > 100 || e.velocityY > 600) {
        // Dismiss: slide fully off-screen then call onDismiss.
        // onDismiss → visible=false → useEffect skips re-animation (card already > 200).
        backdropOpacity.value = withTiming(0, { duration: 200 });
        cardTranslateY.value  = withTiming(500, { duration: 260, easing: CLOSE_EASING }, () => {
          runOnJS(onDismiss)();
        });
      } else {
        // Snap back — spring feel on the return is intentional.
        cardTranslateY.value = withSpring(0, { damping: 24, stiffness: 240 });
      }
    });

  const toggleTag = useCallback((id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleAll   = useCallback(() => {
    setSelected(allSelected ? new Set() : new Set(allTags.map(t => t.id)));
  }, [allSelected, allTags]);

  const handleApply = useCallback(() => { onApply([...selected]); }, [selected, onApply]);
  const handleClear = useCallback(() => { setSelected(new Set()); }, []);

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, backdropStyle]} pointerEvents="box-none">
        <Pressable style={styles.backdropTap} onPress={onDismiss} accessibilityRole="button" accessibilityLabel="Close filter" />
      </Animated.View>

      <Animated.View style={[styles.cardContainer, cardStyle]}>
        <Pressable style={styles.sheet} onPress={() => {}} accessibilityRole="none">
          <GestureDetector gesture={dragGesture}>
            <View style={styles.handleArea}>
              <View style={styles.handle} />
            </View>
          </GestureDetector>

          <View style={styles.header}>
            <Text style={styles.title}>Filter by Tags</Text>
            {selected.size > 0 && (
              <Pressable onPress={handleClear} style={styles.clearBtn}
                accessibilityRole="button" accessibilityLabel="Clear all filters">
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
            )}
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {isLoading ? (
              <View style={styles.empty}><ActivityIndicator size="small" /></View>
            ) : allTags.length === 0 ? (
              <View style={styles.empty}><Text style={styles.emptyText}>No tags available</Text></View>
            ) : (
              allTags.map(tag => {
                const isActive = selected.has(tag.id);
                return (
                  <Pressable
                    key={tag.id}
                    onPress={() => toggleTag(tag.id)}
                    style={[styles.chip, isActive && styles.chipActive]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isActive }}
                    accessibilityLabel={tag.name_en}
                  >
                    {isActive && <Text style={styles.checkmark}>✓</Text>}
                    <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                      {tag.name_en}
                    </Text>
                  </Pressable>
                );
              })
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable onPress={toggleAll} style={styles.selectAllBtn}
              accessibilityRole="button" accessibilityLabel={allSelected ? 'Deselect all tags' : 'Select all tags'}>
              <Text style={styles.selectAllText}>{allSelected ? 'Deselect All' : 'Select All'}</Text>
            </Pressable>
            <Pressable onPress={handleApply} style={styles.applyBtn}
              accessibilityRole="button" accessibilityLabel="Apply filters">
              <Text style={styles.applyText}>Apply{selected.size > 0 ? ` (${selected.size})` : ''}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}
