import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalyticsScreen } from '../hooks/useAnalyticsScreen';
import { styles } from './AnalyticsScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';

type Period = 'today' | 'week' | 'month';

const TABS: { key: Period; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week',  label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

export function AnalyticsScreen(): React.JSX.Element {
  const { analytics, isLoading } = useAnalyticsScreen();
  const [period, setPeriod] = useState<Period>('today');

  const maxRevenue = useMemo(() => Math.max(
    analytics?.today.revenue_cents ?? 0,
    analytics?.this_week.revenue_cents ?? 0,
    analytics?.this_month.revenue_cents ?? 0,
    1,
  ), [analytics]);

  const pending = analytics?.pending_count ?? 0;

  const avgOrderValue = analytics?.this_month.order_count
    ? Math.round((analytics.this_month.revenue_cents ?? 0) / analytics.this_month.order_count)
    : 0;

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colours.primary} /></View>;
  }

  const featured = period === 'today' ? analytics?.today : period === 'week' ? analytics?.this_week : analytics?.this_month;
  const featuredLabel = TABS.find((t) => t.key === period)?.label ?? 'Today';
  const hasData = (featured?.revenue_cents ?? 0) > 0;

  const rows = [
    { key: 'today' as Period, label: 'Today',      stats: analytics?.today },
    { key: 'week'  as Period, label: 'This Week',  stats: analytics?.this_week },
    { key: 'month' as Period, label: 'This Month', stats: analytics?.this_month },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Page header */}
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
        {/* Period tabs */}
        <View style={styles.tabsRow}>
          {TABS.map((t) => (
            <Pressable
              key={t.key}
              style={[styles.tab, period === t.key && styles.tabActive]}
              onPress={() => setPeriod(t.key)}
              accessibilityRole="button"
            >
              <Text style={[styles.tabText, period === t.key && styles.tabTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Featured revenue card */}
        <View style={styles.featuredCard}>
          <View style={styles.featuredHeader}>
            <Text style={styles.featuredLabel}>{featuredLabel.toUpperCase()}'S REVENUE</Text>
            {!hasData && (
              <View style={styles.noDataChip}>
                <Text style={styles.noDataChipText}>No data yet</Text>
              </View>
            )}
          </View>
          <Text style={[styles.featuredAmount, !hasData && styles.featuredAmountMuted]}>
            {formatPrice(featured?.revenue_cents ?? 0)}
          </Text>
          <Text style={styles.featuredOrders}>{featured?.order_count ?? 0} orders</Text>
        </View>

        {/* 4 mini stat cards */}
        <View style={styles.miniGrid}>
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>TODAY</Text>
            <Text style={styles.miniValue}>{formatPrice(analytics?.today.revenue_cents ?? 0)}</Text>
            <Text style={styles.miniSub}>{analytics?.today.order_count ?? 0} orders</Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>THIS WEEK</Text>
            <Text style={styles.miniValue}>{formatPrice(analytics?.this_week.revenue_cents ?? 0)}</Text>
            <Text style={styles.miniSub}>{analytics?.this_week.order_count ?? 0} orders</Text>
          </View>
          <View style={[styles.miniCard, (analytics?.this_month.revenue_cents ?? 0) > 0 && styles.miniCardActive]}>
            <Text style={styles.miniLabel}>THIS MONTH</Text>
            <Text style={[styles.miniValue, (analytics?.this_month.revenue_cents ?? 0) > 0 && styles.miniValueActive]}>
              {formatPrice(analytics?.this_month.revenue_cents ?? 0)}
            </Text>
            {(analytics?.this_month.revenue_cents ?? 0) > 0 && <Text style={styles.miniActiveTag}>Active</Text>}
            {(analytics?.this_month.revenue_cents ?? 0) === 0 && <Text style={styles.miniSub}>{analytics?.this_month.order_count ?? 0} orders</Text>}
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>AVG ORDER VALUE</Text>
            <Text style={[styles.miniValue, avgOrderValue > 0 && styles.miniValueActive]}>
              {formatPrice(avgOrderValue)}
            </Text>
            <Text style={styles.miniSub}>{analytics?.this_month.order_count ?? 0} orders total</Text>
          </View>
        </View>

        {/* Revenue breakdown */}
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.breakdownTitle}>REVENUE BREAKDOWN</Text>
            <Text style={styles.breakdownMonth}>
              {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </Text>
          </View>
          {rows.map(({ key, label, stats }, idx) => {
            const ratio = (stats?.revenue_cents ?? 0) / maxRevenue;
            const hasValue = (stats?.revenue_cents ?? 0) > 0;
            return (
              <View key={key} style={[styles.breakdownRow, idx < rows.length - 1 && styles.breakdownRowBorder]}>
                <View style={styles.breakdownRowTop}>
                  <Text style={styles.breakdownLabel}>{label}</Text>
                  <Text style={[styles.breakdownAmount, hasValue && styles.breakdownAmountActive]}>
                    {formatPrice(stats?.revenue_cents ?? 0)}
                  </Text>
                </View>
                <View style={styles.breakdownBar}>
                  {hasValue && (
                    <View style={[styles.breakdownBarFill, { width: `${Math.round(ratio * 100)}%` }]} />
                  )}
                </View>
                <Text style={styles.breakdownMeta}>{stats?.order_count ?? 0} orders</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
