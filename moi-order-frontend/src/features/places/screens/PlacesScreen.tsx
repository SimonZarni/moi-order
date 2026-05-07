import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { StandaloneFloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { PlaceCard } from '@/features/places/components/PlaceCard';
import { PlaceCardGrid } from '@/features/places/components/PlaceCardGrid';
import { usePlacesScreen } from '@/features/places/hooks/usePlacesScreen';
import { Category, Place, Tag } from '@/types/models';
import { styles } from './PlacesScreen.styles';

const FOREST = '#1B3A2D';
const SHEET_SNAP_POINTS = ['45%', '75%'];

// ── Sub-components ────────────────────────────────────────────────────────────

function SheetBackdrop(props: BottomSheetBackdropProps): React.JSX.Element {
  return <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.55} />;
}

interface CategoryItemProps {
  item: Category | null;
  isActive: boolean;
  onPress: (id: number | null) => void;
}

function CategorySheetItem({ item, isActive, onPress }: CategoryItemProps): React.JSX.Element {
  const id    = item?.id ?? null;
  const label = item?.name_en ?? 'All';
  return (
    <Pressable
      style={[styles.sheetOption, isActive && styles.sheetOptionActive]}
      onPress={() => onPress(id)}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Text style={[styles.sheetOptionText, isActive && styles.sheetOptionTextActive]}>{label}</Text>
      {isActive && <Ionicons name="checkmark" size={16} color={editorialPalette.gold} />}
    </Pressable>
  );
}

interface TagPillProps {
  tag: Tag;
  isActive: boolean;
  onToggle: (id: number) => void;
}

