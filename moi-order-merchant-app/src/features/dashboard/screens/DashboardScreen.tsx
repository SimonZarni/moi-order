import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
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
  const { analytics, recentOrders, isLoading, refetch, handleUpdateStatus } = useDashboardScreen();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const todayLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.pageHeader}>
            <View style={styles.pageTitleBlock}>
              <Skeleton height={14} width={80} borderRadius={4} />
              <Skeleton height={30} width={160} borderRadius={6} />
              <Skeleton height={12} width={120} borderRadius={4} />
            </View>
          </View>
          <View style={styles.statsGrid}>
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} style={{ flex: 1, minWidth: 148 }} />)}
          </View>
          <SkeletonCard />
          <SkeletonCard />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Hero header ── */}
        <View style={styles.pageHeader}>
          <View style={styles.pageTitleBlock}>
            <Text style={styles.pageGreeting}>{greeting}</Text>
            <Text style={styles.pageTitle}>Dashboard</Text>
            <Text style={styles.pageDate}>{todayLabel}</Text>
          </View>
          {(analytics?.pending_count ?? 0) > 0 && (
            <View style={styles.pendingPill}>
              <View style={styles.pendingDot} />
              <Text style={styles.pendingPillText}>{analytics?.pending_count} pending</Text>
            </View>
          )}
        </View>

        {/* ── KPI grid ── */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Today"
            value={formatPrice(analytics?.today.revenue_cents ?? 0)}
            sub={`${analytics?.today.order_count ?? 0} orders`}
            iconName="flash-outline"
            accent={colours.primary}
          />
          <StatCard
            label="This Week"
            value={formatPrice(analytics?.this_week.revenue_cents ?? 0)}
            sub={`${analytics?.this_week.order_count ?? 0} orders`}
            iconName="calendar-outline"
            accent={colours.info}
          />
          <StatCard
            label="This Month"
            value={formatPrice(analytics?.this_month.revenue_cents ?? 0)}
            sub={`${analytics?.this_month.order_count ?? 0} orders`}
            iconName="trending-up-outline"
            accent={colours.primaryDark}
          />
          <StatCard
            label="Pending"
            value={String(analytics?.pending_count ?? 0)}
            sub="need action"
            iconName="time-outline"
            accent={colours.warning}
            highlight={(analytics?.pending_count ?? 0) > 0}
          />
        </View>

        {/* ── Recent orders ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>Recent Orders</Text>
            </View>
            {recentOrders.length > 0 && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>{recentOrders.length} orders</Text>
              </View>
            )}
          </View>
          {recentOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="receipt-outline" size={28} color={colours.primary} />
              </View>
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptyText}>New orders will appear here</Text>
            </View>
          ) : (
            recentOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
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
  accent: string;
  highlight?: boolean;
}

function StatCard({ label, value, sub, iconName, accent, highlight }: StatCardProps): React.JSX.Element {
  return (
    <View style={[styles.statCard, highlight === true && { borderWidth: 1.5, borderColor: accent + '55' }]}>
      <View style={[styles.statIconBg, { backgroundColor: accent + '18' }]}>
        <Ionicons name={iconName} size={18} color={accent} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}
