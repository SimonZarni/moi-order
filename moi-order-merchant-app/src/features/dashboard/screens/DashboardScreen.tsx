import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDashboardScreen } from '../hooks/useDashboardScreen';
import { OrderCard } from '../../orders/components/OrderCard';
import { Skeleton } from '../../../shared/components/Skeleton';
import { styles } from './DashboardScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { formatDate } from '../../../shared/utils/formatDate';
import { useResponsive } from '../../../shared/hooks/useResponsive';

interface DashboardScreenProps {
  onSelectOrder?: (orderId: number) => void;
}

export function DashboardScreen({ onSelectOrder }: DashboardScreenProps): React.JSX.Element {
  const { analytics, recentOrders, isLoading, refetch, handleUpdateStatus } = useDashboardScreen();
  const { isDesktop } = useResponsive();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateLabel = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const pending = analytics?.pending_count ?? 0;

  const avgOrderValue = analytics?.this_month.order_count
    ? Math.round((analytics.this_month.revenue_cents ?? 0) / analytics.this_month.order_count)
    : 0;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <View style={{ gap: 4 }}>
            <Skeleton height={12} width={80} borderRadius={4} />
            <Skeleton height={28} width={160} borderRadius={6} />
          </View>
        </View>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.revenueCard}>
            <Skeleton height={14} width={120} borderRadius={4} />
            <Skeleton height={44} width={180} borderRadius={6} />
            <Skeleton height={12} width={100} borderRadius={4} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const revenueCard = (
    <View style={styles.revenueCard}>
      <View style={styles.revenueLeft}>
        <Text style={styles.revenueLabel}>TODAY'S REVENUE</Text>
        <Text style={styles.revenueAmount}>{formatPrice(analytics?.today.revenue_cents ?? 0)}</Text>
        <Text style={styles.revenueOrders}>{analytics?.today.order_count ?? 0} orders today</Text>
      </View>
      <View style={styles.revenueRight}>
        <View style={styles.revenueMiniBlock}>
          <Text style={styles.revenueMiniLabel}>THIS WEEK</Text>
          <Text style={styles.revenueMiniValue}>{formatPrice(analytics?.this_week.revenue_cents ?? 0)}</Text>
        </View>
        <View style={styles.revenueMiniBlock}>
          <Text style={styles.revenueMiniLabel}>THIS MONTH</Text>
          <Text style={styles.revenueMiniValue}>{formatPrice(analytics?.this_month.revenue_cents ?? 0)}</Text>
        </View>
      </View>
    </View>
  );

  const ordersCard = (
    <View style={styles.ordersCard}>
      <View style={styles.ordersCardHeader}>
        <Text style={styles.cardSectionTitle}>RECENT ORDERS</Text>
        <Pressable
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="View all orders"
        >
          <Text style={styles.viewAllLink}>View all →</Text>
        </Pressable>
      </View>
      {recentOrders.length === 0 ? (
        <View style={styles.emptyOrders}>
          <Ionicons name="receipt-outline" size={28} color={colours.textSubtle} />
          <Text style={styles.emptyText}>No recent orders</Text>
        </View>
      ) : (
        recentOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            variant="light"
            onUpdateStatus={handleUpdateStatus}
            onPress={onSelectOrder !== undefined ? () => onSelectOrder(order.id) : undefined}
          />
        ))
      )}
    </View>
  );

  const statsCard = (
    <View style={styles.statsCard}>
      <Text style={styles.cardSectionTitle}>QUICK STATS</Text>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Total Orders (Month)</Text>
        <Text style={styles.statValue}>{analytics?.this_month.order_count ?? 0}</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Avg. Order Value</Text>
        <Text style={[styles.statValue, styles.statValueGreen]}>{formatPrice(avgOrderValue)}</Text>
      </View>
    </View>
  );

  const activityCard = (
    <View style={styles.activityCard}>
      <Text style={styles.cardSectionTitle}>ACTIVITY</Text>
      {recentOrders.length === 0 ? (
        <Text style={styles.activityEmpty}>No recent activity</Text>
      ) : (
        recentOrders.slice(0, 3).map((order) => (
          <View key={order.id} style={styles.activityRow}>
            <View style={[styles.activityDot, { backgroundColor: colours.primary }]} />
            <View style={styles.activityInfo}>
              <Text style={styles.activityText}>New order from {order.user.name}</Text>
              <Text style={styles.activityTime}>{formatDate(order.created_at)}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topBarGreeting}>{greeting}</Text>
          <Text style={styles.topBarTitle}>Dashboard</Text>
        </View>
        <View style={styles.topBarRight}>
          <Text style={styles.topBarDate}>{dateLabel}</Text>
          {pending > 0 && (
            <View style={styles.pendingPill}>
              <View style={styles.pendingDot} />
              <Text style={styles.pendingText}>{pending} pending</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {revenueCard}

        {isDesktop ? (
          <View style={styles.bottomGrid}>
            <View style={styles.bottomLeft}>{ordersCard}</View>
            <View style={styles.bottomRight}>
              {statsCard}
              {activityCard}
            </View>
          </View>
        ) : (
          <>
            {ordersCard}
            {statsCard}
            {activityCard}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
