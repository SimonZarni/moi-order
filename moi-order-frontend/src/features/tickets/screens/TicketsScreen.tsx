import React from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StandaloneFloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { TicketCard } from '@/features/tickets/components/TicketCard';
import { TicketCardSkeleton } from '@/features/tickets/components/TicketCardSkeleton';
import { TicketsSearchBar } from '@/features/tickets/components/TicketsSearchBar';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { useTicketsScreen } from '@/features/tickets/hooks/useTicketsScreen';
import { Ticket } from '@/types/models';
import { styles } from './TicketsScreen.styles';

const HERO_MIN_HEIGHT = 152;

export function TicketsScreen(): React.JSX.Element {
  const {
    tickets, isLoading, isError, isRefreshing, isFetchingNextPage,
    searchQuery, handleSearchChange,
    handleEndReached, handleRefresh, handleTicketPress, handleBack,
  } = useTicketsScreen();

  const header = (
    <>
      <HeroHeader
        accentColor={editorialPalette.gold}
        titleNode={
          <Text>
            <Text style={[styles.heroTitleAccent, { color: editorialPalette.gold }]}>Buy </Text>
            <Text style={styles.heroTitleMain}>Tickets</Text>
          </Text>
        }
        subtitle="Book attractions & experiences"
        onBack={handleBack}
        backLabel="Back"
        minHeight={HERO_MIN_HEIGHT}
      />
      <TicketsSearchBar query={searchQuery} onQueryChange={handleSearchChange} />
      <View style={styles.bodyGap} />
    </>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <ScrollView style={styles.flatList} showsVerticalScrollIndicator={false} scrollEnabled={false} contentContainerStyle={styles.list}>
          {header}
          <View style={styles.cardsContainer}>
            {Array.from({ length: 4 }).map((_, i) => (
              <TicketCardSkeleton key={i} />
            ))}
          </View>
        </ScrollView>
        <StandaloneFloatingTabBar />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        {header}
        <View style={styles.stateBox}>
          <Ionicons name="warning" size={36} color={colours.textMuted} style={styles.stateIcon} />
          <Text style={styles.stateTitle}>Could not load tickets</Text>
          <Text style={styles.stateSubtitle}>Pull down to retry</Text>
        </View>
        <StandaloneFloatingTabBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <FlatList
        style={styles.flatList}
        data={tickets}
        keyExtractor={(item: Ticket) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.cardsContainer}>
            <TicketCard item={item} onPress={handleTicketPress} />
          </View>
        )}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.stateBox}>
              <Ionicons name="search" size={36} color={colours.textMuted} style={styles.stateIcon} />
              <Text style={styles.stateTitle}>No tickets found</Text>
              <Text style={styles.stateSubtitle}>Try a different search</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isFetchingNextPage
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
      <StandaloneFloatingTabBar />
    </SafeAreaView>
  );
}
