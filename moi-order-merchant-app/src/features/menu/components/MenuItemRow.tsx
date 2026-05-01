import React, { useCallback } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
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

const NEXT_STATUS: Record<MenuItemStatus, MenuItemStatus> = {
  [MENU_ITEM_STATUS.Available]: MENU_ITEM_STATUS.OutOfStock,
  [MENU_ITEM_STATUS.OutOfStock]: MENU_ITEM_STATUS.Available,
  [MENU_ITEM_STATUS.Hidden]: MENU_ITEM_STATUS.Available,
};

interface MenuItemRowProps {
  item: MenuItem;
  onToggleStatus: (id: number, status: MenuItemStatus) => void;
  onDelete: (id: number) => void;
}

export function MenuItemRow({ item, onToggleStatus, onDelete }: MenuItemRowProps): React.JSX.Element {
  const statusColour = STATUS_COLOURS[item.status];
  const nextStatus = NEXT_STATUS[item.status];

  const handleToggle = useCallback(() => {
    onToggleStatus(item.id, nextStatus);
  }, [item.id, nextStatus, onToggleStatus]);

  const handleDelete = useCallback(() => {
    onDelete(item.id);
  }, [item.id, onDelete]);

  return (
    <View style={styles.row}>
      {item.photo_url !== null && (
        <Image source={{ uri: item.photo_url }} style={styles.photo} accessibilityLabel={item.name} />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{formatPrice(item.price_cents)}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={[styles.statusBadge, { backgroundColor: statusColour + '22' }]}
          onPress={handleToggle}
          accessibilityLabel={`Toggle status for ${item.name}, currently ${STATUS_LABELS[item.status]}`}
          accessibilityRole="button"
        >
          <Text style={[styles.statusText, { color: statusColour }]}>
            {STATUS_LABELS[item.status]}
          </Text>
        </Pressable>
        <Pressable
          style={styles.deleteButton}
          onPress={handleDelete}
          accessibilityLabel={`Delete menu item ${item.name}`}
          accessibilityRole="button"
        >
          <Text style={styles.deleteText}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
}
