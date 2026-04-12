import React from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { useOrdersScreen } from '@/features/orders/hooks/useOrdersScreen';
import { ServiceSubmission } from '@/types/models';
import { styles, STATUS_COLOURS } from './OrdersScreen.styles';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatPrice(baht: number): string {
  return `฿${baht.toLocaleString('th-TH')}`;
}

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
              <Text style={[styles.statusText, { color: accentColour }]}>
                {item.status_label}
              </Text>
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

export function OrdersScreen(): React.JSX.Element {
  const {
    submissions,
    isLoading,
    isError,
    isLoggedIn,
    isRefreshing,
    isFetchingNextPage,
    handleEndReached,
    handleRefresh,
    handleOrderPress,
    handleNavigateToLogin,
    handleBack,
  } = useOrdersScreen();

  const header = (
    <>
      <HeroHeader
        accentColor={editorialPalette.amber}
        eyebrow="My Activity"
        title="Orders"
        subtitle="Your service submissions"
        onBack={handleBack}
        backLabel="Back"
      />
      <View style={styles.bodyGap} />
    </>
  );

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        {header}
        <View style={styles.guestWrap}>
          <Text style={styles.guestIcon}>📋</Text>
          <Text style={styles.guestTitle}>Sign in to view orders</Text>
          <Text style={styles.guestSubtitle}>
            Track your service submissions and{'\n'}stay updated on their progress.
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
        <View style={styles.stateBox}>
          <ActivityIndicator size="large" color={styles.spinner.color} />
        </View>
        <FloatingTabBar />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        {header}
        <View style={styles.stateBox}>
          <Text style={styles.stateIcon}>⚠</Text>
          <Text style={styles.stateTitle}>Could not load orders</Text>
          <Text style={styles.stateSubtitle}>Pull down to retry</Text>
        </View>
        <FloatingTabBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <FlatList
        data={submissions}
        keyExtractor={(item: ServiceSubmission) => String(item.id)}
        renderItem={({ item }) => <OrderCard item={item} onPress={handleOrderPress} />}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
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
        removeClippedSubviews={true}
        accessibilityRole="list"
        showsVerticalScrollIndicator={false}
      />
      <FloatingTabBar />
    </SafeAreaView>
  );
}
