import React from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { Restaurant } from '@/types/models';
import { RestaurantCard } from '../components/RestaurantCard';
import { useFoodScreen } from '../hooks/useFoodScreen';
import { styles } from './FoodScreen.styles';

export function FoodScreen(): React.JSX.Element {
  const {
    restaurants, isLoading, isError, isFetchingNextPage,
    hasNextPage, fetchNextPage, cartItemCount,
    handleRestaurantPress, handleMapPress, handleCartPress,
  } = useFoodScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.hero}>
        <View style={styles.heroRow}>
          <Text style={styles.heroTitle}>Restaurants</Text>
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
          ListEmptyComponent={!isLoading ? <View style={styles.emptyState}><Text style={styles.emptyText}>No restaurants open right now</Text></View> : null}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
