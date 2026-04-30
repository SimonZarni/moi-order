import React, { useCallback, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapboxGL from '@rnmapbox/maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { Restaurant } from '@/types/models';
import { RESTAURANT_STATUS } from '@/types/enums';
import { useRestaurantListData } from '../hooks/useRestaurantListData';
import { styles } from './RestaurantMapScreen.styles';

const MAPBOX_TOKEN = process.env['EXPO_PUBLIC_MAPBOX_TOKEN'] ?? '';
const MAPBOX_STYLE = process.env['EXPO_PUBLIC_MAPBOX_STYLE'] ?? 'mapbox://styles/mapbox/streets-v12';
const DEFAULT_CENTRE: [number, number] = [100.5018, 13.7563]; // Bangkok

MapboxGL.setAccessToken(MAPBOX_TOKEN);

export function RestaurantMapScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const cameraRef  = useRef<MapboxGL.Camera>(null);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const { restaurants } = useRestaurantListData();

  const openRestaurants = restaurants.filter(
    (r) => r.latitude !== null && r.longitude !== null && r.status === RESTAURANT_STATUS.Open,
  );

  const handleMarkerPress = useCallback((r: Restaurant) => {
    setSelected(r);
    if (r.latitude !== null && r.longitude !== null) {
      cameraRef.current?.setCamera({ centerCoordinate: [r.longitude, r.latitude], zoomLevel: 15, animationDuration: 400 });
    }
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
        <Text style={styles.backText}>←</Text>
      </Pressable>

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
        <View style={styles.bottomCard}>
          <Text style={styles.bottomCardName}>{selected.name}</Text>
          {selected.address !== null && <Text style={styles.bottomCardAddress}>{selected.address}</Text>}
          <Pressable
            style={styles.viewBtn}
            onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: selected.id })}
            accessibilityRole="button"
            accessibilityLabel={`View ${selected.name}`}
          >
            <Text style={styles.viewBtnText}>View Restaurant</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
