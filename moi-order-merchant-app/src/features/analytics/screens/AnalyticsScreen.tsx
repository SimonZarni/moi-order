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

export function AnalyticsScreen(): React.JSX.Element {
  const { analytics, isLoading } = useAnalyticsScreen();
  const [period, setPeriod] = useState<Period>('today');

  const maxRevenue = useMemo(() => Math.max(
    analytics?.today.revenue_cents ?? 0,
    analytics?.this_week.revenue_cents ?? 0,
    analytics?.this_month.revenue_cents ?? 0,
    1,
  ), [analytics]);

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colours.primary} /></View>;
  }

  const featured: PeriodStats | undefined =
    period === 'today' ? analytics?.today :
    period === 'week'  ? analytics?.this_week :
    analytics?.this_month;

  const rows = [
    { key: 'today' as Period, label: 'Today',      stats: analytics?.today },
    { key: 'week'  as Period, label: 'This Week',  stats: analytics?.this_week },
    { key: 'month' as Period, label: 'This Month', stats: analytics?.this_month },
  ];

  const TABS = [
    { key: 'today' as Period, label: 'Today' },
    { key: 'week'  as Period, label: 'Week' },
    { key: 'month' as Period, label: 'Month' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>

        {/* ── Dark header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerEyebrow}>Performance</Text>
            <Text style={styles.headerTitle}>Analytics</Text>
          </View>
          {(analytics?.pending_count ?? 0) > 0 && (
            <View style={styles.pendingChip}>
              <View style={styles.pendingDot} />
              <Text style={styles.pendingChipText}>{analytics?.pending_count} pending</Text>
            </View>
          )}
        </View>

        {/* ── Period tabs (float over header) ── */}
        <View style={styles.periodTabsCard}>
          {TABS.map((t) => (
            <Pressable
              key={t.key}
              style={[styles.periodTab, period === t.key && styles.periodTabActive]}
              onPress={() => setPeriod(t.key)}
              accessibilityRole="button"
            >
              <Text style={[styles.periodTabText, period === t.key && styles.periodTabTextActive]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Big revenue hero ── */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>
            {TABS.find((t) => t.key === period)?.label} Revenue
          </Text>
          <Text style={styles.heroRevenue}>{formatPrice(featured?.revenue_cents ?? 0)}</Text>
          <View style={styles.heroMeta}>
            <View style={styles.heroMetaChip}>
              <Ionicons name="receipt-outline" size={13} color={colours.primary} />
              <Text style={styles.heroMetaText}>{featured?.order_count ?? 0} orders</Text>
            </View>
          </View>
        </View>

        {/* ── Comparison bars ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Revenue Breakdown</Text>
          </View>
          {rows.map(({ key, label, stats }) => {
            const ratio = (stats?.revenue_cents ?? 0) / maxRevenue;
            const active = period === key;
            return (
              <Pressable
                key={key}
                style={[styles.barRow, key === 'month' && styles.barRowLast]}
                onPress={() => setPeriod(key)}
                accessibilityRole="button"
              >
                <View style={styles.barRowTop}>
                  <Text style={[styles.barLabel, active && styles.barLabelActive]}>{label}</Text>
                  <Text style={[styles.barRevenue, active && styles.barRevenueActive]}>
                    {formatPrice(stats?.revenue_cents ?? 0)}
                  </Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${Math.round(ratio * 100)}%` }, active && styles.barFillActive]} />
                </View>
                <Text style={styles.barMeta}>{stats?.order_count ?? 0} orders</Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── Order counts grid ── */}
        <View style={styles.gridCard}>
          {rows.map(({ key, label, stats }, i) => (
            <View key={key} style={[styles.gridItem, i < 2 && styles.gridItemBorder]}>
              <Text style={styles.gridValue}>{stats?.order_count ?? 0}</Text>
              <Text style={styles.gridLabel}>{label}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
