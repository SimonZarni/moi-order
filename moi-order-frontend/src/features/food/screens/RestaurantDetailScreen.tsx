import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { RESTAURANT_STATUS } from '@/types/enums';
import { MenuCategory, OpeningHour } from '@/types/models';
import { MenuItemRow } from '../components/MenuItemRow';
import { CartBar } from '../components/CartBar';
import { useRestaurantDetailScreen } from '../hooks/useRestaurantDetailScreen';
import { styles } from './RestaurantDetailScreen.styles';

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  [RESTAURANT_STATUS.Open]:   { bg: '#dcfce7', color: '#16a34a', label: 'Open'   },
  [RESTAURANT_STATUS.Closed]: { bg: colours.infoBg, color: colours.textMuted, label: 'Closed' },
  [RESTAURANT_STATUS.Paused]: { bg: '#fef9c3', color: '#a16207', label: 'Paused' },
};

function todayHours(hours: OpeningHour[] | undefined): OpeningHour | null {
  if (!hours || hours.length === 0) return null;
  const dayOfWeek = new Date().getDay(); // 0 = Sunday … 6 = Saturday
  return hours.find((h) => h.day_of_week === dayOfWeek) ?? null;
}

export function RestaurantDetailScreen(): React.JSX.Element {
  const {
    restaurant, isLoading, isError,
    cartItemCount, cartTotalCents, getQuantity,
    handleBack, handleAddItem, handleRemoveItem, handleCartPress,
  } = useRestaurantDetailScreen();

  if (isLoading) {
    return <SafeAreaView style={styles.root} edges={['top']}><ActivityIndicator color={colours.primary} style={{ marginTop: 80 }} /></SafeAreaView>;
  }
  if (isError || !restaurant) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={colours.white} />
        </Pressable>
        <View style={styles.stateBox}><Text style={styles.stateText}>Could not load restaurant.</Text></View>
      </SafeAreaView>
    );
  }

  const badge: { bg: string; color: string; label: string } = STATUS_BADGE[restaurant.status] ?? { bg: colours.infoBg, color: colours.textMuted, label: restaurant.status };
  const todayHour  = todayHours(restaurant.opening_hours);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
        <Ionicons name="chevron-back" size={22} color={colours.white} />
      </Pressable>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Image source={restaurant.cover_photo_url ? { uri: restaurant.cover_photo_url } : null} style={styles.cover} contentFit="cover" transition={200} />
        <View style={styles.infoBlock}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          {restaurant.description ? (
            <Text style={styles.description}>{restaurant.description}</Text>
          ) : null}
          {restaurant.address ? <Text style={styles.address}>{restaurant.address}</Text> : null}
          {todayHour && !todayHour.is_closed && todayHour.closes_at ? (
            <View style={styles.closingRow}>
              <Ionicons name="time-outline" size={14} color={colours.medium} />
              <Text style={styles.closingText}>Closes at {todayHour.closes_at}</Text>
            </View>
          ) : null}
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
            </View>
          </View>
        </View>

        {(restaurant.menu ?? []).length === 0 && (
          <View style={styles.emptyMenu}><Text style={styles.emptyMenuText}>Menu not available yet.</Text></View>
        )}

        {(restaurant.menu ?? []).map((category: MenuCategory) => (
          <View key={category.id}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
            <View style={styles.itemsCard}>
              {(category.items ?? []).map((item) => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  quantity={getQuantity(item.id)}
                  onAdd={handleAddItem}
                  onRemove={handleRemoveItem}
                />
              ))}
            </View>
          </View>
        ))}

        <View style={styles.cartBarSpace} />
      </ScrollView>

      <CartBar itemCount={cartItemCount} totalCents={cartTotalCents} onPress={handleCartPress} />
    </SafeAreaView>
  );
}
