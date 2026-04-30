import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { MenuItem } from '@/types/models';
import { MENU_ITEM_STATUS } from '@/types/enums';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { styles } from './MenuItemRow.styles';

interface Props {
  item: MenuItem;
  quantity: number;
  onAdd: (item: MenuItem) => void;
  onRemove: (menuItemId: number) => void;
}

export function MenuItemRow({ item, quantity, onAdd, onRemove }: Props): React.JSX.Element {
  const isUnavailable = item.status === MENU_ITEM_STATUS.Unavailable;

  return (
    <View style={[styles.row, isUnavailable && styles.unavailable]}>
      {item.photo_url !== null && (
        <Image source={{ uri: item.photo_url }} style={styles.photo} contentFit="cover" transition={200} />
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        {item.description !== null && (
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        )}
        <Text style={styles.price}>{formatPrice(item.price_cents / 100)}</Text>
        {isUnavailable && <Text style={styles.unavailableLabel}>Unavailable</Text>}
      </View>

      {!isUnavailable && (
        <View style={styles.controls}>
          {quantity > 0 && (
            <>
              <Pressable
                style={[styles.controlBtn, styles.controlBtnMinus]}
                onPress={() => onRemove(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Remove one ${item.name}`}
              >
                <Text style={[styles.controlBtnText, styles.controlBtnTextMinus]}>−</Text>
              </Pressable>
              <Text style={styles.quantity}>{quantity}</Text>
            </>
          )}
          <Pressable
            style={styles.controlBtn}
            onPress={() => onAdd(item)}
            accessibilityRole="button"
            accessibilityLabel={`Add ${item.name} to cart`}
          >
            <Text style={styles.controlBtnText}>+</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
