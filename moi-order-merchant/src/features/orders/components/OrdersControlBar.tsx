import React from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './OrdersControlBar.styles';
import { colours } from '../../../shared/theme/colours';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { StatusFilter, DatePreset, TabCounts } from '../hooks/useOrdersScreen';

const STATUS_ACCENT: Record<StatusFilter, string> = {
  all:         colours.primary,
  new:         colours.warning,
  in_progress: colours.primary,
  done:        colours.success,
};

interface OrdersControlBarProps {
  statusFilter: StatusFilter;
  datePreset: DatePreset;
  dateFilter: string | null;
  isToday: boolean;
  isRangePreset: boolean;
  totalVisible: number;
  tabCounts: TabCounts;
  searchQuery: string;
  onStatusChange: (f: StatusFilter) => void;
  onDatePreset: (p: DatePreset) => void;
  onDatePrev: () => void;
  onDateNext: () => void;
  onDateToday: () => void;
  onSearch: (q: string) => void;
}

export function OrdersControlBar({
  statusFilter, datePreset, dateFilter, isToday, isRangePreset, totalVisible, tabCounts,
  searchQuery, onStatusChange, onDatePreset, onDatePrev, onDateNext, onDateToday, onSearch,
}: OrdersControlBarProps): React.JSX.Element {
  const t = useTranslation();

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
  ];

  const COUNT: Record<StatusFilter, number> = { all: tabCounts.all, new: tabCounts.new, in_progress: tabCounts.in_progress, done: tabCounts.done };

  function formatDateLabel(): string {
    if (datePreset === 'last7')     return t('common_last_7_days');
    if (datePreset === 'last30')    return t('common_last_30_days');
    if (datePreset === 'yesterday') return t('common_yesterday');
    if (dateFilter === null)        return t('common_today');
    return new Date(dateFilter + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <View style={styles.container}>
      {/* ── Status tabs ─────────────────────────────────────────────────── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
        {STATUS_TABS.map((tab) => {
          const active = statusFilter === tab.key;
          const accent = STATUS_ACCENT[tab.key];
          const count  = COUNT[tab.key];
          return (
            <Pressable
              key={tab.key}
              style={[styles.tab, active && { borderColor: accent, backgroundColor: accent + '18' }]}
              onPress={() => onStatusChange(tab.key)}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
            >
              <Text style={[styles.tabText, active && { color: accent, fontWeight: '800' }]}>{tab.label}</Text>
              {count > 0 && (
                <View style={[styles.countBadge, { backgroundColor: active ? accent + '30' : colours.surfaceMuted, borderColor: active ? accent + '55' : colours.divider }]}>
                  <Text style={[styles.countText, { color: active ? accent : colours.textMuted }]}>{count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── Date preset pills + search ───────────────────────────────────── */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
          {DATE_PRESETS.map((p) => (
            <Pressable
              key={p.key}
              style={[styles.presetPill, datePreset === p.key && styles.presetPillActive]}
              onPress={() => onDatePreset(p.key)}
              accessibilityRole="button"
              accessibilityLabel={p.label}
            >
              <Text style={[styles.presetText, datePreset === p.key && styles.presetTextActive]}>{p.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={13} color={colours.textSubtle} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('orders_search_placeholder')}
            placeholderTextColor={colours.textSubtle}
            value={searchQuery}
            onChangeText={onSearch}
            returnKeyType="search"
            accessibilityLabel="Search orders"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => onSearch('')} accessibilityRole="button" accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={14} color={colours.textSubtle} />
            </Pressable>
          )}
        </View>
      </View>

      {/* ── Date navigator (single-day view) ───────────────────────────── */}
      {!isRangePreset && (
        <View style={styles.dateNav}>
          <Pressable style={styles.dateArrow} onPress={onDatePrev} accessibilityRole="button" accessibilityLabel="Previous day">
            <Ionicons name="chevron-back" size={13} color={colours.textMuted} />
          </Pressable>
          <Text style={styles.dateLabel}>{formatDateLabel()}</Text>
          <Text style={styles.dateCount}>· {totalVisible} {t('orders_count')}</Text>
          <Pressable
            style={[styles.dateArrow, isToday && styles.dateArrowDisabled]}
            onPress={onDateNext}
            disabled={isToday}
            accessibilityRole="button"
            accessibilityLabel="Next day"
          >
            <Ionicons name="chevron-forward" size={13} color={isToday ? colours.divider : colours.textMuted} />
          </Pressable>
          {!isToday && (
            <Pressable style={styles.todayBtn} onPress={onDateToday} accessibilityRole="button" accessibilityLabel="Back to today">
              <Text style={styles.todayBtnText}>{t('orders_back_to_today')}</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* ── Range summary ───────────────────────────────────────────────── */}
      {isRangePreset && (
        <View style={styles.rangeRow}>
          <Ionicons name="calendar-outline" size={12} color={colours.textMuted} />
          <Text style={styles.rangeLabel}>{formatDateLabel()} · {totalVisible} {t('orders_count')}</Text>
        </View>
      )}
    </View>
  );
}
