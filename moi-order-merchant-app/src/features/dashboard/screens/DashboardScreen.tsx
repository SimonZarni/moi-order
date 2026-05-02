import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDashboardScreen } from '../hooks/useDashboardScreen';
import { OrderCard } from '../../orders/components/OrderCard';
import { styles } from './DashboardScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';

interface DashboardScreenProps {
  onSelectOrder?: (orderId: number) => void;
}

export function DashboardScreen({ onSelectOrder }: DashboardScreenProps): React.JSX.Element {
  const { analytics, recentOrders, isLoading, refetch } = useDashboardScreen();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSub}>Today's snapshot</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Today's Revenue"
            value={formatPrice(analytics?.today.revenue_cents ?? 0)}
            sub={`${analytics?.today.order_count ?? 0} orders`}
            iconName="cash-outline"
            iconBg={colours.successBg}
            iconColor={colours.success}
          />
          <StatCard
            label="This Week"
            value={formatPrice(analytics?.this_week.revenue_cents ?? 0)}
            sub={`${analytics?.this_week.order_count ?? 0} orders`}
            iconName="calendar-outline"
            iconBg={colours.infoBgBlue}
            iconColor={colours.info}
          />
          <StatCard
            label="This Month"
            value={formatPrice(analytics?.this_month.revenue_cents ?? 0)}
            sub={`${analytics?.this_month.order_count ?? 0} orders`}
            iconName="trending-up-outline"
            iconBg={colours.primaryLight}
            iconColor={colours.primaryDark}
          />
          <StatCard
            label="Pending Orders"
            value={String(analytics?.pending_count ?? 0)}
            sub="awaiting action"
            iconName="time-outline"
            iconBg={colours.warningBg}
            iconColor={colours.warning}
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
              <Ionicons name="receipt-outline" size={32} color={colours.medium} />
              <Text style={styles.emptyText}>No orders yet</Text>
            </View>
          ) : (
            recentOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={() => { void refetch(); }}
                onPress={onSelectOrder ? () => onSelectOrder(order.id) : undefined}
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
  iconBg: string;
  iconColor: string;
}

function StatCard({ label, value, sub, iconName, iconBg, iconColor }: StatCardProps): React.JSX.Element {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconRow}>
        <View style={[styles.statIconBg, { backgroundColor: iconBg }]}>
          <Ionicons name={iconName} size={16} color={iconColor} />
        </View>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}
