import React from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { Restaurant } from '@/types/models';
import { RestaurantCard } from '../components/RestaurantCard';
import { FOOD_CATEGORIES, FoodCategory, useFoodScreen } from '../hooks/useFoodScreen';
import { styles } from './FoodScreen.styles';

export function FoodScreen(): React.JSX.Element {
  const {
    restaurants, isLoading, isError, isFetchingNextPage,
    hasNextPage, fetchNextPage, cartItemCount,
    searchText, activeCategory,
    setSearchText, setActiveCategory,
    handleRestaurantPress, handleMapPress, handleCartPress, handleBack,
  } = useFoodScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.hero}>
        <View style={styles.heroRow}>
          <View style={styles.heroLeft}>
            <Pressable style={styles.iconBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
              <Ionicons name="arrow-back" size={20} color={colours.textOnDark} />
            </Pressable>
            <Text style={styles.heroTitle}>Restaurants</Text>
          </View>
          <View style={styles.heroActions}>
            <Pressable style={styles.iconBtn} onPress={handleMapPress} accessibilityRole="button" accessibilityLabel="View map">
              <Ionicons name="map-outline" size={20} color={colours.textOnDark} />
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={handleCartPress} accessibilityRole="button" accessibilityLabel="View cart">
              <Ionicons name="bag-outline" size={20} color={colours.textOnDark} />
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

      <View style={styles.body}>
        {isLoading && <ActivityIndicator color={colours.primary} style={{ marginTop: 32 }} />}
        {isError && <Text style={styles.errorText}>Could not load restaurants. Pull to retry.</Text>}
        <FlatList
          data={restaurants}
          keyExtractor={(r) => String(r.id)}
          renderItem={({ item }: { item: Restaurant }) => (
            <RestaurantCard restaurant={item} onPress={handleRestaurantPress} />
          )}
          contentContainerStyle={styles.list}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colours.primary} /> : null}
          ListEmptyComponent={!isLoading ? <View style={styles.emptyState}><Text style={styles.emptyText}>No restaurants found</Text></View> : null}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
