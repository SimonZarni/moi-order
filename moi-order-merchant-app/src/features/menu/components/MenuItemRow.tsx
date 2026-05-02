import React, { useCallback } from 'react';
import { Alert, View, Text, Pressable, Image } from 'react-native';
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
  onToggleStatus: (id: number, status: MenuItemStatus) => void;
  onDelete: (id: number) => void;
}

export function MenuItemRow({ item, onToggleStatus, onDelete }: MenuItemRowProps): React.JSX.Element {
  const statusColour = STATUS_COLOURS[item.status];

  const handleStatusPress = useCallback(() => {
    Alert.alert(
      item.name,
      'Set item status',
      [
        {
          text: 'Available',
          onPress: () => onToggleStatus(item.id, MENU_ITEM_STATUS.Available),
        },
        {
          text: 'Out of Stock',
          onPress: () => onToggleStatus(item.id, MENU_ITEM_STATUS.OutOfStock),
        },
        {
          text: 'Delete Item',
          style: 'destructive',
          onPress: () => onDelete(item.id),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }, [item.id, item.name, onToggleStatus, onDelete]);

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
          onPress={handleStatusPress}
          accessibilityLabel={`Manage ${item.name}, status: ${STATUS_LABELS[item.status]}`}
          accessibilityRole="button"
        >
          <Text style={[styles.statusText, { color: statusColour }]}>
            {STATUS_LABELS[item.status]}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
