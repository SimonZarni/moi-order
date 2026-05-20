import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDashboardScreen } from '../hooks/useDashboardScreen';
import { OrderCard } from '../../orders/components/OrderCard';
import { Skeleton, SkeletonCard } from '../../../shared/components/Skeleton';
import { styles } from './DashboardScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';

interface DashboardScreenProps {
  onSelectOrder?: (orderId: number) => void;
}

export function DashboardScreen({ onSelectOrder }: DashboardScreenProps): React.JSX.Element {
  const { analytics, recentOrders, isLoading, refetch } = useDashboardScreen();

  const todayLabel = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.pageHeader}>
            <View style={styles.pageTitleBlock}>
              <Skeleton height={28} width={140} borderRadius={6} />
              <Skeleton height={12} width={100} borderRadius={4} />
            </View>
          </View>
          <View style={styles.statsGrid}>
            <SkeletonCard style={{ flex: 1, minWidth: 148 }} />
            <SkeletonCard style={{ flex: 1, minWidth: 148 }} />
            <SkeletonCard style={{ flex: 1, minWidth: 148 }} />
            <SkeletonCard style={{ flex: 1, minWidth: 148 }} />
          </View>
          <SkeletonCard />
          <SkeletonCard />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <View style={styles.pageTitleBlock}>
            <Text style={styles.pageTitle}>Dashboard</Text>
            <Text style={styles.pageDate}>{todayLabel}</Text>
          </View>
          {(analytics?.pending_count ?? 0) > 0 && (
            <View style={styles.pendingPill}>
              <Text style={styles.pendingPillText}>{analytics?.pending_count} pending</Text>
            </View>
          )}
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Today Revenue"
            value={formatPrice(analytics?.today.revenue_cents ?? 0)}
            sub={`${analytics?.today.order_count ?? 0} orders`}
            iconName="cash-outline"
          />
          <StatCard
            label="This Week"
            value={formatPrice(analytics?.this_week.revenue_cents ?? 0)}
            sub={`${analytics?.this_week.order_count ?? 0} orders`}
            iconName="calendar-outline"
          />
          <StatCard
            label="This Month"
            value={formatPrice(analytics?.this_month.revenue_cents ?? 0)}
            sub={`${analytics?.this_month.order_count ?? 0} orders`}
            iconName="trending-up-outline"
          />
          <StatCard
            label="Pending"
            value={String(analytics?.pending_count ?? 0)}
            sub="need action"
            iconName="time-outline"
          />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            {(analytics?.pending_count ?? 0) > 0 && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>
                  {analytics?.pending_count} pending
                </Text>
              </View>
            )}
          </View>
          {recentOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={36} color={colours.medium} />
              <Text style={styles.emptyText}>No orders yet</Text>
            </View>
          ) : (
            recentOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={() => { void refetch(); }}
                onPress={onSelectOrder !== undefined ? () => onSelectOrder(order.id) : undefined}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

function StatCard({ label, value, sub, iconName }: StatCardProps): React.JSX.Element {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconRow}>
        <View style={styles.statIconBg}>
          <Ionicons name={iconName} size={16} color={colours.primary} />
        </View>
        <Text style={styles.statLabel} numberOfLines={1}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}
