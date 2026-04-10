import React from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
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
    handleBack,
  } = usePlacesScreen();

  const header = (
    <>
    <View style={styles.hero}>
      <View style={styles.orbLarge} />
      <View style={styles.orbSmall} />

      <Pressable style={styles.backBtn} onPress={handleBack}
        accessibilityLabel="Go back to home" accessibilityRole="button">
        <Text style={styles.backArrow}>‹</Text>
        <Text style={styles.backLabel}>Back</Text>
      </Pressable>

      <View style={styles.heroTextBlock}>
        <Text style={styles.heroEyebrow}>Explore</Text>
        <Text style={styles.heroTitle}>Places</Text>
        <Text style={styles.heroSubtitle}>Immigration offices & services</Text>
      </View>
    </View>
    <View style={styles.bodyGap} />
    </>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        {header}
        <View style={styles.stateBox}>
          <ActivityIndicator size="large" color={styles.spinner.color} />
        </View>
        <FloatingTabBar />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        {header}
        <View style={styles.stateBox}>
          <Text style={styles.stateIcon}>⚠</Text>
          <Text style={styles.stateTitle}>Could not load places</Text>
          <Text style={styles.stateSubtitle}>Pull down to retry</Text>
        </View>
        <FloatingTabBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <FlatList
        data={places}
        keyExtractor={(item: Place) => String(item.id)}
        renderItem={({ item }) => <PlaceCard place={item} onPress={handlePlacePress} />}
        ListHeaderComponent={header}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        onRefresh={handleRefresh}
        refreshing={false}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          isFetchingNextPage
            ? <ActivityIndicator style={styles.listFooter} color={styles.spinner.color} />
            : null
        }
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={true}
        accessibilityRole="list"
        showsVerticalScrollIndicator={false}
      />
      <FloatingTabBar />
    </SafeAreaView>
  );
}
