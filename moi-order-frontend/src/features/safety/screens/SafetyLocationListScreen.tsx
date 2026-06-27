import React from 'react';
import { ActivityIndicator, FlatList, Image, Linking, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useSafetyLocationListScreen } from '@/features/safety/hooks/useSafetyLocationListScreen';
import { StandaloneFloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { colours } from '@/shared/theme/colours';
import { SafetyLocation } from '@/types/models';
import { styles } from './SafetyLocationListScreen.styles';

const CATEGORY_LABELS: Record<string, string> = {
  hospital:       'Hospitals',
  police_station: 'Police Stations',
  rescue:         'Rescue Services',
};

const CATEGORY_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  hospital:       'medkit-outline',
  police_station: 'shield-outline',
  rescue:         'flame-outline',
};

export function SafetyLocationListScreen(): React.JSX.Element {
  const {
    locations, category, isLoading, isError,
    isRefreshing, isFetchingNextPage,
    handleEndReached, handleRefresh, handleLocationPress, handleBack,
  } = useSafetyLocationListScreen();

  const title = CATEGORY_LABELS[category] ?? 'Safety Locations';
  const icon  = CATEGORY_ICONS[category]  ?? 'shield-outline';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        data={locations}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <LocationCard location={item} icon={icon} onPress={handleLocationPress} />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        accessibilityRole="list"
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.empty}>
              <ActivityIndicator size="large" color={colours.primary} />
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {isError ? 'Unable to load. Pull down to retry.' : 'No locations available.'}
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={colours.primary} />
            </View>
          ) : null
        }
      />
      <StandaloneFloatingTabBar />
    </SafeAreaView>
  );
}

// ── LocationCard ──────────────────────────────────────────────────────────────

interface LocationCardProps {
  location: SafetyLocation;
  icon:     React.ComponentProps<typeof Ionicons>['name'];
  onPress:  (location: SafetyLocation) => void;
}

function LocationCard({ location, icon, onPress }: LocationCardProps): React.JSX.Element {
  const handleCall = (): void => {
    if (location.phone) Linking.openURL(`tel:${location.phone}`);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(location)}
      accessibilityLabel={location.name}
      accessibilityRole="button"
    >
      {location.cover_photo_url ? (
        <Image source={{ uri: location.cover_photo_url }} style={styles.thumb} resizeMode="cover" />
      ) : (
        <View style={styles.thumbPlaceholder}>
          <Ionicons name={icon} size={26} color={colours.primary} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{location.name}</Text>
        {location.sub_category ? (
          <Text style={styles.category} numberOfLines={1}>{location.sub_category}</Text>
        ) : null}
        {location.phone ? (
          <View style={styles.phoneRow}>
            <Ionicons name="call-outline" size={12} color={colours.primary} />
            <Text style={styles.phone} numberOfLines={1}>{location.phone}</Text>
          </View>
        ) : null}
        {location.location ? (
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={12} color={colours.textMuted} />
            <Text style={styles.address} numberOfLines={1}>{location.location}</Text>
          </View>
        ) : null}
      </View>

      {location.phone ? (
        <Pressable
          style={({ pressed }) => [styles.callBtn, pressed && styles.callBtnPressed]}
          onPress={handleCall}
          accessibilityLabel={`Call ${location.name}`}
          accessibilityRole="button"
          hitSlop={8}
        >
          <Ionicons name="call-outline" size={18} color={colours.primary} />
        </Pressable>
      ) : (
        <View style={styles.callBtnSpacer} />
      )}
    </Pressable>
  );
}
