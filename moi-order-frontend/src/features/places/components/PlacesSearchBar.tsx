import React, { useState, useCallback } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { Category } from '@/types/models';
import { styles } from './PlacesSearchBar.styles';

interface PlacesSearchBarProps {
  query: string;
  onQueryChange: (text: string) => void;
  categories: Category[];
  selectedCategory: number | null;
  onCategorySelect: (id: number | null) => void;
}

export function PlacesSearchBar({
  query,
  onQueryChange,
  categories,
  selectedCategory,
  onCategorySelect,
}: PlacesSearchBarProps): React.JSX.Element {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedLabel =
    categories.find((c) => c.id === selectedCategory)?.name_en ?? 'All';
  const isFiltered = selectedCategory !== null;

  const handleOpen = useCallback(() => setIsDropdownOpen(true), []);
  const handleClose = useCallback(() => setIsDropdownOpen(false), []);

  const handleSelect = useCallback(
    (id: number | null) => {
      onCategorySelect(id);
      setIsDropdownOpen(false);
    },
    [onCategorySelect],
  );

  return (
    <View style={styles.container}>
      {/* Search input + filter pill row */}
      <View style={styles.row}>
        <View style={styles.inputWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={onQueryChange}
            placeholder="Search places…"
            placeholderTextColor={styles.placeholder.color}
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel="Search places"
            accessibilityRole="search"
          />
          {query.length > 0 && (
            <Pressable
              style={styles.clearBtn}
              onPress={() => onQueryChange('')}
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <Text style={styles.clearIcon}>✕</Text>
            </Pressable>
          )}
        </View>

        <Pressable
          style={[styles.filterPill, isFiltered && styles.filterPillActive]}
          onPress={handleOpen}
          accessibilityLabel={`Filter by category: ${selectedLabel}`}
          accessibilityRole="button"
        >
          <Text
            style={[styles.filterLabel, isFiltered && styles.filterLabelActive]}
            numberOfLines={1}
          >
            {selectedLabel}
          </Text>
          <Text style={[styles.filterChevron, isFiltered && styles.filterChevronActive]}>
            ▾
          </Text>
        </Pressable>
      </View>

      {/* Category dropdown */}
      <Modal
        visible={isDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <View style={styles.modalRoot}>
          {/* Backdrop tap dismisses */}
          <Pressable style={styles.modalBackdrop} onPress={handleClose} />

          {/* Panel */}
          <View style={styles.dropdownPanel}>
            <View style={styles.dropdownHandle} />
            <Text style={styles.dropdownTitle}>Category</Text>

            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {/* All option */}
              <Pressable
                style={[
                  styles.dropdownItem,
                  selectedCategory === null && styles.dropdownItemActive,
                ]}
                onPress={() => handleSelect(null)}
                accessibilityLabel="All categories"
                accessibilityRole="menuitem"
                accessibilityState={{ selected: selectedCategory === null }}
              >
                <Text
                  style={[
                    styles.dropdownItemLabel,
                    selectedCategory === null && styles.dropdownItemLabelActive,
                  ]}
                >
                  All
                </Text>
                {selectedCategory === null && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>

              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    style={[styles.dropdownItem, isActive && styles.dropdownItemActive]}
                    onPress={() => handleSelect(cat.id)}
                    accessibilityLabel={cat.name_en}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemLabel,
                        isActive && styles.dropdownItemLabelActive,
                      ]}
                    >
                      {cat.name_en}
                    </Text>
                    {isActive && <Text style={styles.checkmark}>✓</Text>}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
