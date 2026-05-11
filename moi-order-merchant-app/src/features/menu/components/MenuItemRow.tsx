import React, { useCallback, useState } from 'react';
import { Alert, View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './MenuItemRow.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
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
  onDelete: (id: number, onEditFallback?: () => void) => void;
  onEdit: (item: MenuItem) => void;
}

export function MenuItemRow({ item, isLastInRequiredCategory = false, onToggleStatus, onDelete, onEdit }: MenuItemRowProps): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const statusColour = STATUS_COLOURS[item.status];
  const hasModifiers = item.option_groups.length > 0;
  const hasDiscount = item.original_price_cents != null && item.original_price_cents > item.price_cents;

  const handleRowPress = useCallback(() => {
    if (hasModifiers) setExpanded((prev) => !prev);
  }, [hasModifiers]);

  const handleEditPress = useCallback(() => onEdit(item), [item, onEdit]);

  const handleDeletePress = useCallback(() => {
    if (isLastInRequiredCategory) {
      // Pass the edit handler so the guard alert in the hook can offer "Edit Item".
      onDelete(item.id, handleEditPress);
      return;
    }
    Alert.alert('Remove item?', `"${item.name}" will be permanently deleted.`, [
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [item.id, item.name, isLastInRequiredCategory, onDelete, handleEditPress]);

  const handleStatusPress = useCallback(() => {
    Alert.alert(
      item.name,
      'Set item status',
      [
        { text: 'Available', onPress: () => onToggleStatus(item.id, MENU_ITEM_STATUS.Available) },
        { text: 'Out of Stock', onPress: () => onToggleStatus(item.id, MENU_ITEM_STATUS.OutOfStock) },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }, [item.id, item.name, onToggleStatus]);

  return (
    <View style={styles.wrapper}>
      {/* Row is a View, not a Pressable — nested Pressable on Android swallows inner taps */}
      <View style={styles.row}>
        <Pressable
          style={styles.rowTapArea}
          onPress={handleRowPress}
          accessibilityLabel={`${item.name}${hasModifiers ? ', tap to see modifiers' : ''}`}
          accessibilityRole="button"
        >
          {item.photo_url !== null && (
            <Image source={{ uri: item.photo_url }} style={styles.photo} accessibilityLabel={item.name} />
          )}
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(item.price_cents)}</Text>
              {hasDiscount && (
                <Text style={styles.originalPrice}>{formatPrice(item.original_price_cents!)}</Text>
              )}
              {hasModifiers && (
                <Text style={styles.modifierCount}>{item.option_groups.length} modifier{item.option_groups.length !== 1 ? 's' : ''}</Text>
              )}
            </View>
          </View>
        </Pressable>
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
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colours.textMuted}
            />
          )}
        </View>
      </View>

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
