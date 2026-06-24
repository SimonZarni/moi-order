import React from 'react';
import { View, Text, TextInput, ScrollView, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useReviewsScreen, type RatingFilter } from '../hooks/useReviewsScreen';
import { styles } from './ReviewsScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatDate } from '../../../shared/utils/formatDate';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { ReviewItem } from '../../../api/reviews';

const RATING_FILTERS: { key: RatingFilter; label: string }[] = [
  { key: 0, label: 'All' },
  { key: 5, label: '★ 5' },
  { key: 4, label: '★ 4' },
  { key: 3, label: '★ 3' },
  { key: 2, label: '★ 2' },
  { key: 1, label: '★ 1' },
];

interface ReviewCardProps {
  item: ReviewItem;
  replyingTo: string | null;
  replyDraft: string;
  isSubmittingReply: boolean;
  onStartReply: (orderId: string, existingReply: string | null) => void;
  onReplyDraftChange: (text: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
}

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

function ReviewCard({
  item,
  replyingTo,
  replyDraft,
  isSubmittingReply,
  onStartReply,
  onReplyDraftChange,
  onSubmitReply,
  onCancelReply,
}: ReviewCardProps): React.JSX.Element {
  const isEditingThis = replyingTo === item.id;
  const hasReply = item.merchant_reply !== null && item.merchant_reply.length > 0;

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

      {/* Existing merchant reply */}
      {hasReply && !isEditingThis && (
        <View style={styles.replyBlock}>
          <Text style={styles.replyLabel}>Your reply</Text>
          <Text style={styles.replyText}>{item.merchant_reply}</Text>
        </View>
      )}

      {/* Reply input or reply button */}
      {isEditingThis ? (
        <View>
          <TextInput
            style={styles.replyInput}
            value={replyDraft}
            onChangeText={onReplyDraftChange}
            placeholder="Write your reply…"
            placeholderTextColor={colours.textSubtle}
            multiline
            accessibilityLabel="Reply text input"
          />
          <View style={styles.replyActions}>
            <Pressable
              style={styles.replyCancelBtn}
              onPress={onCancelReply}
              accessibilityRole="button"
              accessibilityLabel="Cancel reply"
            >
              <Text style={styles.replyCancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.replySubmitBtn, (!replyDraft.trim() || isSubmittingReply) && { opacity: 0.5 }]}
              onPress={onSubmitReply}
              disabled={!replyDraft.trim() || isSubmittingReply}
              accessibilityRole="button"
              accessibilityLabel="Submit reply"
            >
              <Text style={styles.replySubmitText}>
                {isSubmittingReply ? 'Submitting…' : 'Submit Reply'}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          style={styles.replyBtn}
          onPress={() => onStartReply(item.id, item.merchant_reply)}
          accessibilityRole="button"
          accessibilityLabel={hasReply ? 'Edit reply' : 'Reply to review'}
        >
          <Text style={styles.replyBtnText}>{hasReply ? 'Edit Reply' : 'Reply'}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function ReviewsScreen(): React.JSX.Element {
  const t = useTranslation();
  const {
    reviews, isLoading, isError,
    currentPage, lastPage, total,
    ratingFilter,
    replyingTo, replyDraft, isSubmittingReply,
    handleRatingFilter, handlePageNext, handlePagePrev,
    handleStartReply, handleReplyDraftChange, handleSubmitReply, handleCancelReply,
  } = useReviewsScreen();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>{t('reviews_title')}</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>{total} {t('reviews_total')}</Text>
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
          <Text style={styles.emptyTitle}>{t('reviews_loading')}</Text>
        </View>
      ) : isError ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}>
            <Ionicons name="alert-circle-outline" size={26} color={colours.error} />
          </View>
          <Text style={styles.emptyTitle}>{t('reviews_cannot_load')}</Text>
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
              <Text style={styles.emptyTitle}>{t('reviews_no_reviews')}</Text>
              <Text style={styles.emptyBody}>{t('reviews_no_reviews_body')}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ReviewCard
              item={item}
              replyingTo={replyingTo}
              replyDraft={replyDraft}
              isSubmittingReply={isSubmittingReply}
              onStartReply={handleStartReply}
              onReplyDraftChange={handleReplyDraftChange}
              onSubmitReply={handleSubmitReply}
              onCancelReply={handleCancelReply}
            />
          )}
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
