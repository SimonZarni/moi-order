import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from './AnalyticsMetrics.styles';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { AnalyticsData, AnalyticsPeriod } from '../../../types/models';

interface AnalyticsMetricsProps {
  period: AnalyticsPeriod;
  analytics: AnalyticsData | undefined;
  pending: number;
  onPendingPress?: () => void;
}

interface MetricTile {
  label: string;
  value: string;
  sub: string;
  accent?: string;
}

export function AnalyticsMetrics({ period, analytics, pending, onPendingPress }: AnalyticsMetricsProps): React.JSX.Element | null {
  const t = useTranslation();
  const today = analytics?.today;
  const week  = analytics?.this_week;
  const month = analytics?.this_month;

  const avgOrder = (month?.order_count ?? 0) > 0
    ? Math.round((month?.revenue_cents ?? 0) / (month?.order_count ?? 1))
    : 0;

  let tiles: MetricTile[] = [];

  if (period === 'today') {
    tiles = [
      ...(pending > 0 ? [{ label: t('analytics_pending_now'), value: String(pending), sub: t('analytics_need_attention'), accent: 'warning' }] : []),
    ];
  } else if (period === 'week') {
    const weekRev    = week?.revenue_cents ?? 0;
    const weekOrders = week?.order_count ?? 0;
    tiles = [
      { label: t('analytics_daily_avg_revenue'), value: formatPrice(weekOrders > 0 ? Math.round(weekRev / 7) : 0), sub: `${Math.round(weekOrders / 7)} ${t('analytics_orders_per_day')}` },
    ];
  } else if (period === 'month') {
    const monthRev    = month?.revenue_cents ?? 0;
    const monthOrders = month?.order_count ?? 0;
    const daysInMonth = new Date().getDate();
    tiles = [
      { label: t('analytics_daily_avg_revenue'), value: formatPrice(daysInMonth > 0 ? Math.round(monthRev / daysInMonth) : 0), sub: `${Math.round(monthOrders / daysInMonth)} ${t('analytics_orders_per_day')}` },
      { label: t('analytics_avg_order_value'),   value: formatPrice(avgOrder), sub: t('analytics_this_month') },
    ];
  } else {
    tiles = [
      { label: t('dashboard_today_revenue'),    value: formatPrice(today?.revenue_cents ?? 0),   sub: `${today?.order_count ?? 0} ${t('common_orders')}` },
      { label: t('analytics_week_revenue'),     value: formatPrice(week?.revenue_cents ?? 0),    sub: `${week?.order_count ?? 0} ${t('common_orders')}` },
      { label: t('analytics_avg_order_value'),  value: formatPrice(avgOrder),                    sub: t('analytics_this_month') },
      ...(pending > 0 ? [{ label: t('analytics_pending_now'), value: String(pending), sub: t('analytics_need_attention'), accent: 'warning' }] : []),
    ];
  }

  if (tiles.length === 0) return null;

  return (
    <View style={styles.row}>
      {tiles.map((tile) =>
        tile.accent === 'warning' ? (
          <Pressable
            key={tile.label}
            style={[styles.tile, styles.tilePending]}
            onPress={onPendingPress}
            accessibilityRole="button"
            accessibilityLabel={`${tile.value} ${tile.label}`}
          >
            <View style={styles.pendingDot} />
            <Text style={styles.tileValue}>{tile.value}</Text>
            <Text style={styles.tileLabel}>{tile.label}</Text>
            <Text style={styles.tileSub}>{tile.sub}</Text>
          </Pressable>
        ) : (
          <View key={tile.label} style={styles.tile}>
            <Text style={styles.tileValue}>{tile.value}</Text>
            <Text style={styles.tileLabel}>{tile.label}</Text>
            <Text style={styles.tileSub}>{tile.sub}</Text>
          </View>
        ),
      )}
    </View>
  );
}
