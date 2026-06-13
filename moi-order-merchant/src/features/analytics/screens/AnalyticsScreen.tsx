import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalyticsScreen, PERIODS } from '../hooks/useAnalyticsScreen';
import { BarChart, type BarChartBar } from '../components/BarChart';
import { TimeSeriesChart } from '../components/TimeSeriesChart';
import { StatCard } from '../components/StatCard';
import { styles } from './AnalyticsScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { AnalyticsPeriod } from '../../../types/models';

export function AnalyticsScreen(): React.JSX.Element {
  const t = useTranslation();
  const {
    period, analytics, chartData, isLoading, isChartLoading,
    handlePeriodChange,
  } = useAnalyticsScreen();

  const PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
    all:   t('analytics_all'),
    today: t('analytics_today'),
    week:  t('analytics_week'),
    month: t('analytics_month'),
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  const pending = analytics?.pending_count ?? 0;
  const today   = analytics?.today;
  const week    = analytics?.this_week;
  const month   = analytics?.this_month;

  const avgOrderCents = (month?.order_count ?? 0) > 0
    ? Math.round((month?.revenue_cents ?? 0) / (month?.order_count ?? 1))
    : 0;

  // ── KPI cards — vary by active period ────────────────────────────────────
  const kpiCards = ((): React.JSX.Element => {
    if (period === 'today') return (
      <View style={styles.kpiRow}>
        <StatCard label={t('analytics_revenue')} value={formatPrice(today?.revenue_cents ?? 0)}
          sub={`${today?.order_count ?? 0} ${t('common_orders')}`} accent={colours.primary} highlight />
        {pending > 0 && (
          <StatCard label={t('analytics_pending_now')} value={String(pending)}
            sub={t('analytics_need_attention')} accent={colours.warning} />
        )}
      </View>
    );
    if (period === 'week') return (
      <View style={styles.kpiRow}>
        <StatCard label={t('analytics_week_revenue')} value={formatPrice(week?.revenue_cents ?? 0)}
          sub={`${week?.order_count ?? 0} ${t('common_orders')}`} accent={colours.primary} highlight />
      </View>
    );
    if (period === 'month') return (
      <View style={styles.kpiRow}>
        <StatCard label={t('analytics_month_revenue')} value={formatPrice(month?.revenue_cents ?? 0)}
          sub={`${month?.order_count ?? 0} ${t('common_orders')}`} accent={colours.primary} highlight />
        <StatCard label={t('analytics_avg_order_value')} value={formatPrice(avgOrderCents)}
          sub={t('analytics_this_month')} accent={colours.success} />
      </View>
    );
    // 'all' — show all three + pending
    const revenueBars: BarChartBar[] = [
      { label: 'Today',      sublabel: `${today?.order_count ?? 0} orders`,  value: today?.revenue_cents ?? 0,  valueLabel: formatPrice(today?.revenue_cents ?? 0),  colour: colours.primary + 'AA' },
      { label: 'This Week',  sublabel: `${week?.order_count ?? 0} orders`,   value: week?.revenue_cents ?? 0,   valueLabel: formatPrice(week?.revenue_cents ?? 0),   colour: colours.primary + 'CC' },
      { label: 'This Month', sublabel: `${month?.order_count ?? 0} orders`,  value: month?.revenue_cents ?? 0,  valueLabel: formatPrice(month?.revenue_cents ?? 0),  colour: colours.primary },
    ];
    const orderBars: BarChartBar[] = [
      { label: 'Today',      sublabel: formatPrice(today?.revenue_cents ?? 0), value: today?.order_count ?? 0,  valueLabel: String(today?.order_count ?? 0),  colour: colours.success + 'AA' },
      { label: 'This Week',  sublabel: formatPrice(week?.revenue_cents ?? 0),  value: week?.order_count ?? 0,   valueLabel: String(week?.order_count ?? 0),   colour: colours.success + 'CC' },
      { label: 'This Month', sublabel: formatPrice(month?.revenue_cents ?? 0), value: month?.order_count ?? 0,  valueLabel: String(month?.order_count ?? 0),  colour: colours.success },
    ];
    return (
      <>
        <View style={styles.kpiRow}>
          <StatCard label={t('dashboard_today_revenue')} value={formatPrice(today?.revenue_cents ?? 0)} sub={`${today?.order_count ?? 0} ${t('common_orders')}`} accent={colours.primary} />
          <StatCard label={t('analytics_this_month')} value={formatPrice(month?.revenue_cents ?? 0)} sub={`${month?.order_count ?? 0} ${t('common_orders')}`} accent={colours.primary} highlight />
          <StatCard label={t('analytics_avg_order_value')} value={formatPrice(avgOrderCents)} sub={t('analytics_this_month')} accent={colours.success} />
          {pending > 0 && <StatCard label={t('analytics_pending_now')} value={String(pending)} sub={t('analytics_need_attention')} accent={colours.warning} />}
        </View>
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={[styles.chartDot, { backgroundColor: colours.primary }]} />
            <Text style={styles.chartTitle}>Revenue</Text>
            <Text style={styles.chartSub}>Today / Week / Month</Text>
          </View>
          <BarChart bars={revenueBars} trackHeight={130} emptyMessage="No revenue data yet" />
        </View>
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={[styles.chartDot, { backgroundColor: colours.success }]} />
            <Text style={styles.chartTitle}>Order Volume</Text>
            <Text style={styles.chartSub}>Today / Week / Month</Text>
          </View>
          <BarChart bars={orderBars} trackHeight={130} emptyMessage="No orders yet" />
        </View>
        <ComparisonTable today={today} week={week} month={month} />
      </>
    );
  })();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.pageHeader}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>PERFORMANCE</Text>
            <Text style={styles.pageTitle}>Analytics</Text>
          </View>
          {pending > 0 && (
            <View style={styles.pendingPill}>
              <View style={styles.pendingDot} />
              <Text style={styles.pendingText}>{pending} pending</Text>
            </View>
          )}
        </View>
        {/* Period filter */}
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <Pressable
              key={p}
              style={({ pressed }) => [
                styles.periodTab,
                period === p && styles.periodTabActive,
                pressed && styles.periodTabPressed,
              ]}
              onPress={() => handlePeriodChange(p)}
              accessibilityRole="button"
              accessibilityLabel={PERIOD_LABELS[p]}
            >
              <Text style={[styles.periodTabText, period === p && styles.periodTabTextActive]}>
                {PERIOD_LABELS[p]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {kpiCards}
        {period !== 'all' && (
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View style={[styles.chartDot, { backgroundColor: colours.primary }]} />
              <Text style={styles.chartTitle}>
                {period === 'today' ? 'Hourly Breakdown' : period === 'week' ? 'Daily – Last 7 Days' : 'Daily – Last 30 Days'}
              </Text>
            </View>
            {isChartLoading ? (
              <ActivityIndicator size="small" color={colours.primary} />
            ) : (
              <TimeSeriesChart
                points={chartData?.points ?? []}
                trackHeight={110}
                emptyMessage="No data for this period yet"
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-component: comparison table (only shown in 'all' view) ────────────────

interface ComparisonTableProps {
  today:  { order_count: number; revenue_cents: number } | undefined;
  week:   { order_count: number; revenue_cents: number } | undefined;
  month:  { order_count: number; revenue_cents: number } | undefined;
}

function ComparisonTable({ today, week, month }: ComparisonTableProps): React.JSX.Element {
  return (
    <View style={styles.tableCard}>
      <View style={styles.tableHeaderRow}>
        <Text style={styles.tableTitle}>Period Comparison</Text>
      </View>
      <TableRow label="Period" valueA="Revenue" valueB="Orders" isHead />
      <TableRow label="Today"      valueA={formatPrice(today?.revenue_cents ?? 0)}  valueB={String(today?.order_count ?? 0)} />
      <TableRow label="This Week"  valueA={formatPrice(week?.revenue_cents ?? 0)}   valueB={String(week?.order_count ?? 0)} />
      <TableRow label="This Month" valueA={formatPrice(month?.revenue_cents ?? 0)}  valueB={String(month?.order_count ?? 0)} isLast />
    </View>
  );
}

interface TableRowProps {
  label: string; valueA: string; valueB: string; isHead?: boolean; isLast?: boolean;
}
function TableRow({ label, valueA, valueB, isHead = false, isLast = false }: TableRowProps): React.JSX.Element {
  return (
    <View style={[styles.tableRow, !isLast && styles.tableRowBorder, isHead && styles.tableRowHead]}>
      <Text style={[styles.tableCell, styles.tableCellLabel, isHead && styles.tableCellHead]}>{label}</Text>
      <Text style={[styles.tableCell, isHead && styles.tableCellHead]}>{valueA}</Text>
      <Text style={[styles.tableCell, styles.tableCellRight, isHead && styles.tableCellHead]}>{valueB}</Text>
    </View>
  );
}
