import React from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Skeleton } from '../../../shared/components/Skeleton';
import { useOrdersScreen, type StatusFilter, type DatePreset } from '../hooks/useOrdersScreen';
import { OrderCard } from '../components/OrderCard';
import { PrepTimeModal } from '../components/PrepTimeModal';
import { styles } from './OrdersScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import type { FoodOrder } from '../../../types/models';
import { useTranslation } from '../../../shared/hooks/useTranslation';

type Section = { title: string; data: FoodOrder[] };

interface OrdersScreenProps {
  onSelectOrder?: (orderId: string) => void;
  onCancelledOrders?: () => void;
}

export function OrdersScreen({ onSelectOrder, onCancelledOrders }: OrdersScreenProps): React.JSX.Element {
  const t = useTranslation();
  const {
    sections, isLoading,
    statusFilter, dateFilter, dateFrom, dateTo, datePreset,
    searchQuery, totalVisible, isActionsOpen,
    prepTimeModalVisible, prepTimeMinutes,
    handleUpdateStatus, handleStartPreparing,
    handlePrepTimeSelect, handleConfirmPrepTime, handleCancelPrepTime,
    handleStatusFilterChange,
    handleDatePreset, handleDatePrev, handleDateNext, handleDateToday,
    handleSearchChange, handleExportCsv,
    handleToggleActions, handleCloseActions,
  } = useOrdersScreen();

  const STATUS_TABS: { key: StatusFilter; label: string }[] = [
    { key: 'all',         label: t('orders_all') },
    { key: 'new',         label: t('orders_new') },
    { key: 'in_progress', label: t('orders_in_progress') },
    { key: 'done',        label: t('orders_done') },
  ];

  const DATE_PRESETS: { key: DatePreset; label: string }[] = [
    { key: 'today',     label: t('common_today') },
    { key: 'yesterday', label: t('common_yesterday') },
    { key: 'last7',     label: t('common_last_7_days') },
    { key: 'last30',    label: t('common_last_30_days') },
    { key: 'custom',    label: t('common_all') },
  ];

  // Section titles are internal keys; the dot colour map uses the English key from the hook.
  const SECTION_DOTS: Record<string, string> = {
    'New Orders':  colours.warning,
    'In Progress': colours.primary,
    'Completed':   colours.textSubtle,
  };

  // Section title displayed to user — translate the hook's English key.
  const SECTION_TITLE_LABELS: Record<string, string> = {
    'New Orders':  t('orders_section_new'),
    'In Progress': t('orders_section_in_progress'),
    'Completed':   t('orders_section_done'),
  };

  function formatDateLabel(d: string | null, from: string | null, to: string | null, preset: DatePreset): string {
    if (preset === 'last7')     return t('common_last_7_days');
    if (preset === 'last30')    return t('common_last_30_days');
    if (preset === 'yesterday') return t('common_yesterday');
    if (d === null)             return t('common_today');
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const isToday        = datePreset === 'today';
  const isRangePreset  = datePreset === 'last7' || datePreset === 'last30';
  const pending        = sections.find((s) => s.title === 'New Orders')?.data.length ?? 0;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>

      {/* Full-screen backdrop — closes the actions dropdown on outside tap */}
      {isActionsOpen && (
        <Pressable
          style={styles.menuBackdrop}
          onPress={handleCloseActions}
          accessibilityLabel="Close menu"
        />
      )}

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <View style={styles.pageHeader}>
        <View style={styles.pageHeaderLeft}>
          <Text style={styles.pageTitle}>{t('orders_title')}</Text>
          {pending > 0 && (
            <Pressable
              style={styles.pendingPill}
              onPress={() => handleStatusFilterChange('new')}
              accessibilityRole="button"
              accessibilityLabel={`${pending} pending orders, tap to filter`}
            >
              <View style={styles.pendingDot} />
              <Text style={styles.pendingText}>{pending} {t('orders_pending_count')}</Text>
            </Pressable>
          )}
        </View>

        {/* ⋮ overflow button + dropdown */}
        <View style={styles.overflowWrapper}>
          <Pressable
            style={styles.overflowBtn}
            onPress={handleToggleActions}
            accessibilityRole="button"
            accessibilityLabel="More actions"
          >
            <Ionicons name="ellipsis-vertical" size={18} color={colours.textMuted} />
          </Pressable>
          {isActionsOpen && (
            <View style={styles.actionsDropdown}>
              <Pressable
                style={styles.dropdownItem}
                onPress={() => { handleCloseActions(); onCancelledOrders?.(); }}
                accessibilityRole="button"
                accessibilityLabel="View cancelled orders"
              >
                <Ionicons name="close-circle-outline" size={15} color={colours.error} />
                <Text style={[styles.dropdownItemText, { color: colours.error }]}>{t('orders_cancelled_orders')}</Text>
              </Pressable>
              {Platform.OS === 'web' && (
                <>
                  <View style={styles.dropdownDivider} />
                  <Pressable
                    style={styles.dropdownItem}
                    onPress={() => { handleCloseActions(); handleExportCsv(); }}
                    accessibilityRole="button"
                    accessibilityLabel="Export orders as CSV"
                  >
                    <Ionicons name="download-outline" size={15} color={colours.textOnLight} />
                    <Text style={styles.dropdownItemText}>{t('common_export_csv')}</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}
        </View>
      </View>

      {/* ── Status tabs ─────────────────────────────────────────────────────── */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => handleStatusFilterChange(tab.key)}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.listBody} contentContainerStyle={styles.listBodyContent} showsVerticalScrollIndicator={false}>

        {/* ── Date preset pills ──────────────────────────────────────────────── */}
        <View style={styles.presetRow}>
          {DATE_PRESETS.filter((p) => p.key !== 'custom').map((p) => (
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

        {/* ── Day navigator (only for today / yesterday / custom) ─────────────── */}
        {!isRangePreset && (
          <View style={styles.dateNav}>
            <Pressable style={styles.dateArrow} onPress={handleDatePrev} accessibilityRole="button" accessibilityLabel="Previous day">
              <Ionicons name="chevron-back" size={14} color={colours.textMuted} />
            </Pressable>
            <View style={styles.dateCenter}>
              <Text style={styles.dateLabel}>
                {formatDateLabel(dateFilter, dateFrom, dateTo, datePreset)}
              </Text>
              <Text style={styles.dateCount}>{totalVisible} {t('orders_count')}</Text>
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
                <Text style={styles.todayBtnText}>{t('orders_back_to_today')}</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Range label */}
        {isRangePreset && (
          <View style={styles.rangeLabel}>
            <Ionicons name="calendar-outline" size={13} color={colours.textMuted} />
            <Text style={styles.rangeLabelText}>
              {formatDateLabel(dateFilter, dateFrom, dateTo, datePreset)} — {totalVisible} {t('orders_count')}
            </Text>
          </View>
        )}

        {/* ── Search bar ─────────────────────────────────────────────────────── */}
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={14} color={colours.textSubtle} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('orders_search_placeholder')}
            placeholderTextColor={colours.textSubtle}
            value={searchQuery}
            onChangeText={handleSearchChange}
            returnKeyType="search"
            accessibilityLabel="Search orders"
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
                <View style={[styles.skeletonStrip, { backgroundColor: colours.warning + '44' }]} />
                <View style={{ flex: 1, padding: spacing.md, gap: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                      <Skeleton height={40} width={40} borderRadius={8} />
                      <View style={{ gap: 5 }}>
                        <Skeleton height={13} width={110} borderRadius={4} />
                        <Skeleton height={10} width={70} borderRadius={4} />
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                      <Skeleton height={16} width={80} borderRadius={4} />
                      <Skeleton height={18} width={90} borderRadius={10} />
                    </View>
                  </View>
                  <Skeleton height={10} width="70%" borderRadius={4} />
                </View>
              </View>
            ))}
          </View>
        ) : totalVisible === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons name="receipt-outline" size={26} color={colours.textSubtle} />
            </View>
            <Text style={styles.emptyTitle}>{t('orders_no_orders_found')}</Text>
            <Text style={styles.emptyBody}>
              {searchQuery ? t('orders_no_orders_body_search') : t('orders_no_orders_body_filter')}
            </Text>
          </View>
        ) : (
          (sections as Section[]).map((section) => (
            <View key={section.title}>
              <View style={styles.sectionLabel}>
                <View style={[styles.sectionDot, { backgroundColor: SECTION_DOTS[section.title] ?? colours.primary }]} />
                <Text style={styles.sectionLabelText}>{SECTION_TITLE_LABELS[section.title] ?? section.title}</Text>
                <Text style={styles.sectionCount}>{section.data.length}</Text>
              </View>
              {section.data.map((item: FoodOrder) => (
                <OrderCard
                  key={item.id}
                  order={item}
                  variant="light"
                  onUpdateStatus={handleUpdateStatus}
                  onStartPreparing={handleStartPreparing}
                  onPress={onSelectOrder !== undefined ? () => onSelectOrder(item.id) : undefined}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>

      <PrepTimeModal
        visible={prepTimeModalVisible}
        selectedMinutes={prepTimeMinutes}
        onSelectMinutes={handlePrepTimeSelect}
        onConfirm={handleConfirmPrepTime}
        onCancel={handleCancelPrepTime}
      />
    </SafeAreaView>
  );
}
