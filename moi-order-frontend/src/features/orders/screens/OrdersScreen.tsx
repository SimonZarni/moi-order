import React, { useRef } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocale } from '@/shared/hooks/useLocale';
import { useStrings } from '@/shared/i18n';
import { localeName } from '@/shared/utils/localeName';

import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { OrderCardSkeleton } from '@/features/orders/components/OrderCardSkeleton';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { formatDate } from '@/shared/utils/formatDate';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { useOrdersScreen, OrdersTab } from '@/features/orders/hooks/useOrdersScreen';
import { ServiceSubmission, TicketOrder } from '@/types/models';
import { SUBMISSION_STATUS, TICKET_ORDER_STATUS } from '@/types/enums';
import { styles, STATUS_COLOURS } from './OrdersScreen.styles';

interface OrderCardProps {
  item: ServiceSubmission;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
}

function OrderCard({ item, onPress, onDelete }: OrderCardProps): React.JSX.Element {
  const swipeableRef = useRef<Swipeable>(null);
  const { locale } = useLocale();
  const s = useStrings();
  const accentColour = STATUS_COLOURS[item.status] ?? STATUS_COLOURS['pending']!;
  const svcName = localeName(item.service_type?.service ?? item.service_type, locale);

  const cardContent = (
    <View style={styles.cardWrap}>
      <Pressable
        style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
        onPress={() => onPress(item.id)}
        accessibilityLabel={`Order ${item.id} — ${svcName}`}
        accessibilityRole="button"
      >
        <View style={[styles.cardAccentBar, { backgroundColor: accentColour }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardServiceName} numberOfLines={1}>
              {svcName}
            </Text>
            <View style={[styles.statusPill, { borderColor: `${accentColour}40` }]}>
              <Text style={[styles.statusText, { color: accentColour }]}>{(s.status as Record<string,string>)[item.status] ?? item.status_label}</Text>
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

  if (item.status !== SUBMISSION_STATUS.Cancelled) {
    return cardContent;
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => (
        <Pressable
          style={styles.swipeDeleteAction}
          onPress={() => { swipeableRef.current?.close(); onDelete(item.id); }}
          accessibilityLabel="Delete cancelled order"
          accessibilityRole="button"
        >
          <Ionicons name="trash" size={22} color="#fff" />
        </Pressable>
      )}
    >
      {cardContent}
    </Swipeable>
  );
}

interface TicketOrderCardProps {
  item: TicketOrder;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
}

function TicketOrderCard({ item, onPress, onDelete }: TicketOrderCardProps): React.JSX.Element {
  const swipeableRef = useRef<Swipeable>(null);
  const s = useStrings();
  const accentColour = STATUS_COLOURS[item.status] ?? STATUS_COLOURS['pending']!;

  const cardContent = (
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
              <Text style={[styles.statusText, { color: accentColour }]}>{(s.status as Record<string,string>)[item.status] ?? item.status_label}</Text>
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

  if (item.status !== TICKET_ORDER_STATUS.Cancelled) {
    return cardContent;
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => (
        <Pressable
          style={styles.swipeDeleteAction}
          onPress={() => { swipeableRef.current?.close(); onDelete(item.id); }}
          accessibilityLabel="Delete cancelled order"
          accessibilityRole="button"
        >
          <Ionicons name="trash" size={22} color="#fff" />
        </Pressable>
      )}
    >
      {cardContent}
    </Swipeable>
  );
}

interface TabBarProps {
  activeTab: OrdersTab;
  onTabChange: (tab: OrdersTab) => void;
}

function TabBar({ activeTab, onTabChange }: TabBarProps): React.JSX.Element {
  const { locale } = useLocale();
  const servicesLabel = locale === 'mm' ? '၀န်ဆောင်မှုများ' : locale === 'th' ? 'บริการ' : 'Services';
  const ticketsLabel  = locale === 'mm' ? 'လက်မှတ်များ'    : locale === 'th' ? 'ตั๋ว'  : 'Tickets';

  return (
    <View style={styles.tabRow}>
      <Pressable
        style={[styles.tab, activeTab === 'services' && styles.tabActive]}
        onPress={() => onTabChange('services')}
        accessibilityLabel="Services tab"
        accessibilityRole="tab"
      >
        <Text style={[styles.tabText, activeTab === 'services' && styles.tabTextActive]}>{servicesLabel}</Text>
      </Pressable>
      <Pressable
        style={[styles.tab, activeTab === 'tickets' && styles.tabActive]}
        onPress={() => onTabChange('tickets')}
        accessibilityLabel="Tickets tab"
        accessibilityRole="tab"
      >
        <Text style={[styles.tabText, activeTab === 'tickets' && styles.tabTextActive]}>{ticketsLabel}</Text>
      </Pressable>
    </View>
  );
}

export function OrdersScreen(): React.JSX.Element {
  const {
    activeTab, submissions, ticketOrders,
    isLoading, isError, isLoggedIn, isRefreshing, isFetchingNextPage,
    handleTabChange, handleEndReached, handleRefresh,
    handleOrderPress, handleDeleteSubmission, handleTicketOrderPress, handleDeleteTicketOrder,
    handleNavigateToLogin, handleBack,
  } = useOrdersScreen();
  const s = useStrings();

  const hero = (
    <>
      <HeroHeader
        accentColor={editorialPalette.amber}
        eyebrow={s.orders.eyebrow}
        title={s.orders.title}
        subtitle={s.orders.subtitle}
        onBack={handleBack}
        backLabel="Back"
      />
      <View style={styles.bodyGap} />
    </>
  );

  const tabBar = <View style={styles.stickyTabBar}><TabBar activeTab={activeTab} onTabChange={handleTabChange} /></View>;

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.flatList}>
          {hero}{tabBar}
          <View style={styles.guestWrap}>
            <Ionicons name="list" size={48} color={colours.textMuted} style={styles.guestIcon} />
            <Text style={styles.guestTitle}>{s.orders.signInToView}</Text>
            <Text style={styles.guestSubtitle}>{s.orders.signInTrack}</Text>
            <Pressable style={styles.guestBtn} onPress={handleNavigateToLogin}
              accessibilityLabel={s.orders.signInToView} accessibilityRole="button">
              <Text style={styles.guestBtnText}>{s.auth.signIn}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.flatList}>
          {hero}{tabBar}
          <OrderCardSkeleton /><OrderCardSkeleton /><OrderCardSkeleton />
          <OrderCardSkeleton /><OrderCardSkeleton /><OrderCardSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.flatList}>
          {hero}{tabBar}
          <View style={styles.stateBox}>
            <Ionicons name="warning" size={36} color={colours.textMuted} style={styles.stateIcon} />
            <Text style={styles.stateTitle}>{s.orders.couldNotLoad}</Text>
            <Text style={styles.stateSubtitle}>{s.orders.pullToRetry}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (activeTab === 'services') {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        {hero}
        {tabBar}
        <FlatList
          style={styles.flatList}
          data={submissions}
          keyExtractor={(item: ServiceSubmission) => String(item.id)}
          renderItem={({ item }) => <OrderCard item={item} onPress={handleOrderPress} onDelete={handleDeleteSubmission} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="mail-open-outline" size={48} color={colours.textMuted} style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>{s.orders.noServiceOrders}</Text>
              <Text style={styles.emptySubtitle}>{s.orders.noServiceSub}</Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage
              ? <ActivityIndicator style={styles.listFooter} color={styles.spinner.color} />
              : null
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          contentContainerStyle={styles.list}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          accessibilityRole="list"
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {hero}
      {tabBar}
      <FlatList
        style={styles.flatList}
        data={ticketOrders}
        keyExtractor={(item: TicketOrder) => String(item.id)}
        renderItem={({ item }) => <TicketOrderCard item={item} onPress={handleTicketOrderPress} onDelete={handleDeleteTicketOrder} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="pricetag-outline" size={48} color={colours.textMuted} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>{s.orders.noTicketOrders}</Text>
            <Text style={styles.emptySubtitle}>{s.orders.noTicketSub}</Text>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage
            ? <ActivityIndicator style={styles.listFooter} color={styles.spinner.color} />
            : null
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        contentContainerStyle={styles.list}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        accessibilityRole="list"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
