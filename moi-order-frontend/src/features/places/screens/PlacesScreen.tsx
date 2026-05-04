import React from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';

import { StandaloneFloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';

import { PlaceCard } from '@/features/places/components/PlaceCard';
import { PlaceCardSkeleton } from '@/features/places/components/PlaceCardSkeleton';
import { usePlacesScreen } from '@/features/places/hooks/usePlacesScreen';

import { Category, Place } from '@/types/models';
import { styles } from './PlacesScreen.styles';

const SKELETON_COUNT = 4;
const HERO_MIN_HEIGHT = 140;

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

      {/* Search input */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrap}>
          <Ionicons name="search" size={15} color={colours.medium} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={handleQueryChange}
            placeholder="Search places…"
            placeholderTextColor={colours.medium}
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel="Search places"
            accessibilityRole="search"
          />
          {query.length > 0 && (
            <Pressable
              style={styles.clearBtn}
              onPress={() => handleQueryChange('')}
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={14} color={colours.medium} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Horizontal category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsRow}
        contentContainerStyle={styles.chipsContent}
      >
        <Pressable
          style={[styles.chip, selectedCategory === null && styles.chipActive]}
          onPress={() => handleCategorySelect(null)}
          accessibilityLabel="All categories"
          accessibilityRole="button"
          accessibilityState={{ selected: selectedCategory === null }}
        >
          <Text style={[styles.chipLabel, selectedCategory === null && styles.chipLabelActive]}>
            All
          </Text>
        </Pressable>

        {categories.map((cat: Category) => {
          const isActive = selectedCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => handleCategorySelect(cat.id)}
              accessibilityLabel={cat.name_en}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                {cat.name_en}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.bodyGap} />
    </>
  );

  if (isPlacesLoading) {
    return (
      <>
        <SafeAreaView style={styles.root} edges={['top']}>
          {hero}
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={styles.list}
          >
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
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={5}
          removeClippedSubviews
          accessibilityRole="list"
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
      <StandaloneFloatingTabBar />
    </>
  );
}
