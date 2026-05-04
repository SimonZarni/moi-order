import React, { useRef, useEffect, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
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
    displayedPlaces, categories, isPlacesLoading, isPlacesError,
    isPlacesRefreshing, isPlacesFetchingNextPage,
    query, selectedCategory, selectedCategoryLabel, isCategoryModalOpen,
    mode, distanceFor, isFavorited,
    handleQueryChange, handleCategorySelectAndClose,
    handleCategoryModalOpen, handleCategoryModalClose,
    handlePlacesEndReached, handlePlacesRefresh, handlePlacePress,
    handleFavoritePress, handleModeToggle,
    handleBack,
  } = usePlacesScreen();

  // Category modal animation — backdrop fades instantly, card slides up
  const [catModalVisible, setCatModalVisible] = useState(false);
  const catBackdropAnim = useRef(new Animated.Value(0)).current;
  const catCardAnim     = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (isCategoryModalOpen) {
      setCatModalVisible(true);
      Animated.parallel([
        Animated.timing(catBackdropAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.spring(catCardAnim, { toValue: 0, damping: 22, stiffness: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(catBackdropAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(catCardAnim, { toValue: 300, duration: 180, useNativeDriver: true }),
      ]).start(() => setCatModalVisible(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCategoryModalOpen]);

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

      {/* Search + category filter row */}
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
              <Ionicons name="close" size={14} color="rgba(255,255,255,0.85)" />
            </Pressable>
          )}
        </View>

        <Pressable
          style={[styles.categoryBtn, selectedCategory !== null && styles.categoryBtnActive]}
          onPress={handleCategoryModalOpen}
          accessibilityLabel={`Filter by category: ${selectedCategoryLabel}`}
          accessibilityRole="button"
        >
          <Ionicons
            name="filter"
            size={13}
            color={selectedCategory !== null ? colours.backgroundDark : 'rgba(255,255,255,0.65)'}
          />
          <Text
            style={[styles.categoryBtnLabel, selectedCategory !== null && styles.categoryBtnLabelActive]}
            numberOfLines={1}
          >
            {selectedCategoryLabel}
          </Text>
          <Ionicons
            name="chevron-down"
            size={11}
            color={selectedCategory !== null ? colours.backgroundDark : 'rgba(255,255,255,0.45)'}
          />
        </Pressable>

        {/* Mode toggle: all → nearby (📍) → favorites (❤️) */}
        <Pressable
          style={[styles.modeBtn, mode !== 'all' && styles.modeBtnActive]}
          onPress={handleModeToggle}
          accessibilityRole="button"
          accessibilityLabel={mode === 'all' ? 'Sort by nearby' : mode === 'nearby' ? 'Show favorites first' : 'Back to all places'}
        >
          <Ionicons
            name={mode === 'favorites' ? 'heart' : 'location'}
            size={15}
            color={mode !== 'all' ? colours.backgroundDark : 'rgba(255,255,255,0.75)'}
          />
        </Pressable>
      </View>

      <View style={styles.bodyGap} />

      {/* Category picker modal — backdrop fades instantly, card slides up */}
      <Modal
        visible={catModalVisible}
        transparent
        animationType="none"
        onRequestClose={handleCategoryModalClose}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: catBackdropAnim }]} pointerEvents="box-none">
          <Pressable style={{ flex: 1 }} onPress={handleCategoryModalClose} accessibilityRole="none" />
        </Animated.View>
        <Animated.View style={[styles.catCardContainer, { transform: [{ translateY: catCardAnim }] }]}>
          <View style={styles.modalSheet} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Category</Text>

            <ScrollView
              style={styles.modalOptions}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <Pressable
                style={[styles.modalOption, selectedCategory === null && styles.modalOptionActive]}
                onPress={() => handleCategorySelectAndClose(null)}
                accessibilityLabel="All categories"
                accessibilityRole="button"
              >
                <Text style={[styles.modalOptionText, selectedCategory === null && styles.modalOptionTextActive]}>
                  All
                </Text>
                {selectedCategory === null && (
                  <Ionicons name="checkmark" size={16} color={editorialPalette.gold} />
                )}
              </Pressable>

              {categories.map((cat: Category) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    style={[styles.modalOption, isActive && styles.modalOptionActive]}
                    onPress={() => handleCategorySelectAndClose(cat.id)}
                    accessibilityLabel={cat.name_en}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.modalOptionText, isActive && styles.modalOptionTextActive]}>
                      {cat.name_en}
                    </Text>
                    {isActive && <Ionicons name="checkmark" size={16} color={editorialPalette.gold} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Animated.View>
      </Modal>
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
          data={displayedPlaces}
          keyExtractor={(item: Place) => String(item.id)}
          renderItem={({ item }) => (
            <PlaceCard
              place={item}
              onPress={handlePlacePress}
              distance={distanceFor(item)}
              isFavorited={isFavorited(item.id)}
              onFavoritePress={handleFavoritePress}
            />
          )}
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
