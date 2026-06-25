import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './KpiCards.styles';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { AnalyticsData } from '../../../types/models';

interface KpiCardsProps {
  analytics: AnalyticsData | undefined;
}

interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
}

function KpiCard({ label, value, sub }: KpiCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardSub}>{sub}</Text>
    </View>
  );
}

export function KpiCards({ analytics }: KpiCardsProps): React.JSX.Element {
  const t = useTranslation();

  const weekRevenue  = analytics?.this_week.revenue_cents ?? 0;
  const weekOrders   = analytics?.this_week.order_count ?? 0;
  const monthRevenue = analytics?.this_month.revenue_cents ?? 0;
  const monthOrders  = analytics?.this_month.order_count ?? 0;
  const avgOrder     = monthOrders > 0 ? Math.round(monthRevenue / monthOrders) : 0;

  return (
    <View style={styles.row}>
      <KpiCard
        label={t('dashboard_this_week')}
        value={formatPrice(weekRevenue)}
        sub={`${weekOrders} ${t('dashboard_orders_count')}`}
      />
      <KpiCard
        label={t('dashboard_this_month')}
        value={formatPrice(monthRevenue)}
        sub={`${monthOrders} ${t('dashboard_orders_count')}`}
      />
      <KpiCard
        label={t('dashboard_avg_order_value')}
        value={formatPrice(avgOrder)}
        sub="per order"
      />
    </View>
  );
}
