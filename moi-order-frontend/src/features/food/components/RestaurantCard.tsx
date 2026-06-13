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
  const thumbUri = restaurant.logo_url ?? restaurant.cover_photo_url;
  // is_open_now is the real-time computation from the server (based on opening hours).
  // Falls back to status when not present (e.g. old API versions or unloaded relation).
  const isOpen = restaurant.is_open_now ?? (restaurant.status === RESTAURANT_STATUS.Open);
  // Show "Closed" badge when real-time hours say closed but DB status hasn't caught up yet.
  const displayStatus = !isOpen && restaurant.status === RESTAURANT_STATUS.Open
    ? RESTAURANT_STATUS.Closed
    : restaurant.status;
  const badge = STATUS_BADGE_STYLE[displayStatus];

  return (
    <Pressable
      style={({ pressed }) => [styles.card, !isOpen && styles.cardClosed, pressed && isOpen && styles.cardPressed]}
      onPress={isOpen ? () => onPress(restaurant) : undefined}
      accessibilityRole="button"
      accessibilityLabel={`${restaurant.name}, ${badge.label}`}
      accessibilityState={{ disabled: !isOpen }}
    >
      <Image
        source={thumbUri ? { uri: thumbUri } : null}
        style={styles.thumb}
        contentFit="cover"
        transition={200}
        placeholder={{ blurhash: 'LGF5?xYk^6#M@-5c,1J5@[or[Q6.' }}
      />

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          <View style={[styles.statusBadge, badge.badge]}>
            <Text style={[styles.statusText, badge.text]}>{badge.label}</Text>
          </View>
        </View>

        {restaurant.address !== null && (
          <Text style={styles.address} numberOfLines={1}>{restaurant.address}</Text>
        )}

        <View style={styles.metaRow}>
          {restaurant.is_delivery_available && (
            <View style={styles.metaChip}>
              <Ionicons name="bicycle-outline" size={11} color={colours.tertiary} />
              <Text style={styles.metaText}>Delivery</Text>
            </View>
          )}
          {restaurant.min_order_cents > 0 && (
            <View style={styles.metaChip}>
              <Ionicons name="bag-outline" size={11} color={colours.tertiary} />
              <Text style={styles.metaText}>Min {formatPrice(restaurant.min_order_cents / 100)}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
