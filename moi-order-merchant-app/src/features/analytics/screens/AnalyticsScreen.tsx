import React, { useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAnalyticsScreen } from '../hooks/useAnalyticsScreen';
import { styles } from './AnalyticsScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import type { PeriodStats } from '../../../types/models';

interface PeriodRow {
  label: string;
  stats: PeriodStats | undefined;
  isLast?: boolean;
}

export function AnalyticsScreen(): React.JSX.Element {
  const { analytics, isLoading } = useAnalyticsScreen();

  const maxRevenue = useMemo(() => {
    const values = [
      analytics?.today.revenue_cents ?? 0,
      analytics?.this_week.revenue_cents ?? 0,
      analytics?.this_month.revenue_cents ?? 0,
    ];
    return Math.max(...values, 1);
  }, [analytics]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  const periods: PeriodRow[] = [
    { label: 'Today', stats: analytics?.today },
    { label: 'This Week', stats: analytics?.this_week },
    { label: 'This Month', stats: analytics?.this_month, isLast: true },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSub}>Revenue and order performance</Text>
        </View>

        {(analytics?.pending_count ?? 0) > 0 && (
          <View style={styles.pendingCard}>
            <Ionicons name="time-outline" size={32} color={colours.warning} />
            <View style={styles.pendingTextCol}>
              <Text style={styles.pendingCount}>{analytics?.pending_count}</Text>
              <Text style={styles.pendingLabel}>orders pending your action</Text>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Revenue by Period</Text>
          </View>
          {periods.map(({ label, stats, isLast }) => (
            <RevenueRow
              key={label}
              label={label}
              stats={stats}
              maxRevenue={maxRevenue}
              isLast={isLast}
            />
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Orders Summary</Text>
          </View>
          <View style={styles.summaryGrid}>
            <SummaryItem
              value={String(analytics?.today.order_count ?? 0)}
              label="Today"
            />
            <SummaryItem
              value={String(analytics?.this_week.order_count ?? 0)}
              label="This Week"
            />
            <SummaryItem
              value={String(analytics?.this_month.order_count ?? 0)}
              label="This Month"
              isLast
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface RevenueRowProps {
  label: string;
  stats: PeriodStats | undefined;
  maxRevenue: number;
  isLast?: boolean;
}

function RevenueRow({ label, stats, maxRevenue, isLast }: RevenueRowProps): React.JSX.Element {
  const fillRatio = ((stats?.revenue_cents ?? 0) / maxRevenue);

  return (
    <View style={[styles.periodRow, isLast === true && styles.periodLastRow]}>
      <View style={styles.periodHeader}>
        <Text style={styles.periodLabel}>{label}</Text>
        <Text style={styles.periodRevenue}>{formatPrice(stats?.revenue_cents ?? 0)}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.round(fillRatio * 100)}%` }]} />
      </View>
      <Text style={styles.periodMeta}>{stats?.order_count ?? 0} orders</Text>
    </View>
  );
}

function SummaryItem({ value, label, isLast }: { value: string; label: string; isLast?: boolean }): React.JSX.Element {
  return (
    <View style={[styles.summaryItem, isLast === true && styles.summaryItemLast]}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}
