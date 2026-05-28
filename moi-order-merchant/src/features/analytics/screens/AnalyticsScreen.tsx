import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalyticsScreen } from '../hooks/useAnalyticsScreen';
import { BarChart, type BarChartBar } from '../components/BarChart';
import { styles } from './AnalyticsScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';

export function AnalyticsScreen(): React.JSX.Element {
  const { analytics, isLoading } = useAnalyticsScreen();

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colours.primary} /></View>;
  }

  const today     = analytics?.today;
  const week      = analytics?.this_week;
  const month     = analytics?.this_month;
  const pending   = analytics?.pending_count ?? 0;

  const avgOrderCents = (month?.order_count ?? 0) > 0
    ? Math.round((month?.revenue_cents ?? 0) / (month?.order_count ?? 1))
    : 0;

  const revenueBars: BarChartBar[] = [
    {
      label:      'Today',
      sublabel:   `${today?.order_count ?? 0} orders`,
      value:      today?.revenue_cents ?? 0,
      valueLabel: formatPrice(today?.revenue_cents ?? 0),
      colour:     colours.primary + 'AA',
    },
    {
      label:      'This Week',
      sublabel:   `${week?.order_count ?? 0} orders`,
      value:      week?.revenue_cents ?? 0,
      valueLabel: formatPrice(week?.revenue_cents ?? 0),
      colour:     colours.primary + 'CC',
    },
    {
      label:      'This Month',
      sublabel:   `${month?.order_count ?? 0} orders`,
      value:      month?.revenue_cents ?? 0,
      valueLabel: formatPrice(month?.revenue_cents ?? 0),
      colour:     colours.primary,
    },
  ];

  const orderBars: BarChartBar[] = [
    {
      label:      'Today',
      sublabel:   formatPrice(today?.revenue_cents ?? 0),
      value:      today?.order_count ?? 0,
      valueLabel: String(today?.order_count ?? 0),
      colour:     colours.success + 'AA',
    },
    {
      label:      'This Week',
      sublabel:   formatPrice(week?.revenue_cents ?? 0),
      value:      week?.order_count ?? 0,
      valueLabel: String(week?.order_count ?? 0),
      colour:     colours.success + 'CC',
    },
    {
      label:      'This Month',
      sublabel:   formatPrice(month?.revenue_cents ?? 0),
      value:      month?.order_count ?? 0,
      valueLabel: String(month?.order_count ?? 0),
      colour:     colours.success,
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.pageHeader}>
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

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── KPI row ──────────────────────────────────────────────────────── */}
        <View style={styles.kpiRow}>
          <StatCard
            label="Today's Revenue"
            value={formatPrice(today?.revenue_cents ?? 0)}
            sub={`${today?.order_count ?? 0} orders`}
            accent={colours.primary}
          />
          <StatCard
            label="This Month"
            value={formatPrice(month?.revenue_cents ?? 0)}
            sub={`${month?.order_count ?? 0} orders`}
            accent={colours.primary}
            highlight
          />
          <StatCard
            label="Avg Order Value"
            value={formatPrice(avgOrderCents)}
            sub="this month"
            accent={colours.success}
          />
          {pending > 0 && (
            <StatCard
              label="Pending Now"
              value={String(pending)}
              sub="need attention"
              accent={colours.warning}
            />
          )}
        </View>

        {/* ── Revenue chart ─────────────────────────────────────────────────── */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={[styles.chartDot, { backgroundColor: colours.primary }]} />
            <Text style={styles.chartTitle}>Revenue</Text>
            <Text style={styles.chartSub}>Today / Week / Month</Text>
          </View>
          <BarChart
            bars={revenueBars}
            trackHeight={130}
            emptyMessage="No revenue data yet"
          />
        </View>

        {/* ── Orders chart ──────────────────────────────────────────────────── */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={[styles.chartDot, { backgroundColor: colours.success }]} />
            <Text style={styles.chartTitle}>Order Volume</Text>
            <Text style={styles.chartSub}>Today / Week / Month</Text>
          </View>
          <BarChart
            bars={orderBars}
            trackHeight={130}
            emptyMessage="No orders yet"
          />
        </View>

        {/* ── Period comparison table ───────────────────────────────────────── */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableTitle}>Period Comparison</Text>
          </View>
          <TableRow label="Period" valueA="Revenue" valueB="Orders" isHead />
          <TableRow label="Today"      valueA={formatPrice(today?.revenue_cents ?? 0)}  valueB={String(today?.order_count ?? 0)} />
          <TableRow label="This Week"  valueA={formatPrice(week?.revenue_cents ?? 0)}   valueB={String(week?.order_count ?? 0)} />
          <TableRow label="This Month" valueA={formatPrice(month?.revenue_cents ?? 0)}  valueB={String(month?.order_count ?? 0)} isLast />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  accent: string;
  highlight?: boolean;
}

function StatCard({ label, value, sub, accent, highlight = false }: StatCardProps): React.JSX.Element {
  return (
    <View style={[styles.statCard, highlight && styles.statCardHighlight]}>
      <View style={[styles.statAccent, { backgroundColor: accent + '22', borderColor: accent + '44' }]}>
        <View style={[styles.statAccentDot, { backgroundColor: accent }]} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: highlight ? accent : colours.textOnLight }]}>{value}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}

interface TableRowProps {
  label: string;
  valueA: string;
  valueB: string;
  isHead?: boolean;
  isLast?: boolean;
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
