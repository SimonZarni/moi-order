import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { MenuItem } from '@/types/models';
import { MENU_ITEM_STATUS } from '@/types/enums';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { useStrings } from '@/shared/i18n';
import { styles } from './MenuItemRow.styles';

interface Props {
  item:            MenuItem;
  quantity:        number;
  useStockSystem?: boolean;
  onAdd:           (item: MenuItem) => void;
  onRemove:        (cartKey: string) => void;
  onPress:         (item: MenuItem) => void;
}

export function MenuItemRow({ item, quantity, useStockSystem = false, onAdd, onRemove, onPress }: Props): React.JSX.Element {
  const s = useStrings();

  const stockOutOfStock  = useStockSystem && item.stock_quantity !== null && item.stock_quantity === 0;
  const isUnavailable    = item.status === MENU_ITEM_STATUS.OutOfStock || stockOutOfStock;
  const hasOptions       = item.option_groups.length > 0;
  const isDiscounted     = item.original_price_cents !== null && item.original_price_cents > item.price_cents;
  const showStockWarning = useStockSystem && item.stock_quantity !== null && item.stock_quantity > 0 && item.stock_quantity <= 10;

  return (
    <Pressable
      style={[styles.row, isUnavailable && styles.unavailable]}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${item.name}`}
    >
      {item.photo_url !== null && (
        <Image source={{ uri: item.photo_url }} style={styles.photo} contentFit="cover" transition={200} />
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        {item.description !== null && (
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        )}
        <View style={styles.priceRow}>
          {isDiscounted && (
            <Text style={styles.originalPrice}>{formatPrice(item.original_price_cents! / 100)}</Text>
          )}
          <Text style={styles.price}>{formatPrice(item.price_cents / 100)}</Text>
          {hasOptions && <Text style={styles.customizeHint}>{s.restaurant.customizable}</Text>}
        </View>
        {isUnavailable && <Text style={styles.unavailableLabel}>{s.restaurant.unavailable}</Text>}
        {showStockWarning && (
          <Text style={styles.stockWarning}>Only {item.stock_quantity} left!</Text>
        )}
      </View>

      {!isUnavailable && (
        <View style={styles.controls}>
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
    </Pressable>
  );
}
