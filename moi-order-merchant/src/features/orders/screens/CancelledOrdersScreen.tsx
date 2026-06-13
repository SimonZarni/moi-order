import React from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Skeleton } from '../../../shared/components/Skeleton';
import { useCancelledOrdersScreen, type DatePreset } from '../hooks/useCancelledOrdersScreen';
import { OrderCard } from '../components/OrderCard';
import { styles } from './CancelledOrdersScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import type { FoodOrder } from '../../../types/models';
import { useTranslation } from '../../../shared/hooks/useTranslation';

interface CancelledOrdersScreenProps {
  onBack?: () => void;
  onSelectOrder?: (orderId: string) => void;
}

export function CancelledOrdersScreen({ onBack, onSelectOrder }: CancelledOrdersScreenProps): React.JSX.Element {
  const t = useTranslation();
  const {
    orders, isLoading,
    dateFilter, datePreset, dateFrom, dateTo,
    searchQuery, totalVisible,
    handleDatePreset, handleDatePrev, handleDateNext, handleDateToday,
    handleSearchChange, handleExportCsv,
  } = useCancelledOrdersScreen();

  const DATE_PRESETS: { key: DatePreset; label: string }[] = [
    { key: 'today',     label: t('common_today') },
    { key: 'yesterday', label: t('common_yesterday') },
    { key: 'last7',     label: t('common_last_7_days') },
    { key: 'last30',    label: t('common_last_30_days') },
  ];

  function formatDateLabel(d: string | null, preset: DatePreset): string {
    if (preset === 'last7')     return t('common_last_7_days');
    if (preset === 'last30')    return t('common_last_30_days');
    if (preset === 'yesterday') return t('common_yesterday');
    if (d === null)             return t('common_today');
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const isToday      = datePreset === 'today';
  const isRangePreset = datePreset === 'last7' || datePreset === 'last30';

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <View style={styles.pageHeader}>
        <View style={styles.pageHeaderLeft}>
          {onBack !== undefined && (
            <Pressable
              style={styles.backBtn}
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Back to Orders"
            >
              <Ionicons name="chevron-back" size={18} color={colours.textOnDark} />
            </Pressable>
          )}
          <Text style={styles.pageTitle}>{t('cancelled_title')}</Text>
        </View>
        <Pressable
          style={styles.exportBtn}
          onPress={handleExportCsv}
          accessibilityRole="button"
          accessibilityLabel="Export cancelled orders as CSV"
        >
          <Ionicons name="download-outline" size={14} color={colours.backgroundDark} />
          <Text style={styles.exportBtnText}>{t('common_export_csv')}</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.listBody} contentContainerStyle={styles.listBodyContent} showsVerticalScrollIndicator={false}>

        {/* ── Date preset pills ──────────────────────────────────────────────── */}
        <View style={styles.presetRow}>
          {DATE_PRESETS.map((p) => (
            <Pressable
              key={p.key}
              style={[styles.presetPill, datePreset === p.key && styles.presetPillActive]}
              onPress={() => handleDatePreset(p.key)}
              accessibilityRole="button"
              accessibilityLabel={p.label}
            >
              <Text style={[styles.presetPillText, datePreset === p.key && styles.presetPillTextActive]}>
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Day navigator ─────────────────────────────────────────────────── */}
        {!isRangePreset && (
          <View style={styles.dateNav}>
            <Pressable style={styles.dateArrow} onPress={handleDatePrev} accessibilityRole="button" accessibilityLabel="Previous day">
              <Ionicons name="chevron-back" size={14} color={colours.textMuted} />
            </Pressable>
            <View style={styles.dateCenter}>
              <Text style={styles.dateLabel}>{formatDateLabel(dateFilter, datePreset)}</Text>
              <Text style={styles.dateCount}>{totalVisible} {t('common_cancelled')}</Text>
            </View>
            <Pressable
              style={[styles.dateArrow, isToday && { opacity: 0.3 }]}
              onPress={handleDateNext}
              disabled={isToday}
              accessibilityRole="button"
              accessibilityLabel="Next day"
            >
              <Ionicons name="chevron-forward" size={14} color={colours.textMuted} />
            </Pressable>
            {!isToday && (
              <Pressable style={styles.todayBtn} onPress={handleDateToday} accessibilityRole="button" accessibilityLabel="Back to today">
                <Text style={styles.todayBtnText}>{t('common_today')}</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Range label */}
        {isRangePreset && (
          <View style={styles.rangeLabel}>
            <Ionicons name="calendar-outline" size={13} color={colours.textMuted} />
            <Text style={styles.rangeLabelText}>
              {formatDateLabel(dateFilter, datePreset)} — {totalVisible} {t('common_cancelled')}
            </Text>
          </View>
        )}

        {/* ── Search bar ─────────────────────────────────────────────────────── */}
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={14} color={colours.textSubtle} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('common_search_customer_order')}
            placeholderTextColor={colours.textSubtle}
            value={searchQuery}
            onChangeText={handleSearchChange}
            returnKeyType="search"
            accessibilityLabel="Search cancelled orders"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => handleSearchChange('')} accessibilityRole="button" accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={15} color={colours.textSubtle} />
            </Pressable>
          )}
        </View>

        {/* ── Orders list ────────────────────────────────────────────────────── */}
        {isLoading ? (
          <View style={{ padding: spacing.md, gap: spacing.sm }}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.skeletonWrap}>
                <View style={[styles.skeletonStrip, { backgroundColor: colours.error + '44' }]} />
                <View style={{ flex: 1, padding: spacing.md, gap: 8 }}>
                  <Skeleton height={13} width={110} borderRadius={4} />
                  <Skeleton height={10} width={70} borderRadius={4} />
                </View>
              </View>
            ))}
          </View>
        ) : totalVisible === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons name="close-circle-outline" size={26} color={colours.error} />
            </View>
            <Text style={styles.emptyTitle}>{t('cancelled_no_orders')}</Text>
            <Text style={styles.emptyBody}>
              {searchQuery.length > 0
                ? t('cancelled_no_orders_search')
                : t('cancelled_no_orders_period')}
            </Text>
          </View>
        ) : (
          <View>
            <View style={styles.sectionLabel}>
              <View style={[styles.sectionDot, { backgroundColor: colours.error }]} />
              <Text style={styles.sectionLabelText}>{t('cancelled_section_label')}</Text>
              <Text style={styles.sectionCount}>{totalVisible}</Text>
            </View>
            {orders.map((item: FoodOrder) => (
              <OrderCard
                key={item.id}
                order={item}
                variant="light"
                onUpdateStatus={() => undefined}
                onPress={onSelectOrder !== undefined ? () => onSelectOrder(item.id) : undefined}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
