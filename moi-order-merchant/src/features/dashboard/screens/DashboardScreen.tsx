import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDashboardScreen } from '../hooks/useDashboardScreen';
import { OrderCard } from '../../orders/components/OrderCard';
import { NotificationBell } from '../../notifications/components/NotificationBell';
import { Skeleton } from '../../../shared/components/Skeleton';
import { styles } from './DashboardScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { formatDate } from '../../../shared/utils/formatDate';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import type { TopPeriod } from '../../../api/analytics';
import type { TopItem, TopCustomer } from '../../../types/models';

const TOP_PERIOD_TABS: { key: TopPeriod; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week',  label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

interface DashboardScreenProps {
  onSelectOrder?: (orderId: number) => void;
  /** Called when the notification bell is pressed (mobile nav or web sidebar navigate). */
  onBellPress?: () => void;
}

export function DashboardScreen({ onSelectOrder, onBellPress }: DashboardScreenProps): React.JSX.Element {
  const {
    analytics, recentOrders, topData, topPeriod, pendingOnly,
    isLoading, handleUpdateStatus, handleTopPeriodChange, handlePendingToggle,
  } = useDashboardScreen();
  const { isDesktop } = useResponsive();

  const hour     = new Date().getHours();
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

  // ── Revenue card ─────────────────────────────────────────────────────────────
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

  // ── Top Sales + Top Customers (shared period tabs) ────────────────────────────
  const topSection = (
    <View style={styles.topSection}>
      {/* Shared period tab row */}
      <View style={styles.topSectionHeader}>
        <Text style={styles.topSectionTitle}>Performance</Text>
        <View style={styles.periodTabs}>
          {TOP_PERIOD_TABS.map((t) => (
            <Pressable
              key={t.key}
              style={[styles.periodTab, topPeriod === t.key && styles.periodTabActive]}
              onPress={() => handleTopPeriodChange(t.key)}
              accessibilityRole="button"
              accessibilityLabel={t.label}
            >
              <Text style={[styles.periodTabText, topPeriod === t.key && styles.periodTabTextActive]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Two cards side-by-side on desktop, stacked on mobile */}
      <View style={[styles.topCardsRow, !isDesktop && styles.topCardsRowStack]}>
        <TopSalesCard items={topData?.top_items ?? []} />
        <TopCustomersCard customers={topData?.top_customers ?? []} />
      </View>
    </View>
  );

  // ── Recent Orders card ────────────────────────────────────────────────────────
  const ordersCard = (
    <View style={styles.ordersCard}>
      <View style={styles.ordersCardHeader}>
        <Text style={styles.cardSectionTitle}>{pendingOnly ? 'PENDING ORDERS' : 'RECENT ORDERS'}</Text>
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

  // ── Quick stats card ──────────────────────────────────────────────────────────
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

  // ── Activity card ─────────────────────────────────────────────────────────────
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
          <View style={styles.topBarActions}>
            {pending > 0 && (
              <Pressable
                style={[styles.pendingPill, pendingOnly && styles.pendingPillActive]}
                onPress={handlePendingToggle}
                accessibilityRole="button"
                accessibilityLabel={pendingOnly ? 'Showing pending orders, tap to show all' : `${pending} pending orders, tap to filter`}
              >
                <View style={styles.pendingDot} />
                <Text style={[styles.pendingText, pendingOnly && styles.pendingTextActive]}>
                  {pending} pending
                </Text>
              </Pressable>
            )}
            {onBellPress !== undefined && (
              <NotificationBell
                onPress={onBellPress}
                iconColour={colours.textMuted}
              />
            )}
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {revenueCard}
        {topSection}

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

// ── Sub-components ────────────────────────────────────────────────────────────

function TopSalesCard({ items }: { items: TopItem[] }): React.JSX.Element {
  return (
    <View style={styles.topCard}>
      <View style={styles.topCardHeader}>
        <View style={[styles.topCardIcon, { backgroundColor: colours.primary + '20' }]}>
          <Ionicons name="flame-outline" size={14} color={colours.primary} />
        </View>
        <Text style={styles.topCardTitle}>Top Sales</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.topCardEmpty}>
          <Text style={styles.topCardEmptyText}>No data for this period</Text>
        </View>
      ) : (
        items.map((item, i) => (
          <View key={item.name} style={[styles.topRow, i < items.length - 1 && styles.topRowBorder]}>
            <View style={styles.topRank}>
              <Text style={styles.topRankText}>{i + 1}</Text>
            </View>
            <View style={styles.topRowInfo}>
              <Text style={styles.topRowName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.topRowSub}>{item.total_quantity} sold</Text>
            </View>
            <Text style={styles.topRowValue}>{formatPrice(item.revenue_cents)}</Text>
          </View>
        ))
      )}
    </View>
  );
}

function TopCustomersCard({ customers }: { customers: TopCustomer[] }): React.JSX.Element {
  return (
    <View style={styles.topCard}>
      <View style={styles.topCardHeader}>
        <View style={[styles.topCardIcon, { backgroundColor: colours.success + '20' }]}>
          <Ionicons name="people-outline" size={14} color={colours.success} />
        </View>
        <Text style={styles.topCardTitle}>Top Customers</Text>
      </View>

      {customers.length === 0 ? (
        <View style={styles.topCardEmpty}>
          <Text style={styles.topCardEmptyText}>No data for this period</Text>
        </View>
      ) : (
        customers.map((customer, i) => (
          <View key={customer.name + i} style={[styles.topRow, i < customers.length - 1 && styles.topRowBorder]}>
            <View style={[styles.topRank, i === 0 && styles.topRankGold]}>
              <Text style={[styles.topRankText, i === 0 && styles.topRankTextGold]}>{i + 1}</Text>
            </View>
            <View style={styles.topRowInfo}>
              <Text style={styles.topRowName} numberOfLines={1}>{customer.name}</Text>
              <Text style={styles.topRowSub}>{customer.order_count} {customer.order_count === 1 ? 'order' : 'orders'}</Text>
            </View>
            <Text style={styles.topRowValue}>{formatPrice(customer.total_cents)}</Text>
          </View>
        ))
      )}
    </View>
  );
}
