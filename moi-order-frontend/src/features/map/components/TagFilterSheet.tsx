import React, { useCallback, useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Modal, PanResponder, Pressable, ScrollView, Text, View } from 'react-native';
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

  // Keep the Modal mounted during the close animation so we can animate out.
  const [modalVisible, setModalVisible] = useState(visible);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY  = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      setSelected(new Set(activeTags));
      // Backdrop fades in instantly (80 ms ease); card springs up.
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.spring(cardTranslateY,  { toValue: 0, damping: 22, stiffness: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(cardTranslateY,  { toValue: 400, duration: 180, useNativeDriver: true }),
      ]).start(() => setModalVisible(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const toggleTag = useCallback((id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected(allSelected ? new Set() : new Set(allTags.map(t => t.id)));
  }, [allSelected, allTags]);

  const handleApply = useCallback(() => { onApply([...selected]); }, [selected, onApply]);
  const handleClear = useCallback(() => { setSelected(new Set()); }, []);

  // Drag handle — drag down to dismiss, drag up does nothing (already at max).
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dy }) => Math.abs(dy) > 6,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) cardTranslateY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > 80 || vy > 0.5) {
          Animated.timing(cardTranslateY, {
            toValue: 500, duration: 200, useNativeDriver: true,
          }).start(onDismiss);
        } else {
          Animated.spring(cardTranslateY, {
            toValue: 0, damping: 22, stiffness: 220, useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      {/* Backdrop fades in independently of the card */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} pointerEvents="box-none">
        <Pressable style={styles.backdropTap} onPress={onDismiss} accessibilityRole="button" accessibilityLabel="Close filter" />
      </Animated.View>

      {/* Card slides up from bottom */}
      <Animated.View style={[styles.cardContainer, { transform: [{ translateY: cardTranslateY }] }]}>
        <Pressable style={styles.sheet} onPress={() => {}} accessibilityRole="none">
          <View style={styles.handleArea} {...panResponder.panHandlers}>
            <View style={styles.handle} />
          </View>

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
