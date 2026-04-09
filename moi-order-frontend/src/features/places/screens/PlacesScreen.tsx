import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PlaceCard } from '@/features/places/components/PlaceCard';
import { usePlacesScreen } from '@/features/places/hooks/usePlacesScreen';
import { Place } from '@/types/models';
import { styles } from './PlacesScreen.styles';

export function PlacesScreen(): React.JSX.Element {
  const {
    places,
    isLoading,
    isError,
    isFetchingNextPage,
    handleEndReached,
    handleRefresh,
    handlePlacePress,
  } = usePlacesScreen();

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  if (isError) {
    return <View style={styles.centered}><Text style={styles.errorText}>Failed to load places.</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerSub}>Explore</Text>
        <Text style={styles.headerTitle}>Places</Text>
      </View>
      <FlatList
        data={places}
        keyExtractor={(item: Place) => String(item.id)}
        renderItem={({ item }) => <PlaceCard place={item} onPress={handlePlacePress} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        onRefresh={handleRefresh}
        refreshing={false}
        contentContainerStyle={styles.list}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={styles.footer} /> : null}
        accessibilityRole="list"
      />
    </SafeAreaView>
  );
}
