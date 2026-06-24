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
import { MenuItemRow } from '../components/MenuItemRow';
import { styles } from './MenuScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { PLATFORM_FEE_RATE } from '../../../shared/constants/config';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { MenuItem } from '../../../types/models';
import type { AddItemForm } from '../hooks/useMenuScreen';

interface MenuScreenProps {
  onEditItem: (itemId: number) => void;
}

export function MenuScreen({ onEditItem }: MenuScreenProps): React.JSX.Element {
  const t = useTranslation();
  const {
    categories, filteredItems, guardedItemIds, isLoading, hasMissingSystemCategories, menuView,
    useStockSystem,
    selectedCategoryId, searchQuery, handleSelectCategory, handleSearchChange,
    showAddCategoryModal, newCategoryName, setShowAddCategoryModal,
    handleNewCategoryNameChange, handleConfirmAddCategory,
    renamingCategoryId, renamingCategoryName, isRenamingCategory,
    handleOpenRename, handleRenameNameChange, handleConfirmRename, handleCancelRename,
    deletingCategoryId, deletingCategoryName,
    handleOpenDeleteConfirm, handleConfirmDelete, handleCancelDelete,
    handleToggleItemStatus, handleDeleteItem, handleUpdateItemStock,
    addItemCategoryId, addItemForm, isAddingItem,
    handleOpenAddItem, handleCloseAddItem,
    handleAddItemFieldChange, handleAddItemPhotoChange, handlePickAddPhoto,
    handleAddOptionGroup, handleRemoveOptionGroup, handleOptionGroupChange,
    handleAddOption, handleRemoveOption, handleOptionChange, handleAddItemSubmit,
  } = useMenuScreen();

  const { width } = useWindowDimensions();

  const numColumns =
    width >= 1400 ? 4 :
    width >= 900  ? 3 : 2;

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
        <Text style={styles.pageTitle}>{t('menu_title')}</Text>
        <Pressable
          style={styles.addCategoryBtn}
          onPress={() => setShowAddCategoryModal(true)}
          accessibilityLabel="Add a new menu category"
          accessibilityRole="button"
        >
          <Ionicons name="folder-open-outline" size={13} color={colours.backgroundDark} />
          <Text style={styles.addCategoryBtnText}>{t('menu_add_category')}</Text>
        </Pressable>
      </View>

      {/* ── Search bar ──────────────────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={15} color={colours.textSubtle} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('menu_search_placeholder')}
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
      <View style={styles.tabsOuter}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
        style={styles.tabs}
      >
        <CategoryTab
          label={t('menu_all_category')}
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
            onDelete={cat.is_system ? undefined : () => handleOpenDeleteConfirm(cat.id, cat.name)}
          />
        ))}
      </ScrollView>
      </View>

      {/* ── System category warning banner ──────────────────────────────── */}
      {hasMissingSystemCategories && (
        <View style={styles.warnBanner} accessibilityRole="alert">
          <Ionicons name="warning-outline" size={13} color={colours.warning} />
          <Text style={styles.warnText}>{t('menu_system_warn')}</Text>
        </View>
      )}

      {/* ── Items grid ──────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={40} color={colours.textSubtle} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? t('menu_no_items_search') : t('menu_no_items_empty')}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? t('menu_no_items_keyword') : t('menu_no_items_empty_hint')}
            </Text>
          </View>
        ) : menuView === 'list' ? (
          <View style={styles.listWrap}>
            {filteredItems.map((item) => (
              <MenuItemRow
                key={item.id}
                item={item}
                isLastInRequiredCategory={guardedItemIds.has(item.id)}
                useStockSystem={useStockSystem}
                onToggleStatus={handleToggleItemStatus}
                onDelete={handleDeleteItem}
                onEdit={(it) => onEditItem(it.id)}
                onUpdateStock={handleUpdateItemStock}
              />
            ))}
          </View>
        ) : (
          <View style={styles.gridWrap}>
            {filteredItems.map((item) => (
              <View key={item.id} style={[styles.gridItem, { width: itemWidthPct }]}>
                <MenuItemCard
                  item={item}
                  isGuarded={guardedItemIds.has(item.id)}
                  onToggleStatus={handleToggleItemStatus}
                  onDelete={handleDeleteItem}
                  onEdit={(it) => onEditItem(it.id)}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ── Floating "Add Item" button ─────────────────────────────────── */}
      {activeCategory !== null && (
        <Pressable
          style={styles.fab}
          onPress={() => handleOpenAddItem(activeCategory.id)}
          accessibilityLabel={`Add item to ${activeCategory.name}`}
          accessibilityRole="button"
        >
          <Ionicons name="add" size={18} color={colours.backgroundDark} />
          <Text style={styles.fabText}>{t('menu_add_item')}</Text>
        </Pressable>
      )}

      {/* ── Add category modal ───────────────────────────────────────────── */}
      <Modal visible={showAddCategoryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('menu_new_category_title')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={t('menu_category_name_placeholder')}
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
                <Text style={styles.cancelText}>{t('common_cancel')}</Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={handleConfirmAddCategory}
                accessibilityLabel="Add category"
                accessibilityRole="button"
              >
                <Text style={styles.confirmText}>{t('common_add')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Rename category modal ───────────────────────────────────────── */}
      <Modal visible={renamingCategoryId !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('menu_rename_category_title')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={t('menu_category_name_placeholder')}
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
                <Text style={styles.cancelText}>{t('common_cancel')}</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmButton, isRenamingCategory && { opacity: 0.6 }]}
                onPress={handleConfirmRename}
                disabled={isRenamingCategory}
                accessibilityLabel="Save name"
                accessibilityRole="button"
              >
                {isRenamingCategory
                  ? <ActivityIndicator size="small" color={colours.backgroundDark} />
                  : <Text style={styles.confirmText}>{t('common_save')}</Text>
                }
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Delete category confirmation modal ──────────────────────────── */}
      <Modal visible={deletingCategoryId !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('menu_delete_category_title')}</Text>
            <Text style={styles.deleteConfirmBody}>
              {`Delete "${deletingCategoryName}"? All items in this category will also be removed. This cannot be undone.`}
            </Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={handleCancelDelete} accessibilityLabel="Cancel" accessibilityRole="button">
                <Text style={styles.cancelText}>{t('common_cancel')}</Text>
              </Pressable>
              <Pressable style={styles.deleteConfirmBtn} onPress={handleConfirmDelete} accessibilityLabel="Confirm delete" accessibilityRole="button">
                <Text style={styles.deleteConfirmText}>{t('common_delete')}</Text>
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
              title={t('menu_new_item_title')}
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
              submitLabel={t('menu_add_item')}
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
  const t = useTranslation();

  const discountAmount =
    form.original_price.trim() && form.price.trim()
      ? Math.max(0, parseFloat(form.original_price) - parseFloat(form.price))
      : 0;

  return (
    <>
      <Text style={styles.modalTitle}>{title}</Text>

      <TextInput
        style={styles.modalInput}
        placeholder={t('menu_item_name_placeholder')}
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={form.name}
        onChangeText={(v) => onFieldChange('name', v)}
        accessibilityLabel="Item name"
      />

      <TextInput
        style={[styles.modalInput, { minHeight: 60, textAlignVertical: 'top' }]}
        placeholder={t('menu_item_desc_placeholder')}
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={form.description}
        onChangeText={(v) => onFieldChange('description', v)}
        multiline
        accessibilityLabel="Item description"
      />

      <View style={styles.priceRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.priceLabel}>{t('menu_price_label')} (your take)</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="100.00"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={form.price}
            onChangeText={(v) => onFieldChange('price', v)}
            keyboardType="decimal-pad"
            accessibilityLabel="Item price"
          />
          {form.price.trim() !== '' && !isNaN(parseFloat(form.price)) && (
            <Text style={styles.customerPriceHint}>
              Customer sees: {formatPrice(Math.round(parseFloat(form.price) * 100 * (1 + PLATFORM_FEE_RATE)))}
            </Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.priceLabel}>{t('menu_original_price_label')}</Text>
          <TextInput
            style={styles.modalInput}
            placeholder={t('common_optional')}
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={form.original_price}
            onChangeText={(v) => onFieldChange('original_price', v)}
            keyboardType="decimal-pad"
            accessibilityLabel="Original price before discount"
          />
          {form.original_price.trim() !== '' && !isNaN(parseFloat(form.original_price)) && (
            <Text style={styles.customerPriceHint}>
              Customer sees: {formatPrice(Math.round(parseFloat(form.original_price) * 100 * (1 + PLATFORM_FEE_RATE)))}
            </Text>
          )}
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
        <Text style={styles.sectionTitle}>{t('menu_options_title')}</Text>
        <Pressable
          style={styles.addSmallBtn}
          onPress={onAddOptionGroup}
          accessibilityRole="button"
          accessibilityLabel="Add option group"
        >
          <Ionicons name="add-circle-outline" size={14} color={colours.primary} />
          <Text style={styles.addSmallBtnText}>{t('menu_add_group')}</Text>
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
              placeholder={t('menu_group_name_placeholder')}
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
              <Text style={styles.toggleLabelSmall}>{t('menu_required')}</Text>
              <Switch
                value={group.is_required}
                onValueChange={(v) => onOptionGroupChange(gi, 'is_required', v)}
                trackColor={{ false: colours.divider, true: colours.primary + '66' }}
                thumbColor={group.is_required ? colours.primary : colours.medium}
                accessibilityLabel={`Group ${gi + 1} required`}
              />
            </View>
            <View style={styles.toggleRowSmall}>
              <Text style={styles.toggleLabelSmall}>{t('menu_min')}</Text>
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
              <Text style={styles.toggleLabelSmall}>{t('menu_max')}</Text>
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
                placeholder={t('menu_option_name_placeholder')}
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
            <Text style={styles.addOptionBtnText}>{t('menu_add_option')}</Text>
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
          <Text style={styles.cancelText}>{t('common_cancel')}</Text>
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
  const t = useTranslation();
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
          {t('menu_tap_upload_photo')}
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
          <Text style={styles.photoErrorText}>{t('menu_tap_upload_photo')}</Text>
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
          <Text style={styles.photoNewBadgeText}>{t('menu_photo_badge_new')}</Text>
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
          <Text style={styles.photoChangeBtnText}>{t('menu_change_photo')}</Text>
        </Pressable>
      )}
    </View>
  );
}
