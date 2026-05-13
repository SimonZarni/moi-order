import React, { useCallback } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { styles } from './GooglePlaceCard.styles';
import type { GooglePlaceSuggestion } from '@/shared/api/googlePlaces';

interface Props {
  place:     GooglePlaceSuggestion;
  onDismiss: () => void;
}

export function GooglePlaceCard({ place, onDismiss }: Props): React.JSX.Element {
  const handleOpenMaps = useCallback(() => {
    const primary = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`;
    Linking.openURL(primary).catch(() => {
      Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(place.name)}`);
    });
  }, [place]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.gBadge}>
          <Text style={styles.gBadgeText}>G</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>{place.name}</Text>
          {!!place.address && (
            <Text style={styles.address} numberOfLines={1}>{place.address}</Text>
          )}
        </View>
        <Pressable style={styles.dismissBtn} onPress={onDismiss}
          accessibilityRole="button" accessibilityLabel="Dismiss place card">
          <Text style={styles.dismissText}>✕</Text>
        </Pressable>
      </View>

      <Pressable style={styles.mapsBtn} onPress={handleOpenMaps}
        accessibilityRole="button" accessibilityLabel="Open in Google Maps">
        <Text style={styles.mapsBtnText}>Open in Google Maps  →</Text>
      </Pressable>
    </View>
  );
}
