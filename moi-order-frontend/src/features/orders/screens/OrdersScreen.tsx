import React from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { OrderCardSkeleton } from '@/features/orders/components/OrderCardSkeleton';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { formatDate } from '@/shared/utils/formatDate';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { useOrdersScreen, OrdersTab } from '@/features/orders/hooks/useOrdersScreen';
import { ServiceSubmission, TicketOrder } from '@/types/models';
import { styles, STATUS_COLOURS } from './OrdersScreen.styles';

interface OrderCardProps {
  item: ServiceSubmission;
  onPress: (id: number) => void;
}

function OrderCard({ item, onPress }: OrderCardProps): React.JSX.Element {
  const accentColour = STATUS_COLOURS[item.status] ?? STATUS_COLOURS['pending']!;
  return (
    <View style={styles.cardWrap}>
      <Pressable
        style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
        onPress={() => onPress(item.id)}
        accessibilityLabel={`Order ${item.id} — ${item.service_type.name_en}`}
        accessibilityRole="button"
      >
        <View style={[styles.cardAccentBar, { backgroundColor: accentColour }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardServiceName} numberOfLines={1}>
              {item.service_type.service?.name_en ?? item.service_type.name_en}
            </Text>
            <View style={[styles.statusPill, { borderColor: `${accentColour}40` }]}>
              <Text style={[styles.statusText, { color: accentColour }]}>{item.status_label}</Text>
            </View>
          </View>
          <View style={styles.cardMetaRow}>
            <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
            <View style={styles.cardMetaDot} />
            <Text style={styles.cardPrice}>{formatPrice(item.price_snapshot)}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

interface TicketOrderCardProps {
  item: TicketOrder;
  onPress: (id: number) => void;
}

function TicketOrderCard({ item, onPress }: TicketOrderCardProps): React.JSX.Element {
  const accentColour = STATUS_COLOURS[item.status] ?? STATUS_COLOURS['pending']!;
  return (
    <View style={styles.cardWrap}>
      <Pressable
        style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
        onPress={() => onPress(item.id)}
        accessibilityLabel={`Ticket order ${item.id} — ${item.ticket?.name ?? 'Ticket'}`}
        accessibilityRole="button"
      >
        <View style={[styles.cardAccentBar, { backgroundColor: accentColour }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardServiceName} numberOfLines={1}>
              {item.ticket?.name ?? 'Ticket'}
            </Text>
            <View style={[styles.statusPill, { borderColor: `${accentColour}40` }]}>
              <Text style={[styles.statusText, { color: accentColour }]}>{item.status_label}</Text>
            </View>
          </View>
          <View style={styles.cardMetaRow}>
            <Text style={styles.cardDate}>Visit: {formatDate(item.visit_date)}</Text>
            <View style={styles.cardMetaDot} />
            {item.total !== undefined && (
              <Text style={styles.cardPrice}>{formatPrice(item.total)}</Text>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  );
}

interface TabBarProps {
  activeTab: OrdersTab;
  onTabChange: (tab: OrdersTab) => void;
}

function TabBar({ activeTab, onTabChange }: TabBarProps): React.JSX.Element {
  return (
    <View style={styles.tabRow}>
      <Pressable
        style={[styles.tab, activeTab === 'services' && styles.tabActive]}
        onPress={() => onTabChange('services')}
        accessibilityLabel="Services tab"
        accessibilityRole="tab"
      >
        <Text style={[styles.tabText, activeTab === 'services' && styles.tabTextActive]}>Services</Text>
      </Pressable>
      <Pressable
        style={[styles.tab, activeTab === 'tickets' && styles.tabActive]}
        onPress={() => onTabChange('tickets')}
        accessibilityLabel="Tickets tab"
        accessibilityRole="tab"
      >
        <Text style={[styles.tabText, activeTab === 'tickets' && styles.tabTextActive]}>Tickets</Text>
      </Pressable>
    </View>
  );
}

export function OrdersScreen(): React.JSX.Element {
  const {
    activeTab, submissions, ticketOrders,
    isLoading, isError, isLoggedIn, isRefreshing, isFetchingNextPage,
    handleTabChange, handleEndReached, handleRefresh,
    handleOrderPress, handleTicketOrderPress,
    handleNavigateToLogin, handleBack,
  } = useOrdersScreen();

  const header = (
    <>
      <HeroHeader
        accentColor={editorialPalette.amber}
        eyebrow="My Activity"
        title="Orders"
        subtitle="Your service submissions & tickets"
        onBack={handleBack}
        backLabel="Back"
      />
      <View style={styles.bodyGap} />
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </>
  );

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        {header}
        <View style={styles.guestWrap}>
          <Ionicons name="list" size={48} color={colours.textMuted} style={styles.guestIcon} />
          <Text style={styles.guestTitle}>Sign in to view orders</Text>
          <Text style={styles.guestSubtitle}>
            Track your service submissions and{'\n'}ticket bookings in one place.
          </Text>
          <Pressable style={styles.guestBtn} onPress={handleNavigateToLogin}
            accessibilityLabel="Sign in to view orders" accessibilityRole="button">
            <Text style={styles.guestBtnText}>Sign In</Text>
          </Pressable>
        </View>
        <FloatingTabBar />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        {header}
        <OrderCardSkeleton /><OrderCardSkeleton /><OrderCardSkeleton />
        <OrderCardSkeleton /><OrderCardSkeleton /><OrderCardSkeleton />
        <FloatingTabBar />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        {header}
        <View style={styles.stateBox}>
          <Ionicons name="warning" size={36} color={colours.textMuted} style={styles.stateIcon} />
          <Text style={styles.stateTitle}>Could not load orders</Text>
          <Text style={styles.stateSubtitle}>Pull down to retry</Text>
        </View>
        <FloatingTabBar />
      </SafeAreaView>
    );
  }

  if (activeTab === 'services') {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <FlatList
          data={submissions}
          keyExtractor={(item: ServiceSubmission) => String(item.id)}
          renderItem={({ item }) => <OrderCard item={item} onPress={handleOrderPress} />}
          ListHeaderComponent={header}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="mail-open-outline" size={48} color={colours.textMuted} style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No service orders yet</Text>
              <Text style={styles.emptySubtitle}>
                Your service submissions will{'\n'}appear here once you place an order.
              </Text>
            </View>
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            isFetchingNextPage
              ? <ActivityIndicator style={styles.listFooter} color={styles.spinner.color} />
              : null
          }
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews
          accessibilityRole="list"
          showsVerticalScrollIndicator={false}
        />
        <FloatingTabBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <FlatList
        data={ticketOrders}
        keyExtractor={(item: TicketOrder) => String(item.id)}
        renderItem={({ item }) => <TicketOrderCard item={item} onPress={handleTicketOrderPress} />}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="pricetag-outline" size={48} color={colours.textMuted} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No ticket orders yet</Text>
            <Text style={styles.emptySubtitle}>
              Book attractions and tickets{'\n'}to see them here.
            </Text>
          </View>
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          isFetchingNextPage
            ? <ActivityIndicator style={styles.listFooter} color={styles.spinner.color} />
            : null
        }
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
        accessibilityRole="list"
        showsVerticalScrollIndicator={false}
      />
      <FloatingTabBar />
    </SafeAreaView>
  );
}
