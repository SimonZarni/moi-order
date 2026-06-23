import React from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { useStrings } from '@/shared/i18n';
import { useLocaleStore } from '@/shared/store/localeStore';
import { Restaurant } from '@/types/models';
import { RestaurantCard } from '../components/RestaurantCard';
import { FOOD_CATEGORIES, FoodCategory, useFoodScreen } from '../hooks/useFoodScreen';
import { styles } from './FoodScreen.styles';

export function FoodScreen(): React.JSX.Element {
  const {
    restaurants, isLoading, isError, isRefreshing, isFetchingNextPage,
    hasNextPage, fetchNextPage, cartItemCount, activeOrderCount,
    searchText, activeCategory, locationPermissionStatus,
    setSearchText, setActiveCategory,
    handleRestaurantPress, handleAddressPress, handleCartPress, handleOrdersPress, handleBack,
    handleRefresh, requestLocationPermission,
  } = useFoodScreen();
  const s = useStrings();
  const locale = useLocaleStore((state) => state.locale);

  const hero = (
    <View style={styles.hero}>
      <View style={styles.heroRow}>
        <View style={styles.heroLeft}>
          <Pressable style={styles.iconBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={20} color={colours.textOnDark} />
          </Pressable>
          <Text style={[styles.heroTitle, locale === 'mm' && styles.heroTitleMM]}>
            {s.restaurant.listTitle}
          </Text>
        </View>
        <View style={styles.heroActions}>
          <Pressable style={styles.iconBtn} onPress={handleAddressPress} accessibilityRole="button" accessibilityLabel="Addresses and map">
            <Ionicons name="navigate-outline" size={18} color={colours.textOnDark} />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={handleOrdersPress} accessibilityRole="button" accessibilityLabel="My orders">
            <Ionicons name="receipt-outline" size={18} color={colours.textOnDark} />
            {activeOrderCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{activeOrderCount > 9 ? '9+' : activeOrderCount}</Text>
              </View>
            )}
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={handleCartPress} accessibilityRole="button" accessibilityLabel="View cart">
            <Ionicons name="cart-outline" size={18} color={colours.textOnDark} />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount > 9 ? '9+' : cartItemCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.6)" />
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search restaurants or dishes…"
          placeholderTextColor="rgba(255,255,255,0.45)"
          returnKeyType="search"
          accessibilityLabel="Search restaurants"
        />
        {searchText.length > 0 && (
          <Pressable onPress={() => setSearchText('')} accessibilityRole="button" accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.6)" />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryPillsContent}
      >
        {FOOD_CATEGORIES.map((cat: FoodCategory) => (
          <Pressable
            key={cat}
            style={[styles.categoryPill, activeCategory === cat && styles.categoryPillActive]}
            onPress={() => setActiveCategory(cat)}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${cat}`}
            accessibilityState={{ selected: activeCategory === cat }}
          >
            <Text style={[styles.categoryPillText, activeCategory === cat && styles.categoryPillTextActive]}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  if (locationPermissionStatus === 'denied') {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        {hero}
        <View style={styles.body}>
          <View style={styles.locationGate}>
            <Ionicons name="location-outline" size={52} color={colours.primary} />
            <Text style={styles.locationGateTitle}>Location needed</Text>
            <Text style={styles.locationGateText}>
              We use your location to show restaurants that can deliver to you.
            </Text>
            <Pressable
              style={styles.locationGateBtn}
              onPress={() => { void requestLocationPermission(); }}
              accessibilityRole="button"
              accessibilityLabel="Enable location access"
            >
              <Text style={styles.locationGateBtnText}>Enable Location</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {hero}
      <View style={styles.body}>
        {(isLoading || locationPermissionStatus === 'loading') && <ActivityIndicator color={colours.primary} style={{ marginTop: 32 }} />}
        {isError && <Text style={styles.errorText}>Could not load restaurants. Pull to retry.</Text>}
        <FlatList
          data={restaurants}
          keyExtractor={(r) => String(r.id)}
          renderItem={({ item }: { item: Restaurant }) => (
            <RestaurantCard restaurant={item} onPress={handleRestaurantPress} />
          )}
          style={styles.flatList}
          contentContainerStyle={styles.list}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colours.primary} colors={[colours.primary]} />}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colours.primary} /> : null}
          ListEmptyComponent={(!isLoading && locationPermissionStatus !== 'loading') ? <View style={styles.emptyState}><Text style={styles.emptyText}>No restaurants found</Text></View> : null}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
