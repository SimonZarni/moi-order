import React, { useCallback, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapboxGL from '@rnmapbox/maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colours } from '@/shared/theme/colours';
import { RootStackParamList } from '@/types/navigation';
import { OpeningHour, Restaurant } from '@/types/models';
import { RESTAURANT_STATUS } from '@/types/enums';
import { useRestaurantListData } from '../hooks/useRestaurantListData';
import { styles } from './RestaurantMapScreen.styles';

const MAPBOX_TOKEN = process.env['EXPO_PUBLIC_MAPBOX_TOKEN'] ?? '';
const MAPBOX_STYLE = process.env['EXPO_PUBLIC_MAPBOX_STYLE'] ?? 'mapbox://styles/mapbox/streets-v12';
const DEFAULT_CENTRE: [number, number] = [100.5018, 13.7563]; // Bangkok

MapboxGL.setAccessToken(MAPBOX_TOKEN);

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  [RESTAURANT_STATUS.Open]:   { bg: '#dcfce7', color: '#16a34a', label: 'Open'   },
  [RESTAURANT_STATUS.Closed]: { bg: colours.infoBg, color: colours.textMuted, label: 'Closed' },
  [RESTAURANT_STATUS.Paused]: { bg: '#fef9c3', color: '#a16207', label: 'Paused' },
};

function todayClosingTime(hours: OpeningHour[] | undefined): string | null {
  if (!hours || hours.length === 0) return null;
  const dayOfWeek = new Date().getDay();
  const today = hours.find((h) => h.day_of_week === dayOfWeek);
  if (!today || today.is_closed || !today.closes_at) return null;
  return today.closes_at;
}

interface PreviewCardProps {
  restaurant: Restaurant;
  onClose: () => void;
  onView: () => void;
}

function RestaurantPreviewCard({ restaurant, onClose, onView }: PreviewCardProps): React.JSX.Element {
  const badge = STATUS_BADGE[restaurant.status] ?? { bg: colours.infoBg, color: colours.textMuted, label: restaurant.status };
  const closingTime = todayClosingTime(restaurant.opening_hours);

  return (
    <View style={styles.bottomCard}>
      <View style={styles.cardTopRow}>
        <Image
          source={restaurant.cover_photo_url ? { uri: restaurant.cover_photo_url } : null}
          style={styles.cardThumb}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.cardMeta}>
          <View style={styles.cardNameRow}>
            <Text style={styles.cardName} numberOfLines={1}>{restaurant.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
            </View>
          </View>
          {restaurant.description ? (
            <Text style={styles.cardDescription} numberOfLines={2}>{restaurant.description}</Text>
          ) : null}
          {closingTime ? (
            <View style={styles.closingRow}>
              <Ionicons name="time-outline" size={12} color={colours.medium} />
              <Text style={styles.closingText}>Closes at {closingTime}</Text>
            </View>
          ) : null}
          {restaurant.address ? (
            <Text style={styles.cardAddress} numberOfLines={1}>{restaurant.address}</Text>
          ) : null}
        </View>
        <Pressable style={styles.closeBtn} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close preview">
          <Text style={styles.closeBtnText}>×</Text>
        </Pressable>
      </View>
      <Pressable style={styles.viewBtn} onPress={onView} accessibilityRole="button" accessibilityLabel={`View ${restaurant.name}`}>
        <Text style={styles.viewBtnText}>View Restaurant →</Text>
      </Pressable>
    </View>
  );
}

export function RestaurantMapScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const cameraRef  = useRef<MapboxGL.Camera>(null);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const { restaurants } = useRestaurantListData();

  const openRestaurants = restaurants.filter(
    (r) => r.latitude !== null && r.longitude !== null,
  );

  const handleMarkerPress = useCallback((r: Restaurant) => {
    setSelected(r);
    if (r.latitude !== null && r.longitude !== null) {
      cameraRef.current?.setCamera({ centerCoordinate: [r.longitude, r.latitude], zoomLevel: 15, animationDuration: 400 });
    }
  }, []);

  const handleView = useCallback(() => {
    if (selected) {
      navigation.navigate('RestaurantDetail', { restaurantId: selected.id });
    }
  }, [navigation, selected]);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
          </Pressable>
          <Text style={styles.headerTitle}>Map</Text>
        </View>
      </SafeAreaView>

      <MapboxGL.MapView style={styles.map} styleURL={MAPBOX_STYLE} attributionEnabled={false} logoEnabled={false}>
        <MapboxGL.Camera ref={cameraRef} centerCoordinate={DEFAULT_CENTRE} zoomLevel={12} animationMode="none" />
        <MapboxGL.UserLocation visible />

        {openRestaurants.map((r) => (
          <MapboxGL.MarkerView key={r.id} coordinate={[r.longitude!, r.latitude!]}>
            <Pressable style={styles.markerContainer} onPress={() => handleMarkerPress(r)} accessibilityRole="button" accessibilityLabel={r.name}>
              <Text style={styles.markerText} numberOfLines={1}>{r.name}</Text>
            </Pressable>
          </MapboxGL.MarkerView>
        ))}
      </MapboxGL.MapView>

      {selected !== null && (
        <RestaurantPreviewCard
          restaurant={selected}
          onClose={() => setSelected(null)}
          onView={handleView}
        />
      )}
    </View>
  );
}
