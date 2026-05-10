import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './CategorySection.styles';
import { colours } from '../../../shared/theme/colours';
import { MenuItemRow } from './MenuItemRow';
import type { MenuCategory, MenuItem } from '../../../types/models';
import type { MenuItemStatus } from '../../../types/enums';

interface CategorySectionProps {
  category: MenuCategory;
  onDeleteCategory: (id: number) => void;
  onRenameCategory: (id: number, newName: string) => void;
  onToggleItemStatus: (itemId: number, status: MenuItemStatus) => void;
  onDeleteItem: (id: number) => void;
  onAddItem: (categoryId: number) => void;
  onEditItem: (item: MenuItem) => void;
}

export function CategorySection({
  category,
  onDeleteCategory,
  onRenameCategory,
  onToggleItemStatus,
  onDeleteItem,
  onAddItem,
  onEditItem,
}: CategorySectionProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameInput, setRenameInput] = useState('');

  const handleToggleExpand = useCallback(() => setIsExpanded((prev) => !prev), []);

  const handleStartRename = useCallback(() => {
    setRenameInput(category.name);
    setIsRenaming(true);
  }, [category.name]);

  const handleCancelRename = useCallback(() => setIsRenaming(false), []);

  const handleConfirmRename = useCallback(() => {
    const trimmed = renameInput.trim();
    if (trimmed && trimmed !== category.name) {
      onRenameCategory(category.id, trimmed);
    }
    setIsRenaming(false);
  }, [renameInput, category.id, category.name, onRenameCategory]);

  const handleDeleteCategory = useCallback(() => onDeleteCategory(category.id), [category.id, onDeleteCategory]);
  const handleAddItem = useCallback(() => onAddItem(category.id), [category.id, onAddItem]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isRenaming && !category.is_system ? (
          <View style={styles.renameRow}>
            <TextInput
              style={styles.renameInput}
              value={renameInput}
              onChangeText={setRenameInput}
              autoFocus
              accessibilityLabel="Category name"
              returnKeyType="done"
              onSubmitEditing={handleConfirmRename}
            />
            <Pressable style={styles.renameAction} onPress={handleConfirmRename}
              accessibilityLabel="Save category name" accessibilityRole="button">
              <Ionicons name="checkmark" size={18} color={colours.success} />
            </Pressable>
            <Pressable style={styles.renameAction} onPress={handleCancelRename}
              accessibilityLabel="Cancel rename" accessibilityRole="button">
              <Ionicons name="close" size={18} color={colours.medium} />
            </Pressable>
          </View>
        ) : (
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
        )}

        {!isRenaming && (
          <View style={styles.headerActions}>
            {category.is_system ? (
              <Ionicons name="lock-closed-outline" size={16} color={colours.textMuted} />
            ) : (
              <>
                <Pressable
                  onPress={handleStartRename}
                  style={styles.actionButton}
                  accessibilityLabel={`Rename category ${category.name}`}
                  accessibilityRole="button"
                >
                  <Ionicons name="pencil-outline" size={16} color={colours.primary} />
                </Pressable>
                <Pressable
                  onPress={handleDeleteCategory}
                  style={styles.actionButton}
                  accessibilityLabel={`Delete category ${category.name}`}
                  accessibilityRole="button"
                >
                  <Ionicons name="trash-outline" size={16} color={colours.error} />
                </Pressable>
              </>
            )}
          </View>
        )}
      </View>

      {isExpanded && (
        <View style={styles.items}>
          {category.items.map((item) => (
            <MenuItemRow
              key={item.id}
              item={item}
              onToggleStatus={onToggleItemStatus}
              onDelete={onDeleteItem}
              onEdit={onEditItem}
            />
          ))}
          {category.items.length === 0 && (
            <Text style={styles.empty}>
              {category.is_system
                ? `Add items here to fill the "${category.name}" section shown to customers.`
                : 'No items in this category'}
            </Text>
          )}
          <Pressable
            style={styles.addItemButton}
            onPress={handleAddItem}
            accessibilityLabel={`Add item to ${category.name}`}
            accessibilityRole="button"
          >
            <Ionicons name="add" size={16} color={colours.primary} />
            <Text style={styles.addItemText}>Add Item</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
