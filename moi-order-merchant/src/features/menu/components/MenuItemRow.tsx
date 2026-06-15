import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './MenuItemRow.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { PLATFORM_FEE_RATE } from '../../../shared/constants/config';
import { MENU_ITEM_STATUS, type MenuItemStatus } from '../../../types/enums';
import type { MenuItem } from '../../../types/models';

const STATUS_LABELS: Record<MenuItemStatus, string> = {
  [MENU_ITEM_STATUS.Available]: 'Available',
  [MENU_ITEM_STATUS.OutOfStock]: 'Out of Stock',
  [MENU_ITEM_STATUS.Hidden]: 'Hidden',
};

const STATUS_COLOURS: Record<MenuItemStatus, string> = {
  [MENU_ITEM_STATUS.Available]: colours.success,
  [MENU_ITEM_STATUS.OutOfStock]: colours.warning,
  [MENU_ITEM_STATUS.Hidden]: colours.medium,
};

interface MenuItemRowProps {
  item: MenuItem;
  isLastInRequiredCategory?: boolean;
  onToggleStatus: (id: number, status: MenuItemStatus) => void;
  onDelete: (id: number) => void;
  onEdit: (item: MenuItem) => void;
}

export function MenuItemRow({ item, isLastInRequiredCategory = false, onToggleStatus, onDelete, onEdit }: MenuItemRowProps): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [showGuardWarning, setShowGuardWarning] = useState(false);
  const [confirmingStatus, setConfirmingStatus] = useState(false);

  const statusColour = STATUS_COLOURS[item.status];
  const hasModifiers = item.option_groups.length > 0;
  const FEE = 1 + PLATFORM_FEE_RATE;
  const netPriceCents = Math.round(item.price_cents / FEE);
  const netOrigPriceCents = item.original_price_cents != null ? Math.round(item.original_price_cents / FEE) : null;
  const hasDiscount = netOrigPriceCents !== null && netOrigPriceCents > netPriceCents;

  const handleRowPress = useCallback(() => {
    if (hasModifiers) setExpanded((prev) => !prev);
  }, [hasModifiers]);

  const handleEditPress = useCallback(() => onEdit(item), [item, onEdit]);

  const handleDeletePress = useCallback(() => {
    if (isLastInRequiredCategory) {
      setShowGuardWarning(true);
      return;
    }
    setConfirmingDelete(true);
  }, [isLastInRequiredCategory]);

  const handleConfirmDelete = useCallback(() => {
    setConfirmingDelete(false);
    onDelete(item.id);
  }, [item.id, onDelete]);

  const handleCancelDelete = useCallback(() => setConfirmingDelete(false), []);

  const handleEditFromGuard = useCallback(() => {
    setShowGuardWarning(false);
    onEdit(item);
  }, [item, onEdit]);

  const handleDismissGuard = useCallback(() => setShowGuardWarning(false), []);

  const handleStatusPress = useCallback(() => setConfirmingStatus(true), []);

  const handleSelectStatus = useCallback((status: MenuItemStatus) => {
    setConfirmingStatus(false);
    onToggleStatus(item.id, status);
  }, [item.id, onToggleStatus]);

  const handleCancelStatus = useCallback(() => setConfirmingStatus(false), []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {/* Plain View — a flex:1 Pressable sibling blocks Android touch dispatch to actions */}
        <View style={styles.rowTapArea}>
          {item.photo_url !== null && (
            <Image source={{ uri: item.photo_url }} style={styles.photo} accessibilityLabel={item.name} />
          )}
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(netPriceCents)}</Text>
              {hasDiscount && (
                <Text style={styles.originalPrice}>{formatPrice(netOrigPriceCents!)}</Text>
              )}
              {hasModifiers && (
                <Text style={styles.modifierCount}>{item.option_groups.length} modifier{item.option_groups.length !== 1 ? 's' : ''}</Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          <Pressable
            style={styles.editButton}
            onPress={handleEditPress}
            accessibilityLabel={`Edit ${item.name}`}
            accessibilityRole="button"
          >
            <Ionicons name="pencil-outline" size={15} color={colours.primary} />
          </Pressable>
          <Pressable
            style={styles.deleteButton}
            onPress={handleDeletePress}
            accessibilityLabel={`Delete ${item.name}`}
            accessibilityRole="button"
          >
            <Ionicons name="trash-outline" size={15} color={colours.error} />
          </Pressable>
          <Pressable
            style={[styles.statusBadge, { backgroundColor: statusColour + '22' }]}
            onPress={handleStatusPress}
            accessibilityLabel={`Manage ${item.name}, status: ${STATUS_LABELS[item.status]}`}
            accessibilityRole="button"
          >
            <Text style={[styles.statusText, { color: statusColour }]}>
              {STATUS_LABELS[item.status]}
            </Text>
          </Pressable>
          {hasModifiers && (
            <Pressable
              style={styles.chevronButton}
              onPress={handleRowPress}
              accessibilityLabel={expanded ? `Collapse ${item.name} modifiers` : `Expand ${item.name} modifiers`}
              accessibilityRole="button"
            >
              <Ionicons
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colours.textMuted}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* Guard warning — shown when tapping delete on the last item in a required system category */}
      {showGuardWarning && (
        <View style={styles.guardBar}>
          <Ionicons name="warning-outline" size={14} color={colours.warning} style={styles.guardIcon} />
          <Text style={styles.guardText}>This category needs at least 1 item. Edit instead?</Text>
          <Pressable style={styles.guardEdit} onPress={handleEditFromGuard} accessibilityRole="button" accessibilityLabel="Edit item">
            <Text style={styles.guardEditText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.guardCancel} onPress={handleDismissGuard} accessibilityRole="button" accessibilityLabel="Cancel">
            <Text style={styles.guardCancelText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {/* Inline delete confirmation — replaces Alert.alert which is unreliable inside FlatList+Modal trees */}
      {confirmingDelete && (
        <View style={styles.confirmBar}>
          <Text style={styles.confirmText}>Delete "{item.name}"?</Text>
          <Pressable style={styles.confirmYes} onPress={handleConfirmDelete} accessibilityRole="button" accessibilityLabel="Confirm delete">
            <Text style={styles.confirmYesText}>Delete</Text>
          </Pressable>
          <Pressable style={styles.confirmNo} onPress={handleCancelDelete} accessibilityRole="button" accessibilityLabel="Cancel delete">
            <Text style={styles.confirmNoText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {/* Inline status picker */}
      {confirmingStatus && (
        <View style={styles.confirmBar}>
          <Text style={styles.confirmText}>Set status:</Text>
          <Pressable style={[styles.confirmYes, { backgroundColor: colours.success }]} onPress={() => handleSelectStatus(MENU_ITEM_STATUS.Available)} accessibilityRole="button" accessibilityLabel="Set available">
            <Text style={styles.confirmYesText}>Available</Text>
          </Pressable>
          <Pressable style={[styles.confirmYes, { backgroundColor: colours.warning }]} onPress={() => handleSelectStatus(MENU_ITEM_STATUS.OutOfStock)} accessibilityRole="button" accessibilityLabel="Set out of stock">
            <Text style={styles.confirmYesText}>Out of Stock</Text>
          </Pressable>
          <Pressable style={styles.confirmNo} onPress={handleCancelStatus} accessibilityRole="button" accessibilityLabel="Cancel">
            <Text style={styles.confirmNoText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {expanded && hasModifiers && (
        <View style={styles.accordion}>
          {item.option_groups.map((group) => (
            <View key={group.id} style={styles.groupBlock}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupMeta}>
                  {group.is_required ? 'Required' : 'Optional'} · Choose {group.max_selections === 1 ? '1' : `up to ${group.max_selections}`}
                </Text>
              </View>
              {group.options.map((opt) => (
                <View key={opt.id} style={styles.optionRow}>
                  <Text style={styles.optionName}>{opt.name}</Text>
                  <Text style={styles.optionPrice}>
                    {opt.additional_price_cents === 0 ? 'Free' : `+${formatPrice(opt.additional_price_cents)}`}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
