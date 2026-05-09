import React from 'react';
import {
  View, Text, FlatList, Pressable, ActivityIndicator, Modal,
  TextInput, ScrollView, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useMenuScreen } from '../hooks/useMenuScreen';
import { CategorySection } from '../components/CategorySection';
import { styles } from './MenuScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import type { MenuCategory } from '../../../types/models';

export function MenuScreen(): React.JSX.Element {
  const {
    categories, isLoading, showAddCategoryModal,
    addItemCategoryId, addItemForm, isAddingItem,
    handleAddCategory, handleDeleteCategory,
    handleToggleItemStatus, handleDeleteItem,
    setShowAddCategoryModal,
    handleOpenAddItem, handleCloseAddItem,
    handleAddItemFieldChange, handleAddItemPhotoChange,
    handleAddOptionGroup, handleRemoveOptionGroup,
    handleOptionGroupChange, handleAddOption, handleRemoveOption, handleOptionChange,
    handleAddItemSubmit,
  } = useMenuScreen();

  const [newCategoryName, setNewCategoryName] = useState('');

  const handleConfirmAddCategory = useCallback(async () => {
    if (!newCategoryName.trim()) return;
    await handleAddCategory(newCategoryName.trim());
    setNewCategoryName('');
  }, [newCategoryName, handleAddCategory]);

  const handlePickPhoto = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
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

  const discountAmount = addItemForm.original_price.trim() && addItemForm.price.trim()
    ? Math.max(0, parseFloat(addItemForm.original_price) - parseFloat(addItemForm.price))
    : 0;

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
          <ScrollView
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalCard}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.modalTitle}>New Menu Item</Text>

            {/* Basic fields */}
            <TextInput style={styles.modalInput} placeholder="Item name *"
              placeholderTextColor={colours.medium} value={addItemForm.name}
              onChangeText={(v) => handleAddItemFieldChange('name', v)} accessibilityLabel="Item name" />

            <TextInput style={[styles.modalInput, { minHeight: 60, textAlignVertical: 'top' }]}
              placeholder="Description (optional)" placeholderTextColor={colours.medium}
              value={addItemForm.description}
              onChangeText={(v) => handleAddItemFieldChange('description', v)}
              multiline accessibilityLabel="Item description" />

            {/* Pricing row */}
            <View style={styles.priceRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.priceLabel}>Price *</Text>
                <TextInput style={styles.modalInput} placeholder="100.00"
                  placeholderTextColor={colours.medium} value={addItemForm.price}
                  onChangeText={(v) => handleAddItemFieldChange('price', v)}
                  keyboardType="decimal-pad" accessibilityLabel="Item price" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.priceLabel}>Original Price (before discount)</Text>
                <TextInput style={styles.modalInput} placeholder="Optional"
                  placeholderTextColor={colours.medium} value={addItemForm.original_price}
                  onChangeText={(v) => handleAddItemFieldChange('original_price', v)}
                  keyboardType="decimal-pad" accessibilityLabel="Original price before discount" />
              </View>
            </View>
            {discountAmount > 0 && (
              <Text style={styles.discountBadge}>
                ✓ Discount: {formatPrice(Math.round(discountAmount * 100))} off
              </Text>
            )}

            {/* Photo */}
            <Pressable
              style={[styles.cancelButton, { borderColor: colours.primary, marginBottom: 8 }]}
              onPress={handlePickPhoto} accessibilityRole="button" accessibilityLabel="Pick photo">
              <Ionicons name="image-outline" size={16} color={colours.primary} />
              <Text style={[styles.cancelText, { color: colours.primary, marginLeft: 6 }]}>
                {addItemForm.photo !== null ? 'Change Photo' : 'Add Photo (optional)'}
              </Text>
            </Pressable>

            {/* Option Groups */}
            <View style={styles.sectionDivider} />
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Options / Modifiers</Text>
              <Pressable style={styles.addSmallBtn} onPress={handleAddOptionGroup}
                accessibilityRole="button" accessibilityLabel="Add option group">
                <Ionicons name="add-circle-outline" size={16} color={colours.primary} />
                <Text style={styles.addSmallBtnText}>Add Group</Text>
              </Pressable>
            </View>
            <Text style={styles.sectionHint}>
              e.g. Group: "Protein" → Options: Pork (+15 ฿), Beef (+20 ฿)
            </Text>

            {addItemForm.option_groups.map((group, gi) => (
              <View key={gi} style={styles.optionGroupCard}>
                <View style={styles.optionGroupHeader}>
                  <TextInput
                    style={[styles.modalInput, { flex: 1, marginBottom: 0 }]}
                    placeholder="Group name (e.g. Protein)"
                    placeholderTextColor={colours.medium}
                    value={group.name}
                    onChangeText={(v) => handleOptionGroupChange(gi, 'name', v)}
                    accessibilityLabel={`Option group ${gi + 1} name`}
                  />
                  <Pressable onPress={() => handleRemoveOptionGroup(gi)}
                    style={{ padding: 8 }} accessibilityRole="button" accessibilityLabel="Remove group">
                    <Ionicons name="trash-outline" size={16} color={colours.error} />
                  </Pressable>
                </View>

                <View style={styles.optionGroupMeta}>
                  <View style={styles.toggleRowSmall}>
                    <Text style={styles.toggleLabelSmall}>Required</Text>
                    <Switch
                      value={group.is_required}
                      onValueChange={(v) => handleOptionGroupChange(gi, 'is_required', v)}
                      trackColor={{ false: colours.divider, true: colours.primary + '66' }}
                      thumbColor={group.is_required ? colours.primary : colours.medium}
                      accessibilityLabel={`Group ${gi + 1} required`}
                    />
                  </View>
                  <View style={styles.toggleRowSmall}>
                    <Text style={styles.toggleLabelSmall}>Max choose</Text>
                    <TextInput
                      style={styles.smallNumInput}
                      value={String(group.max_selections)}
                      onChangeText={(v) => handleOptionGroupChange(gi, 'max_selections', parseInt(v, 10) || 1)}
                      keyboardType="number-pad"
                      accessibilityLabel={`Max selections for group ${gi + 1}`}
                    />
                  </View>
                </View>

                {group.options.map((opt, oi) => (
                  <View key={oi} style={styles.optionRow}>
                    <TextInput
                      style={[styles.modalInput, { flex: 2, marginBottom: 0 }]}
                      placeholder="Option name"
                      placeholderTextColor={colours.medium}
                      value={opt.name}
                      onChangeText={(v) => handleOptionChange(gi, oi, 'name', v)}
                      accessibilityLabel={`Option ${oi + 1} name`}
                    />
                    <TextInput
                      style={[styles.modalInput, { flex: 1, marginBottom: 0, marginLeft: 6 }]}
                      placeholder="+0"
                      placeholderTextColor={colours.medium}
                      value={opt.additional_price_cents === 0 ? '' : String(opt.additional_price_cents / 100)}
                      onChangeText={(v) => handleOptionChange(gi, oi, 'additional_price_cents', Math.round(parseFloat(v || '0') * 100))}
                      keyboardType="decimal-pad"
                      accessibilityLabel={`Option ${oi + 1} additional price`}
                    />
                    <Pressable onPress={() => handleRemoveOption(gi, oi)}
                      style={{ padding: 8 }} accessibilityRole="button" accessibilityLabel="Remove option">
                      <Ionicons name="close-circle-outline" size={16} color={colours.error} />
                    </Pressable>
                  </View>
                ))}

                <Pressable style={styles.addOptionBtn} onPress={() => handleAddOption(gi)}
                  accessibilityRole="button" accessibilityLabel="Add option">
                  <Ionicons name="add-outline" size={14} color={colours.primary} />
                  <Text style={styles.addOptionBtnText}>Add Option</Text>
                </Pressable>
              </View>
            ))}

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
