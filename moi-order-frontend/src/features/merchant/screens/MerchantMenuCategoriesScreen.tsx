import React from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { MenuCategory } from '@/types/models';
import { useMerchantMenuCategoriesScreen } from '../hooks/useMerchantMenuCategoriesScreen';
import { styles } from './MerchantMenuCategoriesScreen.styles';

// ── Sub-components ────────────────────────────────────────────────────────────

interface CategoryRowProps {
  item:          MenuCategory;
  editingId:     number | null;
  editingName:   string;
  isUpdating:    boolean;
  isDeletingId:  number | null;
  onStartEdit:   (id: number, name: string) => void;
  onNameChange:  (text: string) => void;
  onSave:        () => void;
  onCancel:      () => void;
  onDelete:      (id: number) => void;
}

function CategoryRow({ item, editingId, editingName, isUpdating, isDeletingId, onStartEdit, onNameChange, onSave, onCancel, onDelete }: CategoryRowProps): React.JSX.Element {
  const isEditing  = editingId === item.id;
  const isDeleting = isDeletingId === item.id;

  return (
    <View style={styles.row}>
      {isEditing ? (
        <>
          <TextInput style={styles.editInput} value={editingName} onChangeText={onNameChange} autoFocus returnKeyType="done" onSubmitEditing={onSave} />
          <Pressable style={styles.iconBtn} onPress={onSave} disabled={isUpdating} accessibilityRole="button" accessibilityLabel="Save category name">
            {isUpdating
              ? <ActivityIndicator size="small" color={colours.primary} />
              : <Ionicons name="checkmark-circle" size={22} color={colours.primary} />}
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={onCancel} accessibilityRole="button" accessibilityLabel="Cancel editing">
            <Ionicons name="close-circle" size={22} color={colours.textMuted} />
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
          {item.is_system && <Text style={styles.systemBadge}>system</Text>}
          {!item.is_system && (
            <Pressable style={styles.iconBtn} onPress={() => onStartEdit(item.id, item.name)} accessibilityRole="button" accessibilityLabel={`Edit ${item.name}`}>
              <Ionicons name="pencil-outline" size={18} color={colours.textMuted} />
            </Pressable>
          )}
          {!item.is_system && (
            <Pressable style={styles.iconBtn} onPress={() => onDelete(item.id)} disabled={isDeleting} accessibilityRole="button" accessibilityLabel={`Delete ${item.name}`}>
              {isDeleting
                ? <ActivityIndicator size="small" color={colours.danger} />
                : <Ionicons name="trash-outline" size={18} color={colours.danger} />}
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function MerchantMenuCategoriesScreen(): React.JSX.Element {
  const {
    categories, isLoading, isError, isDeletingId, isCreating, isUpdating,
    editingId, editingName, isAddingNew, newCategoryName,
    handleStartEdit, handleEditNameChange, handleSaveEdit, handleCancelEdit,
    handleDelete, handleShowAdd, handleNewNameChange, handleSaveNew, handleCancelAdd,
    handleBack,
  } = useMerchantMenuCategoriesScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={colours.textOnLight} />
        </Pressable>
        <Text style={styles.title}>Menu Categories</Text>
      </View>

      {isLoading && <View style={styles.center}><ActivityIndicator color={colours.primary} /></View>}
      {isError   && <View style={styles.center}><Text style={styles.empty}>Could not load categories.</Text></View>}

      {!isLoading && !isError && (
        <FlatList
          data={categories}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <CategoryRow
              item={item}
              editingId={editingId}
              editingName={editingName}
              isUpdating={isUpdating}
              isDeletingId={isDeletingId}
              onStartEdit={handleStartEdit}
              onNameChange={handleEditNameChange}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
              onDelete={handleDelete}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No categories yet. Add one below.</Text>}
          ListFooterComponent={
            isAddingNew ? (
              <View style={styles.addRow}>
                <TextInput style={styles.addInput} value={newCategoryName} onChangeText={handleNewNameChange} placeholder="Category name" placeholderTextColor={colours.textMuted} autoFocus returnKeyType="done" onSubmitEditing={handleSaveNew} />
                <Pressable style={styles.iconBtn} onPress={handleSaveNew} disabled={isCreating} accessibilityRole="button" accessibilityLabel="Save new category">
                  {isCreating
                    ? <ActivityIndicator size="small" color={colours.primary} />
                    : <Ionicons name="checkmark-circle" size={22} color={colours.primary} />}
                </Pressable>
                <Pressable style={styles.iconBtn} onPress={handleCancelAdd} accessibilityRole="button" accessibilityLabel="Cancel adding category">
                  <Ionicons name="close-circle" size={22} color={colours.textMuted} />
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.addBtn} onPress={handleShowAdd} accessibilityRole="button" accessibilityLabel="Add new category">
                <Ionicons name="add-circle-outline" size={20} color={colours.primary} />
                <Text style={styles.addBtnText}>Add Category</Text>
              </Pressable>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}
