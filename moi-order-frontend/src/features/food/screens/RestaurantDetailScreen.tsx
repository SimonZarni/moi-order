import React from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { RESTAURANT_STATUS } from '@/types/enums';
import { OpeningHour, OpeningHourSession } from '@/types/models';
import { useStrings } from '@/shared/i18n';
import { CategoryTabBar } from '../components/CategoryTabBar';
import { MenuCategorySection } from '../components/MenuCategorySection';
import { RestaurantPhotoCarousel } from '../components/RestaurantPhotoCarousel';
import { CartBar } from '../components/CartBar';
import { RestaurantReviewsSection } from '../components/RestaurantReviewsSection/RestaurantReviewsSection';
import { useRestaurantDetailScreen } from '../hooks/useRestaurantDetailScreen';
import { styles } from './RestaurantDetailScreen.styles';

function todayHours(hours: OpeningHour[] | undefined): OpeningHour | null {
  if (!hours?.length) return null;
  return hours.find((h) => h.day_of_week === new Date().getDay()) ?? null;
}

function currentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function activeSession(sessions: OpeningHourSession[]): OpeningHourSession | null {
  const time = currentTime();
  return sessions.find((s) => time >= s.opens_at && time < s.closes_at) ?? null;
}

function nextSession(sessions: OpeningHourSession[]): OpeningHourSession | null {
  const time = currentTime();
  return sessions.find((s) => s.opens_at > time) ?? null;
}

export function RestaurantDetailScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const s      = useStrings();
  const {
    restaurant, isLoading, isError, sortedCategories, activeTabIndex, scrollRef,
    cartItemCount, cartTotalCents, activeOrderCount, getQuantity,
    isRefreshing, handleBack, handleRefresh,
    handleTabPress, handleTabBarLayout, handleSectionLayout,
    handleScroll, handleScrollEnd, handleAddItem, handleRemoveItem, handleItemPress, handleCartPress, handleOrdersPress,
  } = useRestaurantDetailScreen();

  const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
    [RESTAURANT_STATUS.Open]:   { bg: '#dcfce7', color: '#16a34a', label: s.restaurant.statusOpen },
    [RESTAURANT_STATUS.Closed]: { bg: colours.infoBg, color: colours.textMuted, label: s.restaurant.statusClosed },
    [RESTAURANT_STATUS.Paused]: { bg: '#fef9c3', color: '#a16207', label: s.restaurant.statusPaused },
  };

  if (isLoading) return <SafeAreaView style={styles.root} edges={['top']}><ActivityIndicator color={colours.primary} style={{ marginTop: 80 }} /></SafeAreaView>;
  if (isError || !restaurant) return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back"><Ionicons name="chevron-back" size={22} color={colours.white} /></Pressable>
      <View style={styles.stateBox}><Text style={styles.stateText}>{s.restaurant.couldNotLoad}</Text></View>
    </SafeAreaView>
  );

  const badge    = STATUS_BADGE[restaurant.status] ?? { bg: colours.infoBg, color: colours.textMuted, label: restaurant.status };
  const todayHr  = todayHours(restaurant.opening_hours);
  const activeSess = todayHr && !todayHr.is_closed ? activeSession(todayHr.sessions) : null;
  const nextSess   = todayHr && !todayHr.is_closed && activeSess === null ? nextSession(todayHr.sessions) : null;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Pressable style={[styles.backBtn, { top: insets.top + 8 }]} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
        <Ionicons name="chevron-back" size={22} color={colours.white} />
      </Pressable>
      <ScrollView
        ref={scrollRef}
        stickyHeaderIndices={[1]}
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colours.primary}
            colors={[colours.primary]}
          />
        }
      >
        <View>
          <RestaurantPhotoCarousel photos={restaurant.photos ?? []} coverPhotoUrl={restaurant.cover_photo_url} />
          <View style={styles.infoBlock}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            {restaurant.description ? <Text style={styles.description}>{restaurant.description}</Text> : null}
            {restaurant.address ? <Text style={styles.address}>{restaurant.address}</Text> : null}
            {todayHr && !todayHr.is_closed && todayHr.sessions.length > 0 ? (
              <View style={styles.closingRow}>
                <Ionicons name="time-outline" size={14} color={colours.medium} />
                {activeSess !== null ? (
                  <Text style={styles.closingText}>{s.restaurant.closesAt.replace('{time}', activeSess.closes_at)}</Text>
                ) : nextSess !== null ? (
                  <Text style={styles.closingText}>{s.restaurant.reopensAt.replace('{time}', nextSess.opens_at)}</Text>
                ) : (
                  <Text style={styles.closingText}>
                    {todayHr.sessions.map((sess) => `${sess.opens_at}–${sess.closes_at}`).join('  ·  ')}
                  </Text>
                )}
              </View>
            ) : null}
            <View style={styles.statusRow}><View style={[styles.statusBadge, { backgroundColor: badge.bg }]}><Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text></View></View>
          </View>
        </View>
        <CategoryTabBar categories={sortedCategories} activeIndex={activeTabIndex} onTabPress={handleTabPress} onHeightMeasured={handleTabBarLayout} />
        {sortedCategories.map((cat, i) => (
          <MenuCategorySection key={cat.id} category={cat} sectionIndex={i} onSectionMeasured={handleSectionLayout} getQuantity={getQuantity} onAdd={handleAddItem} onRemove={handleRemoveItem} onPress={handleItemPress} />
        ))}
        {restaurant.id !== undefined && (
          <RestaurantReviewsSection restaurantId={restaurant.id} />
        )}
        <View style={styles.cartBarSpace} />
      </ScrollView>
      <CartBar itemCount={cartItemCount} totalCents={cartTotalCents} onPress={handleCartPress} orderCount={activeOrderCount} onOrdersPress={handleOrdersPress} />
    </SafeAreaView>
  );
}
