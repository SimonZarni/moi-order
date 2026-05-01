import React, { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './CategorySection.styles';
import { colours } from '../../../shared/theme/colours';
import { MenuItemRow } from './MenuItemRow';
import type { MenuCategory } from '../../../types/models';
import type { MenuItemStatus } from '../../../types/enums';

interface CategorySectionProps {
  category: MenuCategory;
  onDeleteCategory: (id: number) => void;
  onToggleItemStatus: (itemId: number, status: MenuItemStatus) => void;
  onDeleteItem: (id: number) => void;
}

export function CategorySection({
  category,
  onDeleteCategory,
  onToggleItemStatus,
  onDeleteItem,
}: CategorySectionProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleDeleteCategory = useCallback(() => {
    onDeleteCategory(category.id);
  }, [category.id, onDeleteCategory]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.titleRow}
          onPress={handleToggleExpand}
          accessibilityLabel={`${isExpanded ? 'Collapse' : 'Expand'} category ${category.name}`}
          accessibilityRole="button"
        >
          <Ionicons
            name={isExpanded ? 'chevron-down' : 'chevron-forward'}
            size={16}
            color={colours.textMuted}
          />
          <Text style={styles.title}>{category.name}</Text>
          <Text style={styles.count}>({category.items.length})</Text>
        </Pressable>
        <Pressable
          onPress={handleDeleteCategory}
          style={styles.deleteButton}
          accessibilityLabel={`Delete category ${category.name}`}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={18} color={colours.error} />
        </Pressable>
      </View>

      {isExpanded && (
        <View style={styles.items}>
          {category.items.map((item) => (
            <MenuItemRow
              key={item.id}
              item={item}
              onToggleStatus={onToggleItemStatus}
              onDelete={onDeleteItem}
            />
          ))}
          {category.items.length === 0 && (
            <Text style={styles.empty}>No items in this category</Text>
          )}
        </View>
      )}
    </View>
  );
}
