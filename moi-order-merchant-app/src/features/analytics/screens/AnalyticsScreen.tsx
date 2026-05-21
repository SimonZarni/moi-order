import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAnalyticsScreen } from '../hooks/useAnalyticsScreen';
import { styles } from './AnalyticsScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import type { PeriodStats } from '../../../types/models';

type Period = 'today' | 'week' | 'month';

const PERIODS: { key: Period; label: string; short: string }[] = [
  { key: 'today', label: 'Today',      short: 'Today' },
  { key: 'week',  label: 'This Week',  short: 'Week' },
  { key: 'month', label: 'This Month', short: 'Month' },
];

export function AnalyticsScreen(): React.JSX.Element {
  const { analytics, isLoading } = useAnalyticsScreen();
  const [activePeriod, setActivePeriod] = useState<Period>('today');

  const maxRevenue = useMemo(() => {
    const values = [
      analytics?.today.revenue_cents ?? 0,
      analytics?.this_week.revenue_cents ?? 0,
      analytics?.this_month.revenue_cents ?? 0,
    ];
    return Math.max(...values, 1);
  }, [analytics]);

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colours.primary} /></View>;
  }

  const activeStat: PeriodStats | undefined =
    activePeriod === 'today'  ? analytics?.today :
    activePeriod === 'week'   ? analytics?.this_week :
    analytics?.this_month;

  const periodRows = [
    { key: 'today' as Period, label: 'Today',      stats: analytics?.today },
    { key: 'week'  as Period, label: 'This Week',  stats: analytics?.this_week },
    { key: 'month' as Period, label: 'This Month', stats: analytics?.this_month },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Dark hero ── */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Analytics</Text>
            <Text style={styles.headerSub}>Revenue & performance</Text>
          </View>
          {(analytics?.pending_count ?? 0) > 0 && (
            <View style={styles.pendingChip}>
              <View style={styles.pendingDot} />
              <Text style={styles.pendingChipText}>{analytics?.pending_count} pending</Text>
            </View>
          )}
        </View>

        {/* ── Period selector tabs ── */}
        <View style={styles.periodSelector}>
          {PERIODS.map((p) => (
            <Pressable
              key={p.key}
              style={[styles.periodTab, activePeriod === p.key && styles.periodTabActive]}
              onPress={() => setActivePeriod(p.key)}
              accessibilityRole="button"
              accessibilityLabel={p.label}
            >
              <Text style={[styles.periodTabText, activePeriod === p.key && styles.periodTabTextActive]}>
                {p.short}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Hero metric for selected period ── */}
        <View style={styles.heroMetricCard}>
          <Text style={styles.heroMetricLabel}>{PERIODS.find((p) => p.key === activePeriod)?.label} Revenue</Text>
          <Text style={styles.heroMetricValue}>{formatPrice(activeStat?.revenue_cents ?? 0)}</Text>
          <View style={styles.heroMetricRow}>
            <View style={styles.heroMetricItem}>
              <Ionicons name="receipt-outline" size={14} color={colours.primary} />
              <Text style={styles.heroMetricItemText}>{activeStat?.order_count ?? 0} orders</Text>
            </View>
          </View>
        </View>

        {/* ── Revenue comparison bars ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Revenue Comparison</Text>
          </View>
          {periodRows.map(({ key, label, stats }, idx) => {
            const fillRatio = (stats?.revenue_cents ?? 0) / maxRevenue;
            const isActive = activePeriod === key;
            return (
              <Pressable
                key={key}
                style={[styles.periodRow, idx === periodRows.length - 1 && styles.periodLastRow]}
                onPress={() => setActivePeriod(key)}
                accessibilityRole="button"
              >
                <View style={styles.periodHeader}>
                  <Text style={[styles.periodLabel, isActive && styles.periodLabelActive]}>{label}</Text>
                  <Text style={[styles.periodRevenue, isActive && styles.periodRevenueActive]}>
                    {formatPrice(stats?.revenue_cents ?? 0)}
                  </Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${Math.round(fillRatio * 100)}%` }, isActive && styles.barFillActive]} />
                </View>
                <Text style={styles.periodMeta}>{stats?.order_count ?? 0} orders</Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── Orders summary ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Orders Summary</Text>
          </View>
          <View style={styles.summaryGrid}>
            {periodRows.map(({ key, label, stats }, idx) => (
              <View key={key} style={[styles.summaryItem, idx === periodRows.length - 1 && styles.summaryItemLast]}>
                <Text style={styles.summaryValue}>{stats?.order_count ?? 0}</Text>
                <Text style={styles.summaryLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
