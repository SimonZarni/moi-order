import React, { useCallback, useState, useEffect } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from './TagFilterSheet.styles';
import type { Tag } from '@/types/models';

interface Props {
  visible:   boolean;
  allTags:   Tag[];
  activeTags: number[];
  onApply:   (tagIds: number[]) => void;
  onDismiss: () => void;
}

export function TagFilterSheet({ visible, allTags, activeTags, onApply, onDismiss }: Props): React.JSX.Element {
  const [selected, setSelected] = useState<Set<number>>(new Set(activeTags));
  const allSelected = selected.size === allTags.length && allTags.length > 0;

  // Sync local state when sheet opens
  useEffect(() => {
    if (visible) setSelected(new Set(activeTags));
  }, [visible, activeTags]);

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

  const handleApply = useCallback(() => {
    onApply([...selected]);
  }, [selected, onApply]);

  const handleClear = useCallback(() => {
    setSelected(new Set());
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onDismiss} accessibilityRole="button" accessibilityLabel="Close filter">
        {/* Inner Pressable prevents tap-through to the backdrop */}
        <Pressable style={styles.sheet} onPress={() => {}} accessibilityRole="none">
          <View style={styles.handle} />

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
            {allTags.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No tags available</Text>
              </View>
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
            <Pressable
              onPress={toggleAll}
              style={styles.selectAllBtn}
              accessibilityRole="button"
              accessibilityLabel={allSelected ? 'Deselect all tags' : 'Select all tags'}
            >
              <Text style={styles.selectAllText}>
                {allSelected ? 'Deselect All' : 'Select All'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleApply}
              style={styles.applyBtn}
              accessibilityRole="button"
              accessibilityLabel="Apply filters"
            >
              <Text style={styles.applyText}>
                Apply{selected.size > 0 ? ` (${selected.size})` : ''}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
