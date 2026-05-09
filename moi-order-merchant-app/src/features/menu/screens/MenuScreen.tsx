import React from 'react';
import {
  View, Text, FlatList, Pressable, ActivityIndicator, Modal,
  TextInput, ScrollView, Switch, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useMenuScreen } from '../hooks/useMenuScreen';
import { CategorySection } from '../components/CategorySection';
import { styles } from './MenuScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import type { MenuCategory, MenuItem } from '../../../types/models';
import type { AddItemForm } from '../hooks/useMenuScreen';

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
    editItemId, editItemForm, editItemExistingPhotoUrl, isEditingItem,
    handleOpenEditItem, handleCloseEditItem,
    handleEditItemFieldChange, handleEditItemPhotoChange,
    handleEditAddOptionGroup, handleEditRemoveOptionGroup,
    handleEditOptionGroupChange, handleEditAddOption, handleEditRemoveOption, handleEditOptionChange,
    handleEditItemSubmit,
    handleRenameCategory,
  } = useMenuScreen();

  const [newCategoryName, setNewCategoryName] = useState('');

  const handleConfirmAddCategory = useCallback(async () => {
    if (!newCategoryName.trim()) return;
    await handleAddCategory(newCategoryName.trim());
    setNewCategoryName('');
  }, [newCategoryName, handleAddCategory]);

  const handlePickPhoto = useCallback(async (onPick: (photo: AddItemForm['photo']) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.8 });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    if (!asset) return;

    let mimeType = asset.mimeType ?? 'image/jpeg';
    let uri = asset.uri;
    let fileName = asset.fileName ?? `item.${mimeType.split('/')[1] ?? 'jpg'}`;

    // Chrome/Firefox cannot render or upload HEIC — convert to JPEG on web
    if (Platform.OS === 'web' && (mimeType === 'image/heic' || mimeType === 'image/heif')) {
      try {
        const heic2any = (await import('heic2any')).default;
        const srcBlob = await fetch(uri).then((r) => r.blob());
        const result2 = await heic2any({ blob: srcBlob, toType: 'image/jpeg', quality: 0.85 });
        const jpegBlob = Array.isArray(result2) ? result2[0] : result2;
        uri = URL.createObjectURL(jpegBlob);
        mimeType = 'image/jpeg';
        fileName = fileName.replace(/\.(heic|heif)$/i, '.jpg');
      } catch {
        // Safari can render HEIC natively — safe to proceed as-is if conversion fails
      }
    }

    onPick({ uri, name: fileName, type: mimeType });
  }, []);

  const handlePickAddPhoto = useCallback(() => handlePickPhoto(handleAddItemPhotoChange), [handlePickPhoto, handleAddItemPhotoChange]);
  const handlePickEditPhoto = useCallback(() => handlePickPhoto(handleEditItemPhotoChange), [handlePickPhoto, handleEditItemPhotoChange]);

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
            onRenameCategory={handleRenameCategory}
            onToggleItemStatus={handleToggleItemStatus}
            onDeleteItem={handleDeleteItem}
            onAddItem={handleOpenAddItem}
            onEditItem={handleOpenEditItem}
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
          <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.modalCard} keyboardShouldPersistTaps="handled">
            <ItemFormContent
              title="New Menu Item"
              form={addItemForm}
              isSaving={isAddingItem}
              onFieldChange={handleAddItemFieldChange}
              onPickPhoto={handlePickAddPhoto}
              onAddOptionGroup={handleAddOptionGroup}
              onRemoveOptionGroup={handleRemoveOptionGroup}
              onOptionGroupChange={handleOptionGroupChange}
              onAddOption={handleAddOption}
              onRemoveOption={handleRemoveOption}
              onOptionChange={handleOptionChange}
              onCancel={handleCloseAddItem}
              onSubmit={handleAddItemSubmit}
              submitLabel="Add Item"
            />
          </ScrollView>
        </View>
      </Modal>

      {/* Edit menu item modal */}
      <Modal visible={editItemId !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.modalCard} keyboardShouldPersistTaps="handled">
            <ItemFormContent
              title="Edit Menu Item"
              form={editItemForm}
              existingPhotoUrl={editItemExistingPhotoUrl}
              isSaving={isEditingItem}
              onFieldChange={handleEditItemFieldChange}
              onPickPhoto={handlePickEditPhoto}
              onAddOptionGroup={handleEditAddOptionGroup}
              onRemoveOptionGroup={handleEditRemoveOptionGroup}
              onOptionGroupChange={handleEditOptionGroupChange}
              onAddOption={handleEditAddOption}
              onRemoveOption={handleEditRemoveOption}
              onOptionChange={handleEditOptionChange}
              onCancel={handleCloseEditItem}
              onSubmit={handleEditItemSubmit}
              submitLabel="Save Changes"
            />
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

