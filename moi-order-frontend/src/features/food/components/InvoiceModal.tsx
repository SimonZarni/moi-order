import React, { useRef } from 'react';
import { Modal, PanResponder, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { FOOD_PAYMENT_METHOD } from '@/types/enums';
import { FoodOrder, FoodOrderItem } from '@/types/models';
import { styles } from './InvoiceModal.styles';

interface Props {
  order: FoodOrder;
  visible: boolean;
  onClose: () => void;
}

const PAYMENT_LABEL: Record<string, string> = {
  [FOOD_PAYMENT_METHOD.Cod]:       'Cash on Delivery',
  [FOOD_PAYMENT_METHOD.LinePay]: 'LINE Pay',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

interface ItemLineProps { item: FoodOrderItem }
function ItemLine({ item }: ItemLineProps): React.JSX.Element {
  return (
    <View style={styles.itemRow}>
      <Text style={[styles.itemName, styles.colName]} numberOfLines={2}>{item.name}</Text>
      <Text style={[styles.itemQty,  styles.colQty]}>{item.quantity}</Text>
      <Text style={[styles.itemPrice, styles.colPrice]}>{formatPrice(item.price_cents / 100)}</Text>
      <Text style={[styles.itemTotal, styles.colTotal]}>{formatPrice(item.subtotal_cents / 100)}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function InvoiceModal({ order, visible, onClose }: Props): React.JSX.Element {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const isPaid = order.payment_confirmed_at !== null || order.payment_method === FOOD_PAYMENT_METHOD.Cod;

  const dragY = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => { dragY.current = gs.dy; },
      onPanResponderRelease: () => {
        if (dragY.current > 60) onClose();
        dragY.current = 0;
      },
    }),
  ).current;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close invoice">
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.dragBarWrapper} {...panResponder.panHandlers}>
            <View style={styles.dragBar} />
          </View>

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Invoice</Text>
            <Pressable style={styles.closeBtn} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close invoice">
              <Ionicons name="close" size={16} color={colours.textOnLight} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.invoice, { paddingBottom: Math.max(bottomInset, 16) + 16 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Title block */}
            <Text style={styles.invoiceTitle}>MOI ORDER</Text>
            <Text style={styles.invoiceSubtitle}>TAX INVOICE / RECEIPT</Text>

            <View style={styles.divider} />

            {/* Order meta */}
            <Text style={styles.sectionHeader}>Order Details</Text>
            <InfoRow label="Order No." value={order.order_number ?? `#${order.id}`} />
            <InfoRow label="Date" value={formatDate(order.created_at)} />
            <InfoRow label="Restaurant" value={order.restaurant_name ?? '—'} />
            <InfoRow label="Payment" value={PAYMENT_LABEL[order.payment_method] ?? order.payment_method} />
            {order.delivery_address ? (
              <InfoRow label="Deliver To" value={order.delivery_address} />
            ) : null}

            <View style={styles.divider} />

            {/* Line items */}
            <Text style={styles.sectionHeader}>Items</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colName]}>Item</Text>
              <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
              <Text style={[styles.tableHeaderText, styles.colPrice]}>Price</Text>
              <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
            </View>

            {(order.items ?? []).map((item) => (
              <ItemLine key={item.id} item={item} />
            ))}

            {/* Totals */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatPrice(order.subtotal_cents / 100)}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>{formatPrice(order.total_cents / 100)}</Text>
            </View>

            {/* Paid badge */}
            {isPaid && (
              <View style={styles.paidBadge}>
                <Text style={styles.paidBadgeText}>PAID</Text>
              </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerLogo}>MOI ORDER</Text>
              <Text style={styles.footerSub}>Thank you for your order!</Text>
              <Text style={styles.footerSub}>hello@moiorder.com</Text>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
