import React from 'react';
import {
  View, Text, Pressable, ActivityIndicator, Modal,
  TextInput, ScrollView, Switch, Image,
  StyleProp, TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useMenuScreen } from '../hooks/useMenuScreen';
import { MenuItemCard } from '../components/MenuItemCard';
import { styles } from './MenuScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import type { MenuItem } from '../../../types/models';
import type { AddItemForm } from '../hooks/useMenuScreen';

export function MenuScreen(): React.JSX.Element {
  const {
    categories, filteredItems, guardedItemIds, isLoading, hasMissingSystemCategories,
    selectedCategoryId, searchQuery, handleSelectCategory, handleSearchChange,
    showAddCategoryModal, newCategoryName, setShowAddCategoryModal,
    handleNewCategoryNameChange, handleConfirmAddCategory,
    renamingCategoryId, renamingCategoryName,
    handleOpenRename, handleRenameNameChange, handleConfirmRename, handleCancelRename,
    handleRequestDeleteCategory,
    handleToggleItemStatus, handleDeleteItem,
    addItemCategoryId, addItemForm, isAddingItem,
    handleOpenAddItem, handleCloseAddItem,
    handleAddItemFieldChange, handleAddItemPhotoChange, handlePickAddPhoto,
    handleAddOptionGroup, handleRemoveOptionGroup, handleOptionGroupChange,
    handleAddOption, handleRemoveOption, handleOptionChange, handleAddItemSubmit,
    editItemId, editItemForm, editItemExistingPhotoUrl, isEditingItem,
    handleOpenEditItem, handleCloseEditItem,
    handleEditItemFieldChange, handleEditItemPhotoChange, handlePickEditPhoto,
    handleEditAddOptionGroup, handleEditRemoveOptionGroup, handleEditOptionGroupChange,
    handleEditAddOption, handleEditRemoveOption, handleEditOptionChange, handleEditItemSubmit,
  } = useMenuScreen();

  const { width } = useWindowDimensions();

  // Responsive column count — content pane is roughly window-width minus sidebar (~220 px).
  // Fewer, wider columns give each card room to show name, description, and price comfortably.
  // Using flexWrap (not FlatList numColumns) so percentages map directly to CSS grid.
  const numColumns =
    width >= 1400 ? 4 :
    width >= 900  ? 3 : 2;

  // Each item width as a CSS percentage string — React Native Web supports this.
  const itemWidthPct = `${Math.floor(100 / numColumns)}%` as `${number}%`;

  const activeCategory = selectedCategoryId !== 'all'
    ? categories.find((c) => c.id === selectedCategoryId) ?? null
    : null;

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Menu</Text>
        <Pressable
          style={styles.addCategoryBtn}
          onPress={() => setShowAddCategoryModal(true)}
          accessibilityLabel="Add a new menu category"
          accessibilityRole="button"
        >
          <Ionicons name="folder-open-outline" size={13} color={colours.backgroundDark} />
          <Text style={styles.addCategoryBtnText}>Add Category</Text>
        </Pressable>
      </View>

      {/* ── Search bar ──────────────────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={15} color={colours.textSubtle} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items…"
          placeholderTextColor={colours.textSubtle}
          value={searchQuery}
          onChangeText={handleSearchChange}
          returnKeyType="search"
          accessibilityLabel="Search menu items"
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => handleSearchChange('')}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={15} color={colours.textSubtle} />
          </Pressable>
        )}
      </View>

      {/* ── Category tabs ────────────────────────────────────────────────── */}
      {/* Outer View enforces height — ScrollView ignores height on its own style prop on Expo Web */}
      <View style={styles.tabsOuter}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
        style={styles.tabs}
      >
        <CategoryTab
          label="All"
          count={categories.reduce((sum, c) => sum + c.items.length, 0)}
          isActive={selectedCategoryId === 'all'}
          onPress={() => handleSelectCategory('all')}
        />
        {categories.map((cat) => (
          <CategoryTab
            key={cat.id}
            label={cat.name}
            count={cat.items.length}
            isActive={selectedCategoryId === cat.id}
            onPress={() => handleSelectCategory(cat.id)}
            onEdit={cat.is_system ? undefined : () => handleOpenRename(cat.id, cat.name)}
            onDelete={cat.is_system ? undefined : () => handleRequestDeleteCategory(cat.id, cat.name)}
          />
        ))}
      </ScrollView>
      </View>

      {/* ── System category warning banner ──────────────────────────────── */}
      {hasMissingSystemCategories && (
        <View style={styles.warnBanner} accessibilityRole="alert">
          <Ionicons name="warning-outline" size={13} color={colours.warning} />
          <Text style={styles.warnText}>
            Menu hidden from customers — Popular Picks & Recommendations each need at least 1 item.
          </Text>
        </View>
      )}

      {/* ── Items grid — flexWrap ScrollView (reliable on Expo Web) ─────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={40} color={colours.textSubtle} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No items match your search' : 'No items yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Try a different keyword'
                : 'Select a category below and add your first item'}
            </Text>
          </View>
        ) : (
          <View style={styles.gridWrap}>
            {filteredItems.map((item) => (
              // Inline width so React Native Web maps it to a CSS percentage directly
              <View key={item.id} style={[styles.gridItem, { width: itemWidthPct }]}>
                <MenuItemCard
                  item={item}
                  isGuarded={guardedItemIds.has(item.id)}
                  onToggleStatus={handleToggleItemStatus}
                  onDelete={handleDeleteItem}
                  onEdit={handleOpenEditItem}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ── Floating "Add Item" button — only when a category is selected ── */}
      {activeCategory !== null && (
        <Pressable
          style={styles.fab}
          onPress={() => handleOpenAddItem(activeCategory.id)}
          accessibilityLabel={`Add item to ${activeCategory.name}`}
          accessibilityRole="button"
        >
          <Ionicons name="add" size={18} color={colours.backgroundDark} />
          <Text style={styles.fabText}>Add Item</Text>
        </Pressable>
      )}

      {/* ── Add category modal ───────────────────────────────────────────── */}
      <Modal visible={showAddCategoryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Category</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Category name"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={newCategoryName}
              onChangeText={handleNewCategoryNameChange}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleConfirmAddCategory}
              accessibilityLabel="Category name"
            />
            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setShowAddCategoryModal(false)}
                accessibilityLabel="Cancel"
                accessibilityRole="button"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={handleConfirmAddCategory}
                accessibilityLabel="Add category"
                accessibilityRole="button"
              >
                <Text style={styles.confirmText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Rename category modal ───────────────────────────────────────── */}
      <Modal visible={renamingCategoryId !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rename Category</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Category name"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={renamingCategoryName}
              onChangeText={handleRenameNameChange}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleConfirmRename}
              accessibilityLabel="Category name"
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={handleCancelRename} accessibilityLabel="Cancel" accessibilityRole="button">
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.confirmButton} onPress={handleConfirmRename} accessibilityLabel="Save name" accessibilityRole="button">
                <Text style={styles.confirmText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Add menu item modal ──────────────────────────────────────────── */}
      <Modal visible={addItemCategoryId !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalCard}
            keyboardShouldPersistTaps="handled"
          >
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

      {/* ── Edit menu item modal ─────────────────────────────────────────── */}
      <Modal visible={editItemId !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalCard}
            keyboardShouldPersistTaps="handled"
          >
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

