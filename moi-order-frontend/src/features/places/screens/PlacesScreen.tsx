import React from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StandaloneFloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { PlaceCard } from '@/features/places/components/PlaceCard';
import { PlaceCardSkeleton } from '@/features/places/components/PlaceCardSkeleton';
import { PlacesSearchBar } from '@/features/places/components/PlacesSearchBar';
import { usePlacesScreen } from '@/features/places/hooks/usePlacesScreen';
import { Place } from '@/types/models';
import { styles } from './PlacesScreen.styles';

const SKELETON_COUNT = 5;
const HERO_MIN_HEIGHT = 152;

export function PlacesScreen(): React.JSX.Element {
  const {
    placesListRef,
    filteredPlaces, categories, isPlacesLoading, isPlacesError,
    isPlacesRefreshing, isPlacesFetchingNextPage,
    query, selectedCategory, handleQueryChange, handleCategorySelect,
    handlePlacesEndReached, handlePlacesRefresh, handlePlacePress,
    handleBack,
  } = usePlacesScreen();

  const hero = (
    <>
      <HeroHeader
        accentColor={editorialPalette.gold}
        onBack={handleBack}
        backLabel="Back"
        titleNode={
          <Text>
            <Text style={[styles.heroTitleAccent, { color: editorialPalette.gold }]}>Explore </Text>
            <Text style={styles.heroTitleMain}>Places</Text>
          </Text>
        }
        subtitle="Attractions & landmarks"
        minHeight={HERO_MIN_HEIGHT}
      />
      <PlacesSearchBar
        query={query}
        onQueryChange={handleQueryChange}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      <View style={styles.bodyGap} />
    </>
  );

  if (isPlacesLoading) {
    return (
      <>
        <SafeAreaView style={styles.root} edges={['top']}>
          {hero}
          <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false} contentContainerStyle={styles.list}>
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </ScrollView>
        </SafeAreaView>
        <StandaloneFloatingTabBar />
      </>
    );
  }

  if (isPlacesError) {
    return (
      <>
        <SafeAreaView style={styles.root} edges={['top']}>
          {hero}
          <View style={styles.stateBox}>
            <Ionicons name="warning" size={36} color={colours.textMuted} style={styles.stateIcon} />
            <Text style={styles.stateTitle}>Could not load places</Text>
            <Text style={styles.stateSubtitle}>Pull down to retry</Text>
          </View>
        </SafeAreaView>
        <StandaloneFloatingTabBar />
      </>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.root} edges={['top']}>
        {hero}
        <FlatList
          ref={placesListRef}
          data={filteredPlaces}
          keyExtractor={(item: Place) => String(item.id)}
          renderItem={({ item }) => <PlaceCard place={item} onPress={handlePlacePress} />}
          ListEmptyComponent={
            <View style={styles.stateBox}>
              <Ionicons name="search" size={36} color={colours.textMuted} style={styles.stateIcon} />
              <Text style={styles.stateTitle}>No places found</Text>
              <Text style={styles.stateSubtitle}>Try a different search or category</Text>
            </View>
          }
          onEndReached={handlePlacesEndReached}
          onEndReachedThreshold={0.4}
          onRefresh={handlePlacesRefresh}
          refreshing={isPlacesRefreshing}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            isPlacesFetchingNextPage
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
      </SafeAreaView>
      <StandaloneFloatingTabBar />
    </>
  );
}
