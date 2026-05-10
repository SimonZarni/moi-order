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
  onRemove: (cartKey: string) => void;
}

export function MenuItemRow({ item, quantity, onAdd, onRemove }: Props): React.JSX.Element {
  const isUnavailable = item.status === MENU_ITEM_STATUS.Unavailable;
  const hasOptions = item.option_groups.length > 0;

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
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(item.price_cents / 100)}</Text>
          {hasOptions && <Text style={styles.customizeHint}>Customizable</Text>}
        </View>
        {isUnavailable && <Text style={styles.unavailableLabel}>Unavailable</Text>}
      </View>

      {!isUnavailable && (
        <View style={styles.controls}>
          {/* Items without options: show −/qty/+ inline. Items with options: show qty badge + + only. */}
          {quantity > 0 && !hasOptions && (
            <>
              <Pressable
                style={[styles.controlBtn, styles.controlBtnMinus]}
                onPress={() => onRemove(`${item.id}:`)}
                accessibilityRole="button"
                accessibilityLabel={`Remove one ${item.name}`}
              >
                <Text style={[styles.controlBtnText, styles.controlBtnTextMinus]}>−</Text>
              </Pressable>
              <Text style={styles.quantity}>{quantity}</Text>
            </>
          )}
          {quantity > 0 && hasOptions && (
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityBadgeText}>{quantity}</Text>
            </View>
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
