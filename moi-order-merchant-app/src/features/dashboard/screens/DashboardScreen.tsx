import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDashboardScreen } from '../hooks/useDashboardScreen';
import { OrderCard } from '../../orders/components/OrderCard';
import { Skeleton } from '../../../shared/components/Skeleton';
import { styles } from './DashboardScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';

interface DashboardScreenProps {
  onSelectOrder?: (orderId: number) => void;
}

export function DashboardScreen({ onSelectOrder }: DashboardScreenProps): React.JSX.Element {
  const { analytics, recentOrders, isLoading, refetch, handleUpdateStatus } = useDashboardScreen();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateLabel = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const pending = analytics?.pending_count ?? 0;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <View style={{ gap: 6 }}>
            <Skeleton height={12} width={90} borderRadius={4} />
            <Skeleton height={36} width={180} borderRadius={6} />
            <Skeleton height={12} width={110} borderRadius={4} />
          </View>
        </View>
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          <View style={[styles.summaryCard, { minHeight: 110 }]}>
            <Skeleton height={14} width={80} borderRadius={4} />
            <Skeleton height={40} width={160} borderRadius={6} />
            <Skeleton height={12} width={100} borderRadius={4} />
          </View>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <View style={styles.skeletonStrip} />
              <View style={{ flex: 1, padding: 14, gap: 8 }}>
                <Skeleton height={14} width="60%" borderRadius={4} />
                <Skeleton height={11} width="40%" borderRadius={4} />
                <Skeleton height={11} width="80%" borderRadius={4} />
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Dark gradient header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerDate}>{dateLabel}</Text>
          </View>
          {pending > 0 && (
            <View style={styles.pendingPill}>
              <View style={styles.pendingDot} />
              <Text style={styles.pendingPillText}>{pending} pending</Text>
            </View>
          )}
        </View>

        {/* ── Floating summary card (overlaps header) ── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryMain}>
            <Text style={styles.summaryLabel}>Today's Revenue</Text>
            <Text style={styles.summaryRevenue}>{formatPrice(analytics?.today.revenue_cents ?? 0)}</Text>
            <View style={styles.summaryMeta}>
              <View style={styles.summaryMetaItem}>
                <Ionicons name="receipt-outline" size={13} color={colours.primary} />
                <Text style={styles.summaryMetaText}>{analytics?.today.order_count ?? 0} orders today</Text>
              </View>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStats}>
            <SummaryMini label="Week" value={formatPrice(analytics?.this_week.revenue_cents ?? 0)} />
            <View style={styles.summaryStatsDivider} />
            <SummaryMini label="Month" value={formatPrice(analytics?.this_month.revenue_cents ?? 0)} />
          </View>
        </View>

        {/* ── Recent orders ── */}
        <View style={styles.sectionRow}>
          <View style={styles.sectionLabelRow}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionLabel}>Recent Orders</Text>
          </View>
          {recentOrders.length > 0 && (
            <Text style={styles.sectionCount}>{recentOrders.length} orders</Text>
          )}
        </View>

        {recentOrders.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="receipt-outline" size={26} color={colours.primary} />
            </View>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>New orders will appear here</Text>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {recentOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
                onPress={onSelectOrder !== undefined ? () => onSelectOrder(order.id) : undefined}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryMini({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <View style={styles.summaryMiniItem}>
      <Text style={styles.summaryMiniLabel}>{label}</Text>
      <Text style={styles.summaryMiniValue}>{value}</Text>
    </View>
  );
}
