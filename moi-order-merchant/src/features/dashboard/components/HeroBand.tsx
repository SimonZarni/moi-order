import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './HeroBand.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { AnalyticsData } from '../../../types/models';

interface HeroBandProps {
  analytics: AnalyticsData | undefined;
}

const BAR_MAX_H = 52;

export function HeroBand({ analytics }: HeroBandProps): React.JSX.Element {
  const t = useTranslation();

  const todayRevenue  = analytics?.today.revenue_cents ?? 0;
  const todayOrders   = analytics?.today.order_count ?? 0;
  const weekRevenue   = analytics?.this_week.revenue_cents ?? 0;
  const monthRevenue  = analytics?.this_month.revenue_cents ?? 0;
  const weekDailyAvg  = weekRevenue / 7;
  const monthDailyAvg = monthRevenue / 30;
  const maxVal        = Math.max(todayRevenue, weekDailyAvg, monthDailyAvg, 1);

  const todayH  = Math.max(6, Math.round((todayRevenue / maxVal) * BAR_MAX_H));
  const weekH   = Math.max(6, Math.round((weekDailyAvg / maxVal) * BAR_MAX_H));
  const monthH  = Math.max(6, Math.round((monthDailyAvg / maxVal) * BAR_MAX_H));

  const trendUp   = todayRevenue > weekDailyAvg * 1.05;
  const trendDown = todayRevenue < weekDailyAvg * 0.95;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.left}>
          <Text style={styles.label}>{t('dashboard_today_revenue')}</Text>
          <Text style={styles.amount}>{formatPrice(todayRevenue)}</Text>
          <View style={styles.subRow}>
            <Text style={styles.sub}>{todayOrders} {t('dashboard_orders_count')}</Text>
            {(trendUp || trendDown) && (
              <View style={styles.trendChip}>
                <Ionicons
                  name={trendUp ? 'trending-up' : 'trending-down'}
                  size={13}
                  color={trendUp ? colours.primary : colours.error}
                />
                <Text style={[styles.trendText, trendDown && styles.trendTextDown]}>
                  {trendUp ? 'above' : 'below'} avg
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.barsWrap}>
          <View style={styles.bars}>
            <View style={styles.barCol}>
              <View style={[styles.bar, styles.barToday, { height: todayH }]} />
              <Text style={styles.barLabel}>Today</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.bar, styles.barWeek, { height: weekH }]} />
              <Text style={styles.barLabel}>7d avg</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.bar, styles.barMonth, { height: monthH }]} />
              <Text style={styles.barLabel}>30d</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
