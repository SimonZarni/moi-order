import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { styles } from './CartBar.styles';

interface Props {
  itemCount: number;
  totalCents: number;
  onPress: () => void;
}

export function CartBar({ itemCount, totalCents, onPress }: Props): React.JSX.Element | null {
  if (itemCount === 0) return null;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.btn}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`View cart, ${itemCount} items, total ${formatPrice(totalCents / 100)}`}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemCount}</Text>
        </View>
        <Text style={styles.label}>View Cart</Text>
        <Text style={styles.total}>{formatPrice(totalCents / 100)}</Text>
      </Pressable>
    </View>
  );
}
