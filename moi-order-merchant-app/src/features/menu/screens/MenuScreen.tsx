import React from 'react';
import {
  View, Text, FlatList, Pressable, ActivityIndicator, Modal,
  TextInput, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useMenuScreen } from '../hooks/useMenuScreen';
import { CategorySection } from '../components/CategorySection';
import { styles } from './MenuScreen.styles';
import { colours } from '../../../shared/theme/colours';
import type { MenuCategory } from '../../../types/models';

export function MenuScreen(): React.JSX.Element {
  const {
    categories, isLoading, showAddCategoryModal,
    addItemCategoryId, addItemForm, isAddingItem,
    handleAddCategory, handleDeleteCategory,
    handleToggleItemStatus, handleDeleteItem,
    setShowAddCategoryModal,
    handleOpenAddItem, handleCloseAddItem,
    handleAddItemFieldChange, handleAddItemPhotoChange, handleAddItemSubmit,
  } = useMenuScreen();

  const [newCategoryName, setNewCategoryName] = useState('');

  const handleConfirmAddCategory = useCallback(async () => {
    if (!newCategoryName.trim()) return;
    await handleAddCategory(newCategoryName.trim());
    setNewCategoryName('');
  }, [newCategoryName, handleAddCategory]);

  const handlePickPhoto = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    if (!asset) return;
    const ext = asset.uri.split('.').pop() ?? 'jpg';
    handleAddItemPhotoChange({ uri: asset.uri, name: `item.${ext}`, type: `image/${ext}` });
  }, [handleAddItemPhotoChange]);

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
            onAddItem={handleOpenAddItem}
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

      {/* Add category modal */}
      <Modal visible={showAddCategoryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Category</Text>
            <TextInput style={styles.modalInput} placeholder="Category name" placeholderTextColor={colours.medium}
              value={newCategoryName} onChangeText={setNewCategoryName} accessibilityLabel="Category name" />
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setShowAddCategoryModal(false)}
                accessibilityLabel="Cancel" accessibilityRole="button">
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.confirmButton} onPress={handleConfirmAddCategory}
                accessibilityLabel="Add category" accessibilityRole="button">
                <Text style={styles.confirmText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add menu item modal */}
      <Modal visible={addItemCategoryId !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalCard} keyboardShouldPersistTaps="handled">
            <Text style={styles.modalTitle}>New Menu Item</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Item name *"
              placeholderTextColor={colours.medium}
              value={addItemForm.name}
              onChangeText={(v) => handleAddItemFieldChange('name', v)}
              accessibilityLabel="Item name"
            />
            <TextInput
              style={[styles.modalInput, { minHeight: 60, textAlignVertical: 'top' }]}
              placeholder="Description (optional)"
              placeholderTextColor={colours.medium}
              value={addItemForm.description}
              onChangeText={(v) => handleAddItemFieldChange('description', v)}
              multiline
              accessibilityLabel="Item description"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Price (e.g. 120.00) *"
              placeholderTextColor={colours.medium}
              value={addItemForm.price}
              onChangeText={(v) => handleAddItemFieldChange('price', v)}
              keyboardType="decimal-pad"
              accessibilityLabel="Item price"
            />

            <Pressable
              style={[styles.cancelButton, { borderColor: colours.primary, marginBottom: 8 }]}
              onPress={handlePickPhoto}
              accessibilityRole="button"
              accessibilityLabel="Pick photo"
            >
              <Ionicons name="image-outline" size={16} color={colours.primary} />
              <Text style={[styles.cancelText, { color: colours.primary, marginLeft: 6 }]}>
                {addItemForm.photo !== null ? 'Change Photo' : 'Add Photo (optional)'}
              </Text>
            </Pressable>

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={handleCloseAddItem}
                accessibilityLabel="Cancel" accessibilityRole="button">
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmButton, (isAddingItem || !addItemForm.name.trim() || !addItemForm.price.trim()) && { opacity: 0.5 }]}
                onPress={handleAddItemSubmit}
                disabled={isAddingItem || !addItemForm.name.trim() || !addItemForm.price.trim()}
                accessibilityLabel="Add item" accessibilityRole="button"
              >
                {isAddingItem
                  ? <ActivityIndicator size="small" color={colours.white} />
                  : <Text style={styles.confirmText}>Add Item</Text>
                }
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
