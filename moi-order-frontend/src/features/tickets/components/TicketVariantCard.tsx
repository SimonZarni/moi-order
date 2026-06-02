import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { formatPrice } from '@/shared/utils/formatCurrency';
import { TicketVariant } from '@/types/models';
import { PersonTypeSelections } from '../types';
import { styles } from './TicketVariantCard.styles';

interface TicketVariantCardProps {
  variant: TicketVariant;
  selection: PersonTypeSelections[number] | undefined;
  onIncrement: (variantId: number, personType: 'adult' | 'child') => void;
  onDecrement: (variantId: number, personType: 'adult' | 'child') => void;
}

const MAX_PER_VARIANT = 15;

function QtyControl({
  qty,
  label,
  price,
  onInc,
  onDec,
  variantName,
}: {
  qty: number;
  label: string;
  price: number;
  onInc: () => void;
  onDec: () => void;
  variantName: string;
}) {
  return (
    <View style={styles.priceRow}>
      <View style={styles.priceRowLeft}>
        <Text style={styles.personLabel}>{label}</Text>
        <Text style={styles.variantPrice}>{formatPrice(price)}</Text>
      </View>
      <View style={styles.qtyControl}>
        <Pressable
          style={[styles.qtyBtn, qty === 0 && styles.qtyBtnDisabled]}
          onPress={onDec}
          disabled={qty === 0}
          accessibilityLabel={`Decrease ${label.toLowerCase()} quantity for ${variantName}`}
          accessibilityRole="button"
        >
          <Text style={styles.qtyBtnText}>−</Text>
        </Pressable>
        <Text style={styles.qtyValue}>{qty}</Text>
        <Pressable
          style={[styles.qtyBtn, qty >= MAX_PER_VARIANT && styles.qtyBtnDisabled]}
          onPress={onInc}
          disabled={qty >= MAX_PER_VARIANT}
          accessibilityLabel={`Increase ${label.toLowerCase()} quantity for ${variantName}`}
          accessibilityRole="button"
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function TicketVariantCard({
  variant,
  selection,
  onIncrement,
  onDecrement,
}: TicketVariantCardProps): React.JSX.Element {
  const adultQty = selection?.adult ?? 0;
  const childQty = selection?.child ?? 0;
  const hasSplit = variant.child_price != null;

  if (hasSplit) {
    return (
      <View style={styles.card}>
        <View style={styles.headerBlock}>
          <Text style={styles.variantName}>{variant.name}</Text>
          {variant.description !== null && (
            <Text style={styles.variantDesc} numberOfLines={2}>{variant.description}</Text>
          )}
        </View>
        <QtyControl
          qty={adultQty} label="Adult" price={variant.adult_price}
          onInc={() => onIncrement(variant.id, 'adult')}
          onDec={() => onDecrement(variant.id, 'adult')}
          variantName={variant.name}
        />
        <View style={styles.rowDivider} />
        <QtyControl
          qty={childQty} label="Child" price={variant.child_price!}
          onInc={() => onIncrement(variant.id, 'child')}
          onDec={() => onDecrement(variant.id, 'child')}
          variantName={variant.name}
        />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.variantInfo}>
        <Text style={styles.variantName}>{variant.name}</Text>
        {variant.description !== null && (
          <Text style={styles.variantDesc} numberOfLines={2}>{variant.description}</Text>
        )}
        <Text style={styles.variantPrice}>{formatPrice(variant.adult_price)}</Text>
      </View>
      <View style={styles.qtyControl}>
        <Pressable
          style={[styles.qtyBtn, adultQty === 0 && styles.qtyBtnDisabled]}
          onPress={() => onDecrement(variant.id, 'adult')}
          disabled={adultQty === 0}
          accessibilityLabel={`Decrease quantity for ${variant.name}`}
          accessibilityRole="button"
        >
          <Text style={styles.qtyBtnText}>−</Text>
        </Pressable>
        <Text style={styles.qtyValue}>{adultQty}</Text>
        <Pressable
          style={[styles.qtyBtn, adultQty >= MAX_PER_VARIANT && styles.qtyBtnDisabled]}
          onPress={() => onIncrement(variant.id, 'adult')}
          disabled={adultQty >= MAX_PER_VARIANT}
          accessibilityLabel={`Increase quantity for ${variant.name}`}
          accessibilityRole="button"
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}
