import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Restaurant } from '@/types/models';
import { RESTAURANT_STATUS } from '@/types/enums';
import { colours } from '@/shared/theme/colours';
import { formatPrice } from '@/shared/utils/formatCurrency';
import { styles } from './RestaurantCard.styles';

interface Props {
  restaurant: Restaurant;
  onPress: (restaurant: Restaurant) => void;
}

const STATUS_BADGE_STYLE = {
  [RESTAURANT_STATUS.Open]:   { badge: styles.statusBadgeOpen,   text: styles.statusTextOpen,   label: 'Open'   },
  [RESTAURANT_STATUS.Closed]: { badge: styles.statusBadgeClosed, text: styles.statusTextClosed, label: 'Closed' },
  [RESTAURANT_STATUS.Paused]: { badge: styles.statusBadgePaused, text: styles.statusTextPaused, label: 'Paused' },
};

export function RestaurantCard({ restaurant, onPress }: Props): React.JSX.Element {
  const badge = STATUS_BADGE_STYLE[restaurant.status];

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(restaurant)}
      accessibilityRole="button"
      accessibilityLabel={`${restaurant.name}, ${badge.label}`}
    >
      <Image
        source={{ uri: restaurant.cover_photo_url ?? undefined }}
        style={styles.cover}
        contentFit="cover"
        transition={200}
        placeholder={{ blurhash: 'LGF5?xYk^6#M@-5c,1J5@[or[Q6.' }}
      />
      <View style={styles.body}>
        <View style={styles.headerRow}>
          {restaurant.logo_url !== null && (
            <Image source={{ uri: restaurant.logo_url }} style={styles.logo} contentFit="cover" />
          )}
          <View style={styles.nameBlock}>
            <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
            {restaurant.address !== null && (
              <Text style={styles.address} numberOfLines={1}>{restaurant.address}</Text>
            )}
          </View>
          <View style={[styles.statusBadge, badge.badge]}>
            <Text style={[styles.statusText, badge.text]}>{badge.label}</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          {restaurant.min_order_cents > 0 && (
            <View style={styles.metaItem}>
              <Ionicons name="bag-outline" size={12} color={colours.medium} />
              <Text style={styles.metaText}>Min {formatPrice(restaurant.min_order_cents / 100)}</Text>
            </View>
          )}
          {restaurant.is_delivery_available && (
            <View style={styles.metaItem}>
              <Ionicons name="bicycle-outline" size={12} color={colours.medium} />
              <Text style={styles.metaText}>Delivery</Text>
            </View>
          )}
          {restaurant.is_pickup_available && (
            <View style={styles.metaItem}>
              <Ionicons name="storefront-outline" size={12} color={colours.medium} />
              <Text style={styles.metaText}>Pickup</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