// ── Sub-components ────────────────────────────────────────────────────────────

interface NumericInputProps {
  value: number;
  min: number;
  max: number;
  fallback: number;
  style: StyleProp<TextStyle>;
  onChange: (n: number) => void;
  accessibilityLabel: string;
}

/** Controlled number input that avoids the "append-to-existing-digit" bug.
 *  On focus: pre-selects the current value so typing replaces it entirely.
 *  On blur: clamps the draft string to [min, max], falling back to `fallback`. */
function NumericInput({ value, min, max, fallback, style, onChange, accessibilityLabel }: NumericInputProps): React.JSX.Element {
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft !== null ? draft : String(value);

  return (
    <TextInput
      style={style}
      value={display}
      onFocus={() => setDraft(String(value))}
      onChangeText={setDraft}
      onBlur={() => {
        const parsed = parseInt(draft ?? '', 10);
        const clamped = isNaN(parsed) ? fallback : Math.min(max, Math.max(min, parsed));
        setDraft(null);
        onChange(clamped);
      }}
      selectTextOnFocus
      keyboardType="number-pad"
      accessibilityLabel={accessibilityLabel}
    />
  );
}

interface CategoryTabProps {
  label: string;
  count: number;
  isActive: boolean;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function CategoryTab({ label, count, isActive, onPress, onEdit, onDelete }: CategoryTabProps): React.JSX.Element {
  return (
    <View style={[styles.tab, isActive && styles.tabActive]}>
      {/* Label + count — tappable area for selecting the category */}
      <Pressable
        style={styles.tabLabelArea}
        onPress={onPress}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={`${label} category, ${count} items`}
      >
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{label}</Text>
        <View style={[styles.tabCount, isActive && styles.tabCountActive]}>
          <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>{count}</Text>
        </View>
      </Pressable>
      {onEdit && (
        <Pressable style={styles.tabEditBtn} onPress={onEdit} accessibilityRole="button" accessibilityLabel={`Rename ${label}`}>
          <Ionicons name="pencil" size={11} color={colours.primaryDark} />
        </Pressable>
      )}
      {onDelete && (
        <Pressable style={styles.tabDeleteBtn} onPress={onDelete} accessibilityRole="button" accessibilityLabel={`Delete ${label}`}>
          <Ionicons name="trash-outline" size={11} color={colours.error} />
        </Pressable>
      )}
    </View>
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
  onOptionGroupChange: (gi: number, field: 'name' | 'is_required' | 'min_selections' | 'max_selections', value: string | boolean | number) => void;
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
  const discountAmount =
    form.original_price.trim() && form.price.trim()
      ? Math.max(0, parseFloat(form.original_price) - parseFloat(form.price))
      : 0;

  return (
    <>
      <Text style={styles.modalTitle}>{title}</Text>

      <TextInput
        style={styles.modalInput}
        placeholder="Item name *"
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={form.name}
        onChangeText={(v) => onFieldChange('name', v)}
        accessibilityLabel="Item name"
      />

      <TextInput
        style={[styles.modalInput, { minHeight: 60, textAlignVertical: 'top' }]}
        placeholder="Description (optional)"
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={form.description}
        onChangeText={(v) => onFieldChange('description', v)}
        multiline
        accessibilityLabel="Item description"
      />

      <View style={styles.priceRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.priceLabel}>Price *</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="100.00"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={form.price}
            onChangeText={(v) => onFieldChange('price', v)}
            keyboardType="decimal-pad"
            accessibilityLabel="Item price"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.priceLabel}>Original Price (before discount)</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Optional"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={form.original_price}
            onChangeText={(v) => onFieldChange('original_price', v)}
            keyboardType="decimal-pad"
            accessibilityLabel="Original price before discount"
          />
        </View>
      </View>

      {discountAmount > 0 && (
        <Text style={styles.discountBadge}>
          ✓ Discount: {formatPrice(Math.round(discountAmount * 100))} off
        </Text>
      )}

      <PhotoPreview
        newPhoto={form.photo}
        existingUrl={existingPhotoUrl ?? null}
        onPickPhoto={onPickPhoto}
      />

      <View style={styles.sectionDivider} />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Options / Modifiers</Text>
        <Pressable
          style={styles.addSmallBtn}
          onPress={onAddOptionGroup}
          accessibilityRole="button"
          accessibilityLabel="Add option group"
        >
          <Ionicons name="add-circle-outline" size={14} color={colours.primary} />
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
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={group.name}
              onChangeText={(v) => onOptionGroupChange(gi, 'name', v)}
              accessibilityLabel={`Option group ${gi + 1} name`}
            />
            <Pressable
              onPress={() => onRemoveOptionGroup(gi)}
              style={{ padding: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Remove group"
            >
              <Ionicons name="trash-outline" size={15} color={colours.error} />
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
              <Text style={styles.toggleLabelSmall}>Min</Text>
              <NumericInput
                style={styles.smallNumInput}
                value={group.min_selections}
                min={0}
                max={10}
                fallback={0}
                onChange={(n) => onOptionGroupChange(gi, 'min_selections', n)}
                accessibilityLabel={`Min selections for group ${gi + 1}`}
              />
            </View>
            <View style={styles.toggleRowSmall}>
              <Text style={styles.toggleLabelSmall}>Max</Text>
              <NumericInput
                style={styles.smallNumInput}
                value={group.max_selections}
                min={1}
                max={10}
                fallback={1}
                onChange={(n) => onOptionGroupChange(gi, 'max_selections', n)}
                accessibilityLabel={`Max selections for group ${gi + 1}`}
              />
            </View>
          </View>

          {group.options.map((opt, oi) => (
            <View key={oi} style={styles.optionRow}>
              <TextInput
                style={[styles.modalInput, { flex: 2, marginBottom: 0 }]}
                placeholder="Option name"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={opt.name}
                onChangeText={(v) => onOptionChange(gi, oi, 'name', v)}
                accessibilityLabel={`Option ${oi + 1} name`}
              />
              <TextInput
                style={[styles.modalInput, { flex: 1, marginBottom: 0, marginLeft: 6 }]}
                placeholder="+0"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={opt.additional_price_cents === 0 ? '' : String(opt.additional_price_cents / 100)}
                onChangeText={(v) =>
                  onOptionChange(gi, oi, 'additional_price_cents', Math.round(parseFloat(v || '0') * 100))
                }
                keyboardType="decimal-pad"
                accessibilityLabel={`Option ${oi + 1} additional price`}
              />
              <Pressable
                onPress={() => onRemoveOption(gi, oi)}
                style={{ padding: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Remove option"
              >
                <Ionicons name="close-circle-outline" size={15} color={colours.error} />
              </Pressable>
            </View>
          ))}

          <Pressable
            style={styles.addOptionBtn}
            onPress={() => onAddOption(gi)}
            accessibilityRole="button"
            accessibilityLabel="Add option"
          >
            <Ionicons name="add-outline" size={13} color={colours.primary} />
            <Text style={styles.addOptionBtnText}>Add Option</Text>
          </Pressable>
        </View>
      ))}

      <View style={styles.modalActions}>
        <Pressable
          style={styles.cancelButton}
          onPress={onCancel}
          accessibilityLabel="Cancel"
          accessibilityRole="button"
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[
            styles.confirmButton,
            (isSaving || !form.name.trim() || !form.price.trim()) && { opacity: 0.5 },
          ]}
          onPress={onSubmit}
          disabled={isSaving || !form.name.trim() || !form.price.trim()}
          accessibilityLabel={submitLabel}
          accessibilityRole="button"
        >
          {isSaving
            ? <ActivityIndicator size="small" color={colours.backgroundDark} />
            : <Text style={styles.confirmText}>{submitLabel}</Text>
          }
        </Pressable>
      </View>
    </>
  );
}

interface PhotoPreviewProps {
  newPhoto: AddItemForm['photo'];
  existingUrl: string | null;
  onPickPhoto: () => void;
}

function PhotoPreview({ newPhoto, existingUrl, onPickPhoto }: PhotoPreviewProps): React.JSX.Element {
  const [loadError, setLoadError] = useState(false);
  const uri = newPhoto !== null ? newPhoto.uri : existingUrl;
  const isNew = newPhoto !== null;
  const handleError = useCallback(() => setLoadError(true), []);

  if (uri === null) {
    return (
      <Pressable
        style={[styles.cancelButton, { borderColor: colours.primary, marginBottom: spacing.sm }]}
        onPress={onPickPhoto}
        accessibilityRole="button"
        accessibilityLabel="Add photo"
      >
        <Ionicons name="image-outline" size={15} color={colours.primary} />
        <Text style={[styles.cancelText, { color: colours.primary, marginLeft: 6 }]}>
          Add Photo (optional)
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.photoPreviewWrap}>
      {loadError ? (
        <Pressable
          style={[styles.photoPreview, styles.photoErrorState]}
          onPress={onPickPhoto}
          accessibilityRole="button"
          accessibilityLabel="Photo unavailable, tap to upload new"
        >
          <Ionicons name="image-outline" size={28} color={colours.medium} />
          <Text style={styles.photoErrorText}>Tap to upload photo</Text>
        </Pressable>
      ) : (
        <Image
          source={{ uri }}
          style={styles.photoPreview}
          resizeMode="cover"
          accessibilityLabel="Item photo preview"
          onError={handleError}
        />
      )}
      {isNew && !loadError && (
        <View style={styles.photoNewBadge}>
          <Text style={styles.photoNewBadgeText}>New</Text>
        </View>
      )}
      {!loadError && (
        <Pressable
          style={styles.photoChangeBtn}
          onPress={onPickPhoto}
          accessibilityRole="button"
          accessibilityLabel="Change photo"
        >
          <Ionicons name="image-outline" size={14} color={colours.primary} />
          <Text style={styles.photoChangeBtnText}>Change Photo</Text>
        </Pressable>
      )}
    </View>
  );
}
