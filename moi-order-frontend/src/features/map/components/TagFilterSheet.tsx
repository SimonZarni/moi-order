import React, { useCallback, useState, useEffect } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
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

export function TagFilterSheet({ visible, allTags, isLoading, activeTags, onApply, onDismiss }: Props): React.JSX.Element {
  const [selected, setSelected] = useState<Set<number>>(new Set(activeTags));
  const allSelected = selected.size === allTags.length && allTags.length > 0;

  // Keep Modal mounted during close animation.
  const [modalVisible, setModalVisible] = useState(visible);

  const backdropOpacity = useSharedValue(0);
  const cardTranslateY  = useSharedValue(400);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      setSelected(new Set(activeTags));
      backdropOpacity.value = withTiming(1, { duration: 80 });
      cardTranslateY.value  = withSpring(0, { damping: 22, stiffness: 220 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 160 });
      cardTranslateY.value  = withTiming(400, { duration: 200 }, () => {
        runOnJS(setModalVisible)(false);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const cardStyle     = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
  }));

  // Native-thread pan gesture — drag down to dismiss, snap back otherwise.
  const dragGesture = Gesture.Pan()
    .onUpdate((e) => {
      'worklet';
      if (e.translationY > 0) cardTranslateY.value = e.translationY;
    })
    .onEnd((e) => {
      'worklet';
      if (e.translationY > 80 || e.velocityY > 500) {
        backdropOpacity.value = withTiming(0, { duration: 160 });
        cardTranslateY.value  = withTiming(500, { duration: 200 }, () => {
          runOnJS(onDismiss)();
        });
      } else {
        cardTranslateY.value = withSpring(0, { damping: 22, stiffness: 220 });
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
          {/* Drag handle — GestureDetector runs on native thread for smooth 60fps */}
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
