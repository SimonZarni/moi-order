import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './RestaurantInfoCard.styles';
import { colours } from '../../../shared/theme/colours';
import { RESTAURANT_STATUS } from '../../../types/enums';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import type { BusinessProfileRestaurant } from '../../../types/models';

interface RestaurantInfoCardProps {
  restaurant: BusinessProfileRestaurant;
}

interface DetailRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps): React.JSX.Element {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={14} color={colours.textMuted} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const STATUS_COLOUR: Record<string, string> = {
  [RESTAURANT_STATUS.Open]:   colours.success,
  [RESTAURANT_STATUS.Closed]: colours.error,
  [RESTAURANT_STATUS.Paused]: colours.warning,
};

export function RestaurantInfoCard({ restaurant }: RestaurantInfoCardProps): React.JSX.Element {
  const statusColour = STATUS_COLOUR[restaurant.status] ?? colours.textMuted;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Restaurant</Text>
      <View style={styles.card}>
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName} numberOfLines={1}>{restaurant.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColour + '22' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColour }]} />
            <Text style={[styles.statusText, { color: statusColour }]}>{restaurant.status_label}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {restaurant.address !== null && (
          <DetailRow icon="location-outline" label="Address" value={restaurant.address} />
        )}
        {restaurant.phone !== null && (
          <DetailRow icon="call-outline" label="Phone" value={restaurant.phone} />
        )}
        <DetailRow
          icon="cash-outline"
          label="Min. Order"
          value={formatPrice(restaurant.min_order_cents)}
        />

        <View style={styles.optionsRow}>
          <View style={[styles.optionChip, restaurant.is_delivery_available && styles.optionChipActive]}>
            <Ionicons
              name="bicycle-outline"
              size={13}
              color={restaurant.is_delivery_available ? colours.primary : colours.textSubtle}
            />
            <Text style={[styles.optionText, restaurant.is_delivery_available && styles.optionTextActive]}>
              Delivery
            </Text>
          </View>
          <View style={[styles.optionChip, restaurant.is_pickup_available && styles.optionChipActive]}>
            <Ionicons
              name="bag-outline"
              size={13}
              color={restaurant.is_pickup_available ? colours.primary : colours.textSubtle}
            />
            <Text style={[styles.optionText, restaurant.is_pickup_available && styles.optionTextActive]}>
              Pickup
            </Text>
          </View>
        </View>

        <View style={styles.editHint}>
          <Ionicons name="information-circle-outline" size={14} color={colours.textSubtle} />
          <Text style={styles.editHintText}>Edit restaurant details from the Restaurant tab.</Text>
        </View>
      </View>
    </View>
  );
}
