import React from 'react';
import { View, Text, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMenuScreen } from '../hooks/useMenuScreen';
import { MenuCategorySelector } from '../components/MenuCategorySelector';
import { MenuModals } from '../components/MenuModals';
import { MenuItemCard } from '../components/MenuItemCard';
import { MenuItemRow } from '../components/MenuItemRow';
import { styles } from './MenuScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import { useTranslation } from '../../../shared/hooks/useTranslation';

interface MenuScreenProps {
  onEditItem: (itemId: number) => void;
}

export function MenuScreen({ onEditItem }: MenuScreenProps): React.JSX.Element {
  const t = useTranslation();
  const { isDesktop } = useResponsive();
  const {
    categories, filteredItems, guardedItemIds, isLoading, hasMissingSystemCategories,
    menuView, useStockSystem, selectedCategoryId, searchQuery,
    activeCategory, totalCount, numColumns, itemWidthPct,
    handleSelectCategory, handleSearchChange, setShowAddCategoryModal,
    showAddCategoryModal, newCategoryName, handleNewCategoryNameChange, handleConfirmAddCategory,
    renamingCategoryId, renamingCategoryName, isRenamingCategory,
    handleOpenRename, handleRenameNameChange, handleConfirmRename, handleCancelRename,
    deletingCategoryId, deletingCategoryName, handleOpenDeleteConfirm, handleConfirmDelete, handleCancelDelete,
    handleToggleItemStatus, handleDeleteItem, handleUpdateItemStock,
    addItemCategoryId, addItemForm, isAddingItem,
    handleOpenAddItem, handleCloseAddItem, handleAddItemFieldChange, handlePickAddPhoto,
    handleAddOptionGroup, handleRemoveOptionGroup, handleOptionGroupChange,
    handleAddOption, handleRemoveOption, handleOptionChange, handleAddItemSubmit,
  } = useMenuScreen();

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colours.primary} /></View>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>{t('menu_title')}</Text>
        {!isDesktop && (
          <Pressable style={styles.addCategoryBtn} onPress={() => setShowAddCategoryModal(true)} accessibilityLabel="Add menu category" accessibilityRole="button">
            <Ionicons name="folder-open-outline" size={13} color={colours.backgroundDark} />
            <Text style={styles.addCategoryBtnText}>{t('menu_add_category')}</Text>
          </Pressable>
        )}
      </View>

      <View style={[styles.body, isDesktop && styles.bodyDesktop]}>
        {isDesktop && (
          <MenuCategorySelector isDesktop categories={categories} totalCount={totalCount} selectedCategoryId={selectedCategoryId} onSelectCategory={handleSelectCategory} onOpenRename={handleOpenRename} onOpenDelete={handleOpenDeleteConfirm} onAddCategory={() => setShowAddCategoryModal(true)} />
        )}

        <View style={styles.contentPane}>
          {!isDesktop && (
            <MenuCategorySelector isDesktop={false} categories={categories} totalCount={totalCount} selectedCategoryId={selectedCategoryId} onSelectCategory={handleSelectCategory} onOpenRename={handleOpenRename} onOpenDelete={handleOpenDeleteConfirm} onAddCategory={() => setShowAddCategoryModal(true)} />
          )}

          <View style={styles.searchRow}>
            <Ionicons name="search-outline" size={14} color={colours.textSubtle} />
            <TextInput style={styles.searchInput} placeholder={t('menu_search_placeholder')} placeholderTextColor={colours.textSubtle} value={searchQuery} onChangeText={handleSearchChange} returnKeyType="search" accessibilityLabel="Search menu items" />
            {searchQuery.length > 0 && <Pressable onPress={() => handleSearchChange('')} accessibilityRole="button" accessibilityLabel="Clear search"><Ionicons name="close-circle" size={14} color={colours.textSubtle} /></Pressable>}
          </View>

          {hasMissingSystemCategories && (
            <View style={styles.warnBanner}><Ionicons name="warning-outline" size={13} color={colours.warning} /><Text style={styles.warnText}>{t('menu_system_warn')}</Text></View>
          )}

          <ScrollView style={styles.scroll} contentContainerStyle={menuView === 'list' ? styles.listWrap : [styles.gridWrap, { flexWrap: numColumns > 1 ? 'wrap' : undefined }]} showsVerticalScrollIndicator={false}>
            {filteredItems.length === 0 ? (
              <View style={styles.emptyState}><Ionicons name="restaurant-outline" size={40} color={colours.textSubtle} /><Text style={styles.emptyTitle}>{searchQuery ? t('menu_no_items_search') : t('menu_no_items_empty')}</Text><Text style={styles.emptySubtitle}>{searchQuery ? t('menu_no_items_keyword') : t('menu_no_items_empty_hint')}</Text></View>
            ) : menuView === 'list'
              ? filteredItems.map((item) => <MenuItemRow key={item.id} item={item} isLastInRequiredCategory={guardedItemIds.has(item.id)} useStockSystem={useStockSystem} onToggleStatus={handleToggleItemStatus} onDelete={handleDeleteItem} onEdit={(it) => onEditItem(it.id)} onUpdateStock={handleUpdateItemStock} />)
              : filteredItems.map((item) => <View key={item.id} style={[styles.gridCell, { width: itemWidthPct }]}><MenuItemCard item={item} isGuarded={guardedItemIds.has(item.id)} useStockSystem={useStockSystem} onToggleStatus={handleToggleItemStatus} onDelete={handleDeleteItem} onEdit={(it) => onEditItem(it.id)} onUpdateStock={handleUpdateItemStock} /></View>)
            }
          </ScrollView>

          {activeCategory !== null && (
            <Pressable style={styles.fab} onPress={() => handleOpenAddItem(activeCategory.id)} accessibilityLabel={`Add item to ${activeCategory.name}`} accessibilityRole="button">
              <Ionicons name="add" size={18} color={colours.backgroundDark} />
              <Text style={styles.fabText}>{t('menu_add_item')}</Text>
            </Pressable>
          )}
        </View>
      </View>

      <MenuModals
        addCat={{ show: showAddCategoryModal, name: newCategoryName, onChange: handleNewCategoryNameChange, onConfirm: handleConfirmAddCategory, onCancel: () => setShowAddCategoryModal(false) }}
        rename={{ id: renamingCategoryId, name: renamingCategoryName, isSaving: isRenamingCategory, onChange: handleRenameNameChange, onConfirm: handleConfirmRename, onCancel: handleCancelRename }}
        deleteModal={{ id: deletingCategoryId, name: deletingCategoryName, onConfirm: handleConfirmDelete, onCancel: handleCancelDelete }}
        addItem={{ categoryId: addItemCategoryId, form: addItemForm, isSaving: isAddingItem, onFieldChange: handleAddItemFieldChange, onPickPhoto: handlePickAddPhoto, onAddOptionGroup: handleAddOptionGroup, onRemoveOptionGroup: handleRemoveOptionGroup, onOptionGroupChange: handleOptionGroupChange, onAddOption: handleAddOption, onRemoveOption: handleRemoveOption, onOptionChange: handleOptionChange, onClose: handleCloseAddItem, onSubmit: handleAddItemSubmit }}
      />
    </SafeAreaView>
  );
}
