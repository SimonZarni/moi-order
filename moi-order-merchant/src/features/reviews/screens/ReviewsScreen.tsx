import React from 'react';
import { View, Text, ScrollView, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useReviewsScreen, type RatingFilter } from '../hooks/useReviewsScreen';
import { styles } from './ReviewsScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatDate } from '../../../shared/utils/formatDate';
import type { ReviewItem } from '../../../api/reviews';

const RATING_FILTERS: { key: RatingFilter; label: string }[] = [
  { key: 0, label: 'All' },
  { key: 5, label: '★ 5' },
  { key: 4, label: '★ 4' },
  { key: 3, label: '★ 3' },
  { key: 2, label: '★ 2' },
  { key: 1, label: '★ 1' },
];

function StarRow({ rating }: { rating: number }): React.JSX.Element {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={n <= rating ? 'star' : 'star-outline'}
          size={13}
          color={n <= rating ? colours.warning : colours.divider}
        />
      ))}
    </View>
  );
}

function ReviewCard({ item }: { item: ReviewItem }): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.customerName}>{item.user.name}</Text>
          {item.order_number !== null && (
            <Text style={styles.orderNumber}>Order #{item.order_number}</Text>
          )}
        </View>
        <StarRow rating={item.rating} />
      </View>
      {item.customer_review !== null && item.customer_review.length > 0 && (
        <Text style={styles.reviewText}>{item.customer_review}</Text>
      )}
      {item.completed_at !== null && (
        <Text style={styles.date}>{formatDate(item.completed_at)}</Text>
      )}
    </View>
  );
}

export function ReviewsScreen(): React.JSX.Element {
  const {
    reviews, isLoading, isError,
    currentPage, lastPage, total,
    ratingFilter,
    handleRatingFilter, handlePageNext, handlePagePrev,
  } = useReviewsScreen();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Reviews</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>{total} total</Text>
        </View>
      </View>

      <View style={styles.filterRowOuter}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterRowScroll}
      >
        {RATING_FILTERS.map(({ key, label }) => {
          const active = ratingFilter === key;
          return (
            <Pressable
              key={key}
              style={[styles.filterPill, active && styles.filterPillActive]}
              onPress={() => handleRatingFilter(key)}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${label}`}
            >
              <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="hourglass-outline" size={28} color={colours.textSubtle} />
          <Text style={styles.emptyTitle}>Loading…</Text>
        </View>
      ) : isError ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}>
            <Ionicons name="alert-circle-outline" size={26} color={colours.error} />
          </View>
          <Text style={styles.emptyTitle}>Could not load reviews</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          accessibilityRole="list"
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIcon}>
                <Ionicons name="star-outline" size={26} color={colours.textSubtle} />
              </View>
              <Text style={styles.emptyTitle}>No reviews yet</Text>
              <Text style={styles.emptyBody}>Completed orders with ratings will appear here</Text>
            </View>
          }
          renderItem={({ item }) => <ReviewCard item={item} />}
          ListFooterComponent={
            lastPage > 1 ? (
              <View style={styles.paginationRow}>
                <Pressable
                  style={[styles.pageBtn, currentPage <= 1 && styles.pageBtnDisabled]}
                  onPress={handlePagePrev}
                  disabled={currentPage <= 1}
                  accessibilityRole="button"
                  accessibilityLabel="Previous page"
                >
                  <Ionicons name="chevron-back" size={16} color={colours.textMuted} />
                </Pressable>
                <Text style={styles.pageLabel}>{currentPage} / {lastPage}</Text>
                <Pressable
                  style={[styles.pageBtn, currentPage >= lastPage && styles.pageBtnDisabled]}
                  onPress={handlePageNext}
                  disabled={currentPage >= lastPage}
                  accessibilityRole="button"
                  accessibilityLabel="Next page"
                >
                  <Ionicons name="chevron-forward" size={16} color={colours.textMuted} />
                </Pressable>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