function SheetTagPill({ tag, isActive, onToggle }: TagPillProps): React.JSX.Element {
  return (
    <Pressable
      style={[styles.sheetTagPill, isActive && styles.sheetTagPillActive]}
      onPress={() => onToggle(tag.id)}
      accessibilityLabel={tag.name_en}
      accessibilityRole="button"
    >
      <Text style={[styles.sheetTagText, isActive && styles.sheetTagTextActive]}>
        {tag.name_en}
      </Text>
    </Pressable>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function PlacesScreen(): React.JSX.Element {
  const {
    placesListRef,
    displayedPlaces, categories, allTags, isPlacesLoading, isPlacesError,
    isPlacesRefreshing, isPlacesFetchingNextPage,
    query, selectedCategory, selectedCategoryLabel, selectedTagIds, showPartialMatches,
    isCategoryModalOpen, isTagsModalOpen, mode, layoutMode, distanceFor, isFavorited,
    handleQueryChange, handleCategorySelectAndClose,
    handleCategoryModalOpen, handleCategoryModalClose,
    handleTagsModalOpen, handleTagsModalClose,
    handleTagToggle, handleClearAllTags,
    handlePlacesEndReached, handlePlacesRefresh, handlePlacePress,
    handleFavoritePress, handleModeToggle, handleSetLayout,
    handleBack,
  } = usePlacesScreen();

  const catSheetRef  = useRef<BottomSheetModal>(null);
  const tagsSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (isCategoryModalOpen) catSheetRef.current?.present();
    else catSheetRef.current?.dismiss();
  }, [isCategoryModalOpen]);

  useEffect(() => {
    if (isTagsModalOpen) tagsSheetRef.current?.present();
    else tagsSheetRef.current?.dismiss();
  }, [isTagsModalOpen]);

  const modeIcon      = mode === 'favorites' ? 'heart' : mode === 'nearby' ? 'navigate' : 'navigate-outline';
  const modeActive    = mode !== 'all';
  const catPillLabel  = selectedCategory !== null ? selectedCategoryLabel : 'Category';
  const tagsPillLabel = selectedTagIds.length > 0 ? `Tags (${selectedTagIds.length})` : 'Tags';
  const catPillActive  = selectedCategory !== null;
  const tagsPillActive = selectedTagIds.length > 0;

  const categoryListData = [null, ...categories] as (Category | null)[];

  const header = (
    <View style={styles.header}>
      <View style={[styles.headerOrb, { backgroundColor: editorialPalette.gold }]} />
      <View style={styles.headerOrbSmall} />

      <View style={styles.headerTopRow}>
        <Pressable style={styles.headerBackBtn} onPress={handleBack} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>
        <Pressable
          style={[styles.headerModeBtn, modeActive && styles.headerModeBtnActive]}
          onPress={handleModeToggle}
          accessibilityRole="button"
          accessibilityLabel={mode === 'all' ? 'Show nearby places' : mode === 'nearby' ? 'Show favorites' : 'Show all places'}
        >
          <Ionicons name={modeIcon} size={18} color={modeActive ? colours.backgroundDark : '#FFFFFF'} />
        </Pressable>
      </View>

      <View style={styles.titleBlock}>
        <Text>
          <Text style={styles.titleAccent}>Explore </Text>
          <Text style={styles.titleMain}>Places</Text>
        </Text>
        <Text style={styles.titleSubtitle}>Attractions & landmarks</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchInputWrap}>
          <Ionicons name="search" size={15} color="rgba(255,255,255,0.45)" />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={handleQueryChange}
            placeholder="Search places…"
            placeholderTextColor="rgba(255,255,255,0.35)"
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel="Search places"
            accessibilityRole="search"
          />
          {query.length > 0 && (
            <Pressable style={styles.clearBtn} onPress={() => handleQueryChange('')} accessibilityLabel="Clear search" accessibilityRole="button">
              <Ionicons name="close" size={13} color="rgba(255,255,255,0.8)" />
            </Pressable>
          )}
        </View>

        <View style={styles.layoutGroup}>
          <Pressable
            style={[styles.layoutBtn, layoutMode === 'feed' && styles.layoutBtnActive]}
            onPress={() => handleSetLayout('feed')}
            accessibilityLabel="Feed layout"
            accessibilityRole="button"
          >
            <Ionicons name="list-outline" size={15} color={layoutMode === 'feed' ? colours.backgroundDark : 'rgba(255,255,255,0.65)'} />
          </Pressable>
          <Pressable
            style={[styles.layoutBtn, layoutMode === 'grid' && styles.layoutBtnActive]}
            onPress={() => handleSetLayout('grid')}
            accessibilityLabel="Grid layout"
            accessibilityRole="button"
          >
            <Ionicons name="grid-outline" size={14} color={layoutMode === 'grid' ? colours.backgroundDark : 'rgba(255,255,255,0.65)'} />
          </Pressable>
        </View>
      </View>

      {/* Filter row — 2 pills only */}
      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterPill, catPillActive && styles.filterPillActive]}
          onPress={handleCategoryModalOpen}
          accessibilityLabel={`Filter by category: ${catPillLabel}`}
          accessibilityRole="button"
        >
          <Text style={[styles.filterPillLabel, catPillActive && styles.filterPillLabelActive]} numberOfLines={1}>
            {catPillLabel}
          </Text>
          <Ionicons name="chevron-down" size={10} color={catPillActive ? FOREST : 'rgba(255,255,255,0.55)'} />
        </Pressable>

        <Pressable
          style={[styles.filterPill, tagsPillActive && styles.filterPillActive]}
          onPress={handleTagsModalOpen}
          accessibilityLabel={`Filter by tags${tagsPillActive ? `: ${selectedTagIds.length} selected` : ''}`}
          accessibilityRole="button"
        >
          <Text style={[styles.filterPillLabel, tagsPillActive && styles.filterPillLabelActive]}>
            {tagsPillLabel}
          </Text>
          <Ionicons name="chevron-down" size={10} color={tagsPillActive ? FOREST : 'rgba(255,255,255,0.55)'} />
        </Pressable>
      </View>
    </View>
  );

  if (isPlacesError) {
    return (
      <>
        <SafeAreaView style={styles.root} edges={['top']}>
          {header}
          <View style={styles.listCard}>
            <View style={styles.stateBox}>
              <Ionicons name="warning" size={36} color={colours.textMuted} style={styles.stateIcon} />
              <Text style={styles.stateTitle}>Could not load places</Text>
              <Text style={styles.stateSubtitle}>Pull down to retry</Text>
            </View>
          </View>
        </SafeAreaView>
        <StandaloneFloatingTabBar />
      </>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.root} edges={['top']}>
        {header}

        <View style={styles.listCard}>
          {showPartialMatches && (
            <Text style={styles.partialMatchNote}>Showing partial matches</Text>
          )}

          <FlatList
            key={layoutMode}
            style={styles.flatList}
            ref={placesListRef}
            data={displayedPlaces}
            keyExtractor={(item: Place) => String(item.id)}
            numColumns={layoutMode === 'grid' ? 2 : 1}
            columnWrapperStyle={layoutMode === 'grid' ? styles.gridRow : undefined}
            renderItem={({ item }) =>
              layoutMode === 'grid' ? (
                <PlaceCardGrid
                  place={item}
                  onPress={handlePlacePress}
                  distance={distanceFor(item)}
                  isFavorited={isFavorited(item.id)}
                  onFavoritePress={handleFavoritePress}
                />
              ) : (
                <PlaceCard
                  place={item}
                  onPress={handlePlacePress}
                  distance={distanceFor(item)}
                  isFavorited={isFavorited(item.id)}
                  onFavoritePress={handleFavoritePress}
                />
              )
            }
            ListEmptyComponent={
              isPlacesLoading ? (
                <View style={styles.stateBox}>
                  <ActivityIndicator size="large" color={styles.spinner.color} />
                </View>
              ) : (
                <View style={styles.stateBox}>
                  <Ionicons name="search" size={36} color={colours.textMuted} style={styles.stateIcon} />
                  <Text style={styles.stateTitle}>No places found</Text>
                  <Text style={styles.stateSubtitle}>Try a different search or filter</Text>
                </View>
              )
            }
            onEndReached={handlePlacesEndReached}
            onEndReachedThreshold={0.4}
            onRefresh={handlePlacesRefresh}
            refreshing={isPlacesRefreshing}
            contentContainerStyle={styles.list}
            ListFooterComponent={
              isPlacesFetchingNextPage ? <ActivityIndicator style={styles.listFooter} color={styles.spinner.color} /> : null
            }
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={5}
            removeClippedSubviews
            accessibilityRole="list"
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
      <StandaloneFloatingTabBar />

      {/* Category bottom sheet */}
      <BottomSheetModal
        ref={catSheetRef}
        snapPoints={SHEET_SNAP_POINTS}
        backdropComponent={SheetBackdrop}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.sheetHandle}
        onDismiss={handleCategoryModalClose}
      >
        <BottomSheetFlatList
          data={categoryListData}
          keyExtractor={(item) => String(item?.id ?? 'all')}
          renderItem={({ item }) => (
            <CategorySheetItem
              item={item}
              isActive={selectedCategory === (item?.id ?? null)}
              onPress={handleCategorySelectAndClose}
            />
          )}
          ListHeaderComponent={
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitleText}>Category</Text>
            </View>
          }
          contentContainerStyle={styles.sheetListContent}
        />
      </BottomSheetModal>

      {/* Tags bottom sheet */}
      <BottomSheetModal
        ref={tagsSheetRef}
        snapPoints={SHEET_SNAP_POINTS}
        backdropComponent={SheetBackdrop}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.sheetHandle}
        onDismiss={handleTagsModalClose}
      >
        <View style={styles.sheetTagsWrapper}>
          <View style={styles.sheetTagsHeader}>
            <Text style={styles.sheetTitleText}>Tags</Text>
            {tagsPillActive && (
              <Pressable onPress={handleClearAllTags} accessibilityLabel="Clear all tag filters" accessibilityRole="button">
                <Text style={styles.sheetClearBtn}>Clear all</Text>
              </Pressable>
            )}
          </View>
          <BottomSheetScrollView contentContainerStyle={styles.sheetTagsGrid}>
            {allTags.map((tag: Tag) => (
              <SheetTagPill
                key={tag.id}
                tag={tag}
                isActive={selectedTagIds.includes(tag.id)}
                onToggle={handleTagToggle}
              />
            ))}
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>
    </>
  );
}
