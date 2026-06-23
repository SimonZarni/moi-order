import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MerchantStackParamList } from '../../../types/navigation';
import { useSessionMenuScreen } from '../hooks/useSessionMenuScreen';
import { styles } from './SessionMenuScreen.styles';
import { colours } from '../../../shared/theme/colours';

type Props = NativeStackScreenProps<MerchantStackParamList, 'SessionMenu'> & {
  onBack?: () => void;
};

export function SessionMenuScreen({ route, onBack }: Props): React.JSX.Element {
  const { openingHourId, label } = route.params;
  const vm = useSessionMenuScreen(openingHourId, onBack);
  const [addName, setAddName] = useState('');

  if (vm.isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.centered}><ActivityIndicator size="large" color={colours.primary} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={vm.handleBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={16} color={colours.primary} />
            <Text style={styles.backBtnText}>Back</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>{label}</Text>

        <TextInput
          style={styles.addCategoryInput}
          value={addName}
          onChangeText={setAddName}
          placeholder="New category name…"
          placeholderTextColor={colours.textSubtle}
          returnKeyType="done"
          onSubmitEditing={() => { if (addName.trim()) { vm.handleAddCategory(addName.trim()); setAddName(''); } }}
          accessibilityLabel="New session category name"
        />

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.addBtn, vm.isCreating && { opacity: 0.6 }]}
            onPress={() => { if (addName.trim()) { vm.handleAddCategory(addName.trim()); setAddName(''); } }}
            disabled={vm.isCreating || !addName.trim()}
            accessibilityRole="button"
            accessibilityLabel="Add session category"
          >
            <Text style={styles.addBtnText}>{vm.isCreating ? 'Adding…' : '+ Add Category'}</Text>
          </Pressable>
          <Pressable
            style={styles.importBtn}
            onPress={vm.handleOpenImportModal}
            accessibilityRole="button"
            accessibilityLabel="Import categories from default menu"
          >
            <Text style={styles.importBtnText}>Import from Menu</Text>
          </Pressable>
        </View>

        {vm.isError && <Text style={styles.errorText}>{vm.error ?? 'Something went wrong.'}</Text>}

        {vm.categories.length === 0
          ? (
            <View style={styles.emptyCard}>
              <Ionicons name="restaurant-outline" size={32} color={colours.textSubtle} />
              <Text style={styles.emptyText}>No categories yet. Add one above or import from your default menu.</Text>
            </View>
          )
          : vm.categories.map((cat) => (
            <View key={cat.id} style={styles.categoryCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categoryMeta}>{cat.items.length} item{cat.items.length !== 1 ? 's' : ''}</Text>
              </View>
              <View style={styles.cardActions}>
                <Pressable
                  style={styles.iconBtn}
                  onPress={() => vm.handleDeleteCategory(cat.id, cat.name)}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete category ${cat.name}`}
                >
                  <Ionicons name="trash-outline" size={18} color={colours.error} />
                </Pressable>
              </View>
            </View>
          ))
        }
      </ScrollView>

      <Modal visible={vm.isImportModalVisible} transparent animationType="slide" onRequestClose={vm.handleCloseImportModal}>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalSheet} edges={['bottom']}>
            <Text style={styles.modalTitle}>Import from Default Menu</Text>
            <FlatList
              data={vm.defaultCategories}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalItem}
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
                  <Text style={styles.modalItemName}>{item.name}</Text>
                  <Text style={styles.categoryMeta}>{item.items.length} items</Text>
                </Pressable>
              )}
            />
            <Pressable
              style={[styles.modalConfirmBtn, vm.selectedImportIds.length === 0 && styles.modalConfirmBtnDisabled]}
              onPress={vm.handleConfirmImport}
              disabled={vm.selectedImportIds.length === 0 || vm.isImporting}
              accessibilityRole="button"
              accessibilityLabel="Confirm import"
            >
              <Text style={styles.modalConfirmText}>
                {vm.isImporting ? 'Importing…' : `Import ${vm.selectedImportIds.length > 0 ? `(${vm.selectedImportIds.length})` : ''}`}
              </Text>
            </Pressable>
            <Pressable style={styles.modalCancelBtn} onPress={vm.handleCloseImportModal} accessibilityRole="button" accessibilityLabel="Cancel import">
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
