import React from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useSafetyLocationListScreen } from '@/features/safety/hooks/useSafetyLocationListScreen';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { StandaloneFloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { colours } from '@/shared/theme/colours';
import { SafetyLocation } from '@/types/models';
import { styles } from './SafetyLocationListScreen.styles';

const CATEGORY_LABELS: Record<string, string> = {
  hospital:       'Hospitals',
  police_station: 'Police Stations',
  rescue:         'Rescue Services',
};

const CATEGORY_ACCENT: Record<string, string> = {
  hospital:       '#e53935',
  police_station: '#1565c0',
  rescue:         '#f57c00',
};

const CATEGORY_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  hospital:       'medkit-outline',
  police_station: 'shield-outline',
  rescue:         'flame-outline',
};

export function SafetyLocationListScreen(): React.JSX.Element {
  const {
    locations, category, isLoading, isError, isRefreshing,
    hasNextPage, isFetchingNextPage,
    handleEndReached, handleRefresh, handleLocationPress, handleBack,
  } = useSafetyLocationListScreen();

  const accentColor = CATEGORY_ACCENT[category] ?? colours.danger;
  const title       = CATEGORY_LABELS[category] ?? 'Safety Locations';
  const icon        = CATEGORY_ICONS[category] ?? 'shield-outline';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HeroHeader
        accentColor={accentColor}
        title={title}
        subtitle="Tap a location for contact details and directions."
        onBack={handleBack}
        backLabel="Home"
      />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        data={locations}
        keyExtractor={(item: SafetyLocation) => String(item.id)}
        renderItem={({ item }) => (
          <LocationCard
            location={item}
            accentColor={accentColor}
            icon={icon}
            onPress={handleLocationPress}
          />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        accessibilityRole="list"
        ListEmptyComponent={
          isLoading ? null : (
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
  location:    SafetyLocation;
  accentColor: string;
  icon:        React.ComponentProps<typeof Ionicons>['name'];
  onPress:     (location: SafetyLocation) => void;
}

function LocationCard({ location, accentColor, icon, onPress }: LocationCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(location)}
      accessibilityLabel={location.name}
      accessibilityRole="button"
    >
      {location.cover_photo_url ? (
        <Image source={{ uri: location.cover_photo_url }} style={styles.coverImage} resizeMode="cover" />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Ionicons name={icon} size={32} color={accentColor} />
        </View>
      )}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{location.name}</Text>
        {location.sub_category ? (
          <Text style={[styles.cardSubCategory, { color: accentColor }]}>
            {location.sub_category}
          </Text>
        ) : null}
        {location.location ? (
          <Text style={styles.cardLocation} numberOfLines={2}>{location.location}</Text>
        ) : null}
        {location.phone ? (
          <Text style={styles.cardPhone}>{location.phone}</Text>
        ) : null}
      </View>
      <View style={styles.cardChevron}>
        <Ionicons name="chevron-forward" size={16} color={colours.textMuted} />
      </View>
    </Pressable>
  );
}
