/**
 * Principle: SRP — renders the edit-order sheet; all logic delegated to useEditOrder.
 * Principle: OCP — quantity controls + search results are composable; no boolean prop sprawl.
 */
import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '../../../../shared/theme/colours';
import { formatPrice } from '../../../../shared/utils/formatCurrency';
import type { FoodOrder, MenuItem } from '../../../../types/models';
import { useEditOrder, type AddedItem, type EditableOriginalItem } from '../../hooks/useEditOrder';
import { styles } from './EditOrderModal.styles';

interface EditOrderModalProps {
  order: FoodOrder | undefined;
  visible: boolean;
  onClose: () => void;
}

export function EditOrderModal({ order, visible, onClose }: EditOrderModalProps): React.JSX.Element {
  const {
    originalItems, addedItems,
    searchQuery, searchResults, isLoadingMenu,
    isSubmitting, hasChanges,
    originalTotalCents, updatedTotalCents,
    removedCount, addedCount,
    handleOriginalDecrease, handleOriginalRemove,
    handleAddedDecrease, handleAddedRemove,
    handleSearchChange, handleAddMenuItem,
    handleSubmit, handleDiscard,
  } = useEditOrder(order, visible, onClose);

  const totalChanged = updatedTotalCents !== originalTotalCents;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleDiscard}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Order Items</Text>
            <Pressable
              style={styles.closeBtn}
              onPress={handleDiscard}
              accessibilityRole="button"
              accessibilityLabel="Close edit order modal"
            >
              <Ionicons name="close" size={18} color={colours.textOnDark} />
            </Pressable>
          </View>

          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
          >

            {/* Current items */}
            <View>
              <Text style={styles.sectionLabel}>Current Items</Text>
              {originalItems.map((item: EditableOriginalItem) => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.pricePerUnit)}</Text>
                  <View style={styles.stepper}>
                    <Pressable
                      style={[styles.stepBtn, item.quantity <= 1 && styles.stepBtnDisabled]}
                      onPress={() => handleOriginalDecrease(item.id)}
                      disabled={item.quantity <= 1}
                      accessibilityRole="button"
                      accessibilityLabel={`Decrease quantity of ${item.name}`}
                    >
                      <Text style={styles.stepBtnText}>−</Text>
                    </Pressable>
                    <Text style={styles.stepQty}>{item.quantity}</Text>
                    <Pressable
                      style={[styles.stepBtn, styles.stepBtnDisabled]}
                      disabled
                      accessibilityRole="button"
                      accessibilityLabel="Increase quantity disabled"
                    >
                      <Text style={styles.stepBtnText}>+</Text>
                    </Pressable>
                  </View>
                  <Pressable
                    style={styles.removeBtn}
                    onPress={() => handleOriginalRemove(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${item.name}`}
                  >
                    <Ionicons name="trash-outline" size={14} color={colours.error} />
                  </Pressable>
                </View>
              ))}
              {originalItems.length === 0 && (
                <Text style={styles.searchHint}>All original items removed.</Text>
              )}
            </View>

            {/* Added items */}
            {addedItems.length > 0 && (
              <View>
                <Text style={styles.sectionLabel}>Added Items</Text>
                {addedItems.map((item: AddedItem) => (
                  <View key={item.key} style={styles.itemRow}>
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{formatPrice(item.price_cents)}</Text>
                    <View style={styles.stepper}>
                      <Pressable
                        style={[styles.stepBtn, item.quantity <= 1 && styles.stepBtnDisabled]}
                        onPress={() => handleAddedDecrease(item.key)}
                        disabled={item.quantity <= 1}
                        accessibilityRole="button"
                        accessibilityLabel={`Decrease quantity of ${item.name}`}
                      >
                        <Text style={styles.stepBtnText}>−</Text>
                      </Pressable>
                      <Text style={styles.stepQty}>{item.quantity}</Text>
                      <Pressable
                        style={[styles.stepBtn, styles.stepBtnDisabled]}
                        disabled
                        accessibilityRole="button"
                        accessibilityLabel="Increase quantity disabled"
                      >
                        <Text style={styles.stepBtnText}>+</Text>
                      </Pressable>
                    </View>
                    <Pressable
                      style={styles.removeBtn}
                      onPress={() => handleAddedRemove(item.key)}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${item.name}`}
                    >
                      <Ionicons name="trash-outline" size={14} color={colours.error} />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            {/* Add item search */}
            <View>
              <Text style={styles.sectionLabel}>Add Item</Text>
              <View style={styles.searchRow}>
                <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.4)" />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  placeholder="Search menu items…"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  autoCorrect={false}
                  accessibilityLabel="Search menu items to add"
                />
                {isLoadingMenu && (
                  <ActivityIndicator size="small" color={colours.primary} />
                )}
              </View>

              {searchQuery.trim().length >= 2 && searchResults.length === 0 && !isLoadingMenu && (
                <Text style={styles.searchHint}>No available items match "{searchQuery}".</Text>
              )}
              {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
                <Text style={styles.searchHint}>Type at least 2 characters to search.</Text>
              )}
              {searchResults.map((item: MenuItem) => (
                <View key={item.id} style={styles.searchResult}>
                  <Text style={styles.searchResultName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.searchResultPrice}>{formatPrice(item.price_cents)}</Text>
                  <Pressable
                    style={styles.addBtn}
                    onPress={() => handleAddMenuItem(item)}
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${item.name} to order`}
                  >
                    <Ionicons name="add" size={16} color={colours.backgroundDark} />
                  </Pressable>
                </View>
              ))}
            </View>

            {/* Summary */}
            {hasChanges && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>
                  {removedCount > 0 ? `${removedCount} removed` : ''}
                  {removedCount > 0 && addedCount > 0 ? ' · ' : ''}
                  {addedCount > 0 ? `${addedCount} added` : ''}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {totalChanged && (
                    <Text style={styles.totalOld}>{formatPrice(originalTotalCents)}</Text>
                  )}
                  <Text style={totalChanged ? styles.totalNew : styles.totalUnchanged}>
                    {formatPrice(updatedTotalCents)}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable
              style={styles.discardBtn}
              onPress={handleDiscard}
              accessibilityRole="button"
              accessibilityLabel="Discard changes"
            >
              <Text style={styles.discardText}>Discard</Text>
            </Pressable>
            <Pressable
              style={[styles.submitBtn, (!hasChanges || isSubmitting) && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!hasChanges || isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Update order"
            >
              {isSubmitting
                ? <ActivityIndicator size="small" color={colours.backgroundDark} />
                : <Text style={styles.submitText}>Update Order</Text>
              }
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
}
