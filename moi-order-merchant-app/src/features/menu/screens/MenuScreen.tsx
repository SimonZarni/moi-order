import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useMenuScreen } from '../hooks/useMenuScreen';
import { CategorySection } from '../components/CategorySection';
import { styles } from './MenuScreen.styles';
import { colours } from '../../../shared/theme/colours';
import type { MenuCategory } from '../../../types/models';

export function MenuScreen(): React.JSX.Element {
  const {
    categories, isLoading, showAddCategoryModal,
    handleAddCategory, handleDeleteCategory,
    handleToggleItemStatus, handleDeleteItem,
    setShowAddCategoryModal,
  } = useMenuScreen();

  const [newCategoryName, setNewCategoryName] = useState('');

  const handleConfirmAddCategory = useCallback(async () => {
    if (!newCategoryName.trim()) return;
    await handleAddCategory(newCategoryName.trim());
    setNewCategoryName('');
  }, [newCategoryName, handleAddCategory]);

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colours.primary} /></View>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList<MenuCategory>
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CategorySection
            category={item}
            onDeleteCategory={handleDeleteCategory}
            onToggleItemStatus={handleToggleItemStatus}
            onDeleteItem={handleDeleteItem}
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Pressable style={styles.addButton} onPress={() => setShowAddCategoryModal(true)}
            accessibilityLabel="Add a new menu category" accessibilityRole="button">
            <Text style={styles.addButtonText}>+ Add Category</Text>
          </Pressable>
        }
        ListEmptyComponent={<Text style={styles.empty}>No categories yet. Add one to get started.</Text>}
      />

      <Modal visible={showAddCategoryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Category</Text>
            <TextInput style={styles.modalInput} placeholder="Category name" placeholderTextColor={colours.medium}
              value={newCategoryName} onChangeText={setNewCategoryName} accessibilityLabel="Category name" />
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setShowAddCategoryModal(false)}
                accessibilityLabel="Cancel adding category" accessibilityRole="button">
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.confirmButton} onPress={handleConfirmAddCategory}
                accessibilityLabel="Confirm adding category" accessibilityRole="button">
                <Text style={styles.confirmText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