interface ItemFormContentProps {
  title: string;
  form: AddItemForm;
  existingPhotoUrl?: string | null;
  isSaving: boolean;
  onFieldChange: (field: 'name' | 'description' | 'price' | 'original_price', value: string) => void;
  onPickPhoto: () => void;
  onAddOptionGroup: () => void;
  onRemoveOptionGroup: (index: number) => void;
  onOptionGroupChange: (gi: number, field: 'name' | 'is_required' | 'max_selections', value: string | boolean | number) => void;
  onAddOption: (gi: number) => void;
  onRemoveOption: (gi: number, oi: number) => void;
  onOptionChange: (gi: number, oi: number, field: 'name' | 'additional_price_cents', value: string | number) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

function ItemFormContent({
  title, form, existingPhotoUrl = null, isSaving,
  onFieldChange, onPickPhoto,
  onAddOptionGroup, onRemoveOptionGroup, onOptionGroupChange,
  onAddOption, onRemoveOption, onOptionChange,
  onCancel, onSubmit, submitLabel,
}: ItemFormContentProps): React.JSX.Element {
  const discountAmount = form.original_price.trim() && form.price.trim()
    ? Math.max(0, parseFloat(form.original_price) - parseFloat(form.price))
    : 0;

  return (
    <>
      <Text style={styles.modalTitle}>{title}</Text>

      <TextInput style={styles.modalInput} placeholder="Item name *"
        placeholderTextColor={colours.medium} value={form.name}
        onChangeText={(v) => onFieldChange('name', v)} accessibilityLabel="Item name" />

      <TextInput style={[styles.modalInput, { minHeight: 60, textAlignVertical: 'top' }]}
        placeholder="Description (optional)" placeholderTextColor={colours.medium}
        value={form.description}
        onChangeText={(v) => onFieldChange('description', v)}
        multiline accessibilityLabel="Item description" />

      <View style={styles.priceRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.priceLabel}>Price *</Text>
          <TextInput style={styles.modalInput} placeholder="100.00"
            placeholderTextColor={colours.medium} value={form.price}
            onChangeText={(v) => onFieldChange('price', v)}
            keyboardType="decimal-pad" accessibilityLabel="Item price" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.priceLabel}>Original Price (before discount)</Text>
          <TextInput style={styles.modalInput} placeholder="Optional"
            placeholderTextColor={colours.medium} value={form.original_price}
            onChangeText={(v) => onFieldChange('original_price', v)}
            keyboardType="decimal-pad" accessibilityLabel="Original price before discount" />
        </View>
      </View>
      {discountAmount > 0 && (
        <Text style={styles.discountBadge}>
          ✓ Discount: {formatPrice(Math.round(discountAmount * 100))} off
        </Text>
      )}

      {(form.photo !== null || existingPhotoUrl !== null) ? (
        <View style={styles.photoPreviewWrap}>
          <Image
            source={{ uri: form.photo !== null ? form.photo.uri : existingPhotoUrl! }}
            style={styles.photoPreview}
            resizeMode="cover"
            accessibilityLabel="Item photo preview"
          />
          {form.photo !== null && (
            <View style={styles.photoNewBadge}>
              <Text style={styles.photoNewBadgeText}>New</Text>
            </View>
          )}
          <View style={[styles.photoActions, { marginTop: spacing.xs }]}>
            <Pressable style={styles.photoChangeBtn} onPress={onPickPhoto}
              accessibilityRole="button" accessibilityLabel="Change photo">
              <Ionicons name="image-outline" size={16} color={colours.primary} />
              <Text style={styles.photoChangeBtnText}>Change Photo</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          style={[styles.cancelButton, { borderColor: colours.primary, marginBottom: spacing.sm }]}
          onPress={onPickPhoto} accessibilityRole="button" accessibilityLabel="Add photo">
          <Ionicons name="image-outline" size={16} color={colours.primary} />
          <Text style={[styles.cancelText, { color: colours.primary, marginLeft: 6 }]}>
            Add Photo (optional)
          </Text>
        </Pressable>
      )}

      <View style={styles.sectionDivider} />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Options / Modifiers</Text>
        <Pressable style={styles.addSmallBtn} onPress={onAddOptionGroup}
          accessibilityRole="button" accessibilityLabel="Add option group">
          <Ionicons name="add-circle-outline" size={16} color={colours.primary} />
          <Text style={styles.addSmallBtnText}>Add Group</Text>
        </Pressable>
      </View>
      <Text style={styles.sectionHint}>
        e.g. Group: "Protein" → Options: Pork (+15 ฿), Beef (+20 ฿)
      </Text>

      {form.option_groups.map((group, gi) => (
        <View key={gi} style={styles.optionGroupCard}>
          <View style={styles.optionGroupHeader}>
            <TextInput
              style={[styles.modalInput, { flex: 1, marginBottom: 0 }]}
              placeholder="Group name (e.g. Protein)"
              placeholderTextColor={colours.medium}
              value={group.name}
              onChangeText={(v) => onOptionGroupChange(gi, 'name', v)}
              accessibilityLabel={`Option group ${gi + 1} name`}
            />
            <Pressable onPress={() => onRemoveOptionGroup(gi)}
              style={{ padding: 8 }} accessibilityRole="button" accessibilityLabel="Remove group">
              <Ionicons name="trash-outline" size={16} color={colours.error} />
            </Pressable>
          </View>

          <View style={styles.optionGroupMeta}>
            <View style={styles.toggleRowSmall}>
              <Text style={styles.toggleLabelSmall}>Required</Text>
              <Switch
                value={group.is_required}
                onValueChange={(v) => onOptionGroupChange(gi, 'is_required', v)}
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
                onChangeText={(v) => onOptionGroupChange(gi, 'max_selections', parseInt(v, 10) || 1)}
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
                onChangeText={(v) => onOptionChange(gi, oi, 'name', v)}
                accessibilityLabel={`Option ${oi + 1} name`}
              />
              <TextInput
                style={[styles.modalInput, { flex: 1, marginBottom: 0, marginLeft: 6 }]}
                placeholder="+0"
                placeholderTextColor={colours.medium}
                value={opt.additional_price_cents === 0 ? '' : String(opt.additional_price_cents / 100)}
                onChangeText={(v) => onOptionChange(gi, oi, 'additional_price_cents', Math.round(parseFloat(v || '0') * 100))}
                keyboardType="decimal-pad"
                accessibilityLabel={`Option ${oi + 1} additional price`}
              />
              <Pressable onPress={() => onRemoveOption(gi, oi)}
                style={{ padding: 8 }} accessibilityRole="button" accessibilityLabel="Remove option">
                <Ionicons name="close-circle-outline" size={16} color={colours.error} />
              </Pressable>
            </View>
          ))}

          <Pressable style={styles.addOptionBtn} onPress={() => onAddOption(gi)}
            accessibilityRole="button" accessibilityLabel="Add option">
            <Ionicons name="add-outline" size={14} color={colours.primary} />
            <Text style={styles.addOptionBtnText}>Add Option</Text>
          </Pressable>
        </View>
      ))}

      <View style={styles.modalActions}>
        <Pressable style={styles.cancelButton} onPress={onCancel}
          accessibilityLabel="Cancel" accessibilityRole="button">
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.confirmButton, (isSaving || !form.name.trim() || !form.price.trim()) && { opacity: 0.5 }]}
          onPress={onSubmit}
          disabled={isSaving || !form.name.trim() || !form.price.trim()}
          accessibilityLabel={submitLabel} accessibilityRole="button"
        >
          {isSaving
            ? <ActivityIndicator size="small" color={colours.white} />
            : <Text style={styles.confirmText}>{submitLabel}</Text>
          }
        </Pressable>
      </View>
    </>
  );
}
