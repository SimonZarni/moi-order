import React from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { RESTAURANT_STATUS } from '@/types/enums';
import { OpeningHour } from '@/types/models';
import { useStrings } from '@/shared/i18n';
import { CategoryTabBar } from '../components/CategoryTabBar';
import { MenuCategorySection } from '../components/MenuCategorySection';
import { CartBar } from '../components/CartBar';
import { useRestaurantDetailScreen } from '../hooks/useRestaurantDetailScreen';
import { styles } from './RestaurantDetailScreen.styles';

function todayHours(hours: OpeningHour[] | undefined): OpeningHour | null {
  if (!hours?.length) return null;
  return hours.find((h) => h.day_of_week === new Date().getDay()) ?? null;
}

export function RestaurantDetailScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const s      = useStrings();
  const {
    restaurant, isLoading, isError, sortedCategories, activeTabIndex, scrollRef,
    cartItemCount, cartTotalCents, getQuantity,
    isRefreshing, handleBack, handleRefresh,
    handleTabPress, handleTabBarLayout, handleSectionLayout,
    handleScroll, handleAddItem, handleRemoveItem, handleItemPress, handleCartPress,
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

  return (
    <SafeAreaView style={styles.root} edges={[]}>
      <Pressable style={[styles.backBtn, { top: insets.top + 8 }]} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
        <Ionicons name="chevron-back" size={22} color={colours.white} />
      </Pressable>
      <ScrollView
        ref={scrollRef}
        stickyHeaderIndices={[1]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
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
          <Image source={restaurant.cover_photo_url ? { uri: restaurant.cover_photo_url } : null} style={styles.cover} contentFit="cover" transition={200} />
          <View style={styles.infoBlock}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            {restaurant.description ? <Text style={styles.description}>{restaurant.description}</Text> : null}
            {restaurant.address ? <Text style={styles.address}>{restaurant.address}</Text> : null}
            {todayHr && !todayHr.is_closed && todayHr.closes_at ? <View style={styles.closingRow}><Ionicons name="time-outline" size={14} color={colours.medium} /><Text style={styles.closingText}>{s.restaurant.closesAt.replace('{time}', todayHr.closes_at)}</Text></View> : null}
            <View style={styles.statusRow}><View style={[styles.statusBadge, { backgroundColor: badge.bg }]}><Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text></View></View>
          </View>
        </View>
        <CategoryTabBar categories={sortedCategories} activeIndex={activeTabIndex} onTabPress={handleTabPress} onHeightMeasured={handleTabBarLayout} />
        {sortedCategories.map((cat, i) => (
          <MenuCategorySection key={cat.id} category={cat} sectionIndex={i} onSectionMeasured={handleSectionLayout} getQuantity={getQuantity} onAdd={handleAddItem} onRemove={handleRemoveItem} onPress={handleItemPress} />
        ))}
        <View style={styles.cartBarSpace} />
      </ScrollView>
      <CartBar itemCount={cartItemCount} totalCents={cartTotalCents} onPress={handleCartPress} />
    </SafeAreaView>
  );
}
