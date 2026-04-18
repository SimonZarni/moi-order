import React from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { StickyBackButton } from '@/shared/components/StickyBackButton/StickyBackButton';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { PlaceCard } from '@/features/places/components/PlaceCard';
import { PlaceCardSkeleton } from '@/features/places/components/PlaceCardSkeleton';
import { PlacesSearchBar } from '@/features/places/components/PlacesSearchBar';
import { usePlacesScreen } from '@/features/places/hooks/usePlacesScreen';
import { Place } from '@/types/models';
import { styles } from './PlacesScreen.styles';

const SKELETON_COUNT = 5;

export function PlacesScreen(): React.JSX.Element {
  const {
    filteredPlaces,
    categories,
    isLoading,
    isError,
    isRefreshing,
    isFetchingNextPage,
    query,
    selectedCategory,
    handleQueryChange,
    handleCategorySelect,
    handleEndReached,
    handleRefresh,
    handlePlacePress,
    handleBack,
  } = usePlacesScreen();

  const header = (
    <>
      <HeroHeader
        accentColor={editorialPalette.gold}
        onBack={handleBack}
        backLabel="Back"
        hideBack
        titleNode={
          <Text style={styles.heroInlineTitle}>
            <Text style={styles.heroInlineTitleAccent}>Explore </Text>
            Places
          </Text>
        }
        subtitle="Immigration offices & services"
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StickyBackButton onPress={handleBack} label="Back" />
        <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false} contentContainerStyle={styles.list}>
          {header}
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <PlaceCardSkeleton key={i} />
          ))}
        </ScrollView>
        <FloatingTabBar />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StickyBackButton onPress={handleBack} label="Back" />
        {header}
        <View style={styles.stateBox}>
          <Ionicons name="warning" size={36} color={colours.textMuted} style={styles.stateIcon} />
          <Text style={styles.stateTitle}>Could not load places</Text>
          <Text style={styles.stateSubtitle}>Pull down to retry</Text>
        </View>
        <FloatingTabBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StickyBackButton onPress={handleBack} label="Back" />
      <FlatList
        data={filteredPlaces}
        keyExtractor={(item: Place) => String(item.id)}
        renderItem={({ item }) => (
          <PlaceCard place={item} onPress={handlePlacePress} />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View style={styles.stateBox}>
            <Ionicons name="search" size={36} color={colours.textMuted} style={styles.stateIcon} />
            <Text style={styles.stateTitle}>No places found</Text>
            <Text style={styles.stateSubtitle}>Try a different search or category</Text>
          </View>
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
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