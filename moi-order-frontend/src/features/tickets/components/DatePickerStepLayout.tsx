import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ApiError } from '@/types/models';
import { DateOption, MonthOption } from '../types';
import { styles } from './DatePickerStepLayout.styles';

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  months:        MonthOption[];
  days:          DateOption[];
  selectedMonth: MonthOption | null;
  selectedDate:  string | null;
  isSubmitting:  boolean;
  submitError:   ApiError | null;
  canPurchase:   boolean;
  onSelectMonth: (month: MonthOption) => void;
  onSelectDay:   (date: string)       => void;
  onPurchase:    () => void;
  onBack:        () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DatePickerStepLayout({
  months, days,
  selectedMonth, selectedDate,
  isSubmitting, submitError, canPurchase,
  onSelectMonth, onSelectDay, onPurchase, onBack,
}: Props): React.JSX.Element {
  const heroSubtitle = selectedMonth !== null
    ? `${selectedMonth.fullName} ${selectedMonth.year}`
    : 'Pick a month and day for your visit';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>

      {/* ── Dark green header ── */}
      <View style={styles.hero}>
        <View style={styles.orb} />
        <Pressable style={styles.backBtn} onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color="rgba(255,255,255,0.85)" />
        </Pressable>
        <Text style={styles.eyebrow}>SELECT DATE</Text>
        <Text style={styles.heroTitle}>When are you visiting?</Text>
        <Text style={styles.heroSub}>{heroSubtitle}</Text>
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Month section ── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>CHOOSE A MONTH</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.monthRow}>
          {months.map((month) => {
            const sel = selectedMonth !== null
              && month.value === selectedMonth.value
              && month.year  === selectedMonth.year;
            return (
              <Pressable
                key={`${month.year}-${month.value}`}
                style={[styles.monthTile, sel && styles.tileSelected]}
                onPress={() => onSelectMonth(month)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${month.fullName} ${month.year}`}
              >
                <Text style={[styles.monthNum,  sel && styles.goldText]}>
                  {String(month.value).padStart(2, '0')}
                </Text>
                <Text style={[styles.monthName, sel && styles.goldText]}>{month.abbrev}</Text>
                <Text style={[styles.monthYear, sel && styles.goldText]}>{month.year}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── Divider ── */}
        <View style={styles.divider} />

        {/* ── Day section ── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>CHOOSE A DAY</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.grid}>
          {days.map((option) => {
            const parts = option.label.split(' ');
            const sel   = option.date === selectedDate;
            return (
              <Pressable
                key={option.date}
                style={[styles.tile, sel && styles.tileSelected]}
                onPress={() => onSelectDay(option.date)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${option.label}`}
              >
                <Text style={[styles.dayLabel, sel && styles.goldText]}>{parts[0]}</Text>
                <Text style={[styles.dayNum,   sel && styles.goldText]}>{parts[1]}</Text>
                <Text style={[styles.dayMonth, sel && styles.goldText]}>{parts[2]}</Text>
                {option.isToday && (
                  <View style={styles.todayBadge}>
                    <Text style={styles.todayText}>TODAY</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {submitError !== null && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{submitError.message}</Text>
          </View>
        )}
      </ScrollView>

      {/* ── Purchase footer ── */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.purchaseBtn, !canPurchase && styles.purchaseBtnDisabled]}
          onPress={onPurchase}
          disabled={!canPurchase}
          accessibilityRole="button"
          accessibilityLabel="Purchase tickets"
        >
          {isSubmitting
            ? <ActivityIndicator color="#ffffff" />
            : <Text style={styles.purchaseBtnText}>Purchase</Text>
          }
        </Pressable>
      </View>

    </SafeAreaView>
  );
}
