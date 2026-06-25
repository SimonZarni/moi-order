import React from 'react';
import { View, Text } from 'react-native';
import { BarChart, type BarChartBar } from './BarChart';
import { styles } from './AnalyticsComparison.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { AnalyticsData } from '../../../types/models';

interface AnalyticsComparisonProps {
  analytics: AnalyticsData | undefined;
}

export function AnalyticsComparison({ analytics }: AnalyticsComparisonProps): React.JSX.Element {
  const t = useTranslation();

  const today = analytics?.today;
  const week  = analytics?.this_week;
  const month = analytics?.this_month;

  const ordersLabel = t('common_orders');
  const periodToday = t('analytics_today');
  const periodWeek  = t('analytics_week');
  const periodMonth = t('analytics_month');

  const revenueBars: BarChartBar[] = [
    { label: periodToday, sublabel: `${today?.order_count ?? 0} ${ordersLabel}`,  value: today?.revenue_cents ?? 0,  valueLabel: formatPrice(today?.revenue_cents ?? 0),  colour: colours.primary + 'AA' },
    { label: periodWeek,  sublabel: `${week?.order_count ?? 0} ${ordersLabel}`,   value: week?.revenue_cents ?? 0,   valueLabel: formatPrice(week?.revenue_cents ?? 0),   colour: colours.primary + 'CC' },
    { label: periodMonth, sublabel: `${month?.order_count ?? 0} ${ordersLabel}`,  value: month?.revenue_cents ?? 0,  valueLabel: formatPrice(month?.revenue_cents ?? 0),  colour: colours.primary },
  ];

  const orderBars: BarChartBar[] = [
    { label: periodToday, sublabel: formatPrice(today?.revenue_cents ?? 0),  value: today?.order_count ?? 0,  valueLabel: String(today?.order_count ?? 0),  colour: colours.success + 'AA' },
    { label: periodWeek,  sublabel: formatPrice(week?.revenue_cents ?? 0),   value: week?.order_count ?? 0,   valueLabel: String(week?.order_count ?? 0),   colour: colours.success + 'CC' },
    { label: periodMonth, sublabel: formatPrice(month?.revenue_cents ?? 0),  value: month?.order_count ?? 0,  valueLabel: String(month?.order_count ?? 0),  colour: colours.success },
  ];

  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.dot, { backgroundColor: colours.primary }]} />
          <Text style={styles.cardTitle}>{t('analytics_chart_revenue')}</Text>
          <Text style={styles.cardSub}>{t('analytics_chart_sub_today_week_month')}</Text>
        </View>
        <BarChart bars={revenueBars} trackHeight={130} emptyMessage={t('analytics_no_revenue')} />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.dot, { backgroundColor: colours.success }]} />
          <Text style={styles.cardTitle}>{t('analytics_chart_orders')}</Text>
          <Text style={styles.cardSub}>{t('analytics_chart_sub_today_week_month')}</Text>
        </View>
        <BarChart bars={orderBars} trackHeight={130} emptyMessage={t('analytics_no_orders')} />
      </View>

      <View style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableTitle}>{t('analytics_comparison_title')}</Text>
        </View>
        <CompRow label={t('analytics_col_period')} valA={t('analytics_col_revenue')} valB={t('analytics_col_orders')} isHead />
        <CompRow label={periodToday} valA={formatPrice(today?.revenue_cents ?? 0)} valB={String(today?.order_count ?? 0)} />
        <CompRow label={periodWeek}  valA={formatPrice(week?.revenue_cents ?? 0)}  valB={String(week?.order_count ?? 0)} />
        <CompRow label={periodMonth} valA={formatPrice(month?.revenue_cents ?? 0)} valB={String(month?.order_count ?? 0)} isLast />
      </View>
    </>
  );
}

interface CompRowProps { label: string; valA: string; valB: string; isHead?: boolean; isLast?: boolean; }
function CompRow({ label, valA, valB, isHead = false, isLast = false }: CompRowProps): React.JSX.Element {
  return (
    <View style={[styles.tableRow, !isLast && styles.tableRowBorder, isHead && styles.tableRowHead]}>
      <Text style={[styles.cell, styles.cellLabel, isHead && styles.cellHead]}>{label}</Text>
      <Text style={[styles.cell, isHead && styles.cellHead]}>{valA}</Text>
      <Text style={[styles.cell, styles.cellRight, isHead && styles.cellHead]}>{valB}</Text>
    </View>
  );
}
