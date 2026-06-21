import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './InvoiceCard.styles';
import { DAILY_INVOICE_STATUS } from '../../../types/enums';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import type { DailyInvoice } from '../../../types/models';

interface Props {
  invoice: DailyInvoice;
}

export function InvoiceCard({ invoice }: Props): React.JSX.Element {
  const isPaid        = invoice.status === DAILY_INVOICE_STATUS.Paid;
  const isProvisional = invoice.is_provisional;

  const dateLabel = new Date(invoice.date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <View style={[styles.card, isProvisional && styles.cardProvisional]}>
      <View style={styles.header}>
        <View>
          {isProvisional && (
            <Text style={styles.provLabel}>TODAY · IN PROGRESS</Text>
          )}
          <Text style={styles.date}>{dateLabel}</Text>
        </View>
        <View style={[styles.statusBadge, isPaid ? styles.statusPaid : styles.statusPending]}>
          <Text style={[styles.statusText, isPaid ? styles.statusTextPaid : styles.statusTextPending]}>
            {isPaid ? '✓ PAID' : 'PENDING'}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatPrice(invoice.payout_cents)}</Text>
          <Text style={styles.statLabel}>Your Payout</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatPrice(invoice.platform_fee_cents)}</Text>
          <Text style={styles.statLabel}>Platform Fee</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatPrice(invoice.customer_total_cents)}</Text>
          <Text style={styles.statLabel}>Customer Total</Text>
        </View>
      </View>

      <Text style={styles.orderCount}>{invoice.order_count} completed orders</Text>

      {isProvisional && (
        <View style={styles.liveDot}>
          <View style={styles.dot} />
          <Text style={styles.liveText}>Live — updates as orders complete</Text>
        </View>
      )}
    </View>
  );
}
