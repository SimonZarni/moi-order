import React from 'react';
import {
  View, Text, Pressable, Modal, FlatList,
  TextInput, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MerchantStackParamList } from '../../../types/navigation';
import { useSessionMenuScreen } from '../hooks/useSessionMenuScreen';
import { MenuItemRow } from '../components/MenuItemRow';
import { styles } from './SessionMenuScreen.styles';
import { colours } from '../../../shared/theme/colours';

type Props = NativeStackScreenProps<MerchantStackParamList, 'SessionMenu'> & {
  onBack?: () => void;
  onEditItem?: (itemId: number) => void;
};

export function SessionMenuScreen({ route, onBack, onEditItem }: Props): React.JSX.Element {
  const { openingHourId, label } = route.params;
  const vm = useSessionMenuScreen(openingHourId, onBack, onEditItem);

  if (vm.isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.centered}><ActivityIndicator size="large" color={colours.primary} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backBtn} onPress={vm.handleBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={20} color={colours.primary} />
          </Pressable>
          <Text style={styles.title} numberOfLines={1}>{label}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.importBtn}
            onPress={vm.handleOpenImportModal}
            accessibilityRole="button"
            accessibilityLabel="Import from default menu"
          >
            <Ionicons name="copy-outline" size={13} color={colours.primary} />
            <Text style={styles.importBtnText}>Import</Text>
          </Pressable>
          <Pressable
            style={styles.addCategoryBtn}
            onPress={vm.handleOpenAddModal}
            accessibilityRole="button"
            accessibilityLabel="Add category"
          >
            <Ionicons name="folder-open-outline" size={13} color={colours.backgroundDark} />
            <Text style={styles.addCategoryBtnText}>+ Category</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Categories + items ───────────────────────────────────────────── */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {vm.categories.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={40} color={colours.textSubtle} />
            <Text style={styles.emptyTitle}>No categories yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap "+ Category" to add one, or "Import" to copy from your default menu.
            </Text>
          </View>
        ) : (
          vm.categories.map((cat) => (
            <View key={cat.id} style={styles.categorySection}>
              {/* Category header */}
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categoryCount}>{cat.items.length}</Text>
                <View style={styles.categoryActions}>
                  <Pressable
                    style={[styles.catActionBtn, styles.catRenameBtn]}
                    onPress={() => vm.handleOpenRename(cat.id, cat.name)}
                    accessibilityRole="button"
                    accessibilityLabel={`Rename ${cat.name}`}
                  >
                    <Ionicons name="pencil" size={13} color={colours.primaryDark} />
                  </Pressable>
                  <Pressable
                    style={[styles.catActionBtn, styles.catDeleteBtn]}
                    onPress={() => vm.handleOpenDeleteConfirm(cat.id, cat.name)}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${cat.name}`}
                  >
                    <Ionicons name="trash-outline" size={13} color={colours.error} />
                  </Pressable>
                </View>
              </View>

              {/* Items */}
              {cat.items.map((item) => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  onToggleStatus={vm.handleToggleItemStatus}
                  onDelete={vm.handleDeleteItem}
                  onEdit={(it) => vm.handleEditItem(it.id)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* ── Add category modal ───────────────────────────────────────────── */}
      <Modal visible={vm.showAddCategoryModal} transparent animationType="slide" onRequestClose={vm.handleCancelAdd}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Category</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Category name"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={vm.newCategoryName}
              onChangeText={vm.handleNewCategoryNameChange}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={vm.handleConfirmAdd}
              accessibilityLabel="Category name"
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={vm.handleCancelAdd} accessibilityRole="button" accessibilityLabel="Cancel">
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmButton, (vm.isCreating || !vm.newCategoryName.trim()) && { opacity: 0.5 }]}
                onPress={vm.handleConfirmAdd}
                disabled={vm.isCreating || !vm.newCategoryName.trim()}
                accessibilityRole="button"
                accessibilityLabel="Add category"
              >
                {vm.isCreating
                  ? <ActivityIndicator size="small" color={colours.backgroundDark} />
                  : <Text style={styles.confirmText}>Add</Text>
                }
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Rename category modal ────────────────────────────────────────── */}
      <Modal visible={vm.renamingCategoryId !== null} transparent animationType="slide" onRequestClose={vm.handleCancelRename}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rename Category</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Category name"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={vm.renamingCategoryName}
              onChangeText={vm.handleRenameNameChange}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={vm.handleConfirmRename}
              accessibilityLabel="Category name"
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={vm.handleCancelRename} accessibilityRole="button" accessibilityLabel="Cancel">
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmButton, (vm.isRenaming || !vm.renamingCategoryName.trim()) && { opacity: 0.5 }]}
                onPress={vm.handleConfirmRename}
                disabled={vm.isRenaming || !vm.renamingCategoryName.trim()}
                accessibilityRole="button"
                accessibilityLabel="Save name"
              >
                {vm.isRenaming
                  ? <ActivityIndicator size="small" color={colours.backgroundDark} />
                  : <Text style={styles.confirmText}>Save</Text>
                }
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Delete category confirmation ─────────────────────────────────── */}
      <Modal visible={vm.deletingCategoryId !== null} transparent animationType="fade" onRequestClose={vm.handleCancelDelete}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete Category</Text>
            <Text style={styles.deleteConfirmBody}>
              {`Delete "${vm.deletingCategoryName}"? All items in this session category will also be removed.`}
            </Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={vm.handleCancelDelete} accessibilityRole="button" accessibilityLabel="Cancel">
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.deleteConfirmBtn} onPress={vm.handleConfirmDelete} accessibilityRole="button" accessibilityLabel="Confirm delete">
                <Text style={styles.deleteConfirmText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Import modal ─────────────────────────────────────────────────── */}
      <Modal visible={vm.isImportModalVisible} transparent animationType="slide" onRequestClose={vm.handleCloseImportModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Import from Default Menu</Text>
            <FlatList
              data={vm.defaultCategories}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.importModalItem}
                  onPress={() => vm.handleToggleImportId(item.id)}
                  accessibilityRole="checkbox"
                  accessibilityLabel={`Select ${item.name}`}
                  accessibilityState={{ checked: vm.selectedImportIds.includes(item.id) }}
                >
                  <Ionicons
                    name={vm.selectedImportIds.includes(item.id) ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={colours.primary}
                  />
                  <Text style={styles.importModalItemName}>{item.name}</Text>
                  <Text style={styles.importModalItemCount}>{item.items.length} items</Text>
                </Pressable>
              )}
            />
            <Pressable
              style={[styles.importConfirmBtn, (vm.selectedImportIds.length === 0 || vm.isImporting) && styles.importConfirmBtnDisabled]}
              onPress={vm.handleConfirmImport}
              disabled={vm.selectedImportIds.length === 0 || vm.isImporting}
              accessibilityRole="button"
              accessibilityLabel="Confirm import"
            >
              {vm.isImporting
                ? <ActivityIndicator size="small" color={colours.backgroundDark} />
                : <Text style={styles.importConfirmText}>
                    {vm.selectedImportIds.length > 0 ? `Import (${vm.selectedImportIds.length})` : 'Select categories'}
                  </Text>
              }
            </Pressable>
            <Pressable style={[styles.cancelButton, { marginTop: 8, alignSelf: 'center' }]} onPress={vm.handleCloseImportModal} accessibilityRole="button" accessibilityLabel="Cancel">
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
