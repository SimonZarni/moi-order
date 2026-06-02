import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ApiError } from '@/types/models';
import { DateOption, MonthOption } from '../types';
import { DatePickerStep, PICKER_MONTHS } from '../hooks/useTicketDateSelectionScreen';
import { styles } from './DatePickerStepLayout.styles';

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  step:          DatePickerStep;
  years:         number[];
  months:        MonthOption[];
  days:          DateOption[];
  selectedYear:  number | null;
  selectedMonth: number | null;
  selectedDate:  string | null;
  isSubmitting:  boolean;
  submitError:   ApiError | null;
  canPurchase:   boolean;
  onSelectYear:  (year: number)  => void;
  onSelectMonth: (month: number) => void;
  onSelectDay:   (date: string)  => void;
  onPurchase:    () => void;
  onBack:        () => void;
}

// ─── Step metadata ────────────────────────────────────────────────────────────

const STEP_TITLE: Record<DatePickerStep, string> = {
  year:  'Which year?',
  month: 'Which month?',
  day:   'When are you visiting?',
};

const STEP_SECTION: Record<DatePickerStep, string> = {
  year:  'CHOOSE A YEAR',
  month: 'CHOOSE A MONTH',
  day:   'CHOOSE A DAY',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function DatePickerStepLayout({
  step, years, months, days,
  selectedYear, selectedMonth, selectedDate,
  isSubmitting, submitError, canPurchase,
  onSelectYear, onSelectMonth, onSelectDay, onPurchase, onBack,
}: Props): React.JSX.Element {
  const heroSubtitle =
    step === 'year'  ? 'Pick the year of your visit' :
    step === 'month' ? String(selectedYear ?? '') :
    `${PICKER_MONTHS.find((m) => m.value === selectedMonth)?.fullName ?? ''} ${selectedYear ?? ''}`;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>

      {/* ── Dark green header ── */}
      <View style={styles.hero}>
        <View style={styles.orb} />
        <Pressable style={styles.backBtn} onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color="rgba(255,255,255,0.85)" />
        </Pressable>
        <Text style={styles.eyebrow}>SELECT DATE</Text>
        <Text style={styles.heroTitle}>{STEP_TITLE[step]}</Text>
        <Text style={styles.heroSub}>{heroSubtitle}</Text>
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.body, step === 'day' && styles.bodyWithFooter]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>{STEP_SECTION[step]}</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.grid}>

          {step === 'year' && years.map((year) => {
            const sel = year === selectedYear;
            return (
              <Pressable
                key={year}
                style={[styles.tile, sel && styles.tileSelected]}
                onPress={() => onSelectYear(year)}
                accessibilityRole="button"
                accessibilityLabel={`Select year ${year}`}
              >
                <Text style={[styles.yearNum, sel && styles.goldText]}>{year}</Text>
              </Pressable>
            );
          })}

          {step === 'month' && months.map((month) => {
            const sel = month.value === selectedMonth;
            return (
              <Pressable
                key={month.value}
                style={[styles.tile, sel && styles.tileSelected]}
                onPress={() => onSelectMonth(month.value)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${month.fullName}`}
              >
                <Text style={[styles.monthNum, sel && styles.goldText]}>
                  {String(month.value).padStart(2, '0')}
                </Text>
                <Text style={[styles.monthName, sel && styles.goldText]}>{month.abbrev}</Text>
              </Pressable>
            );
          })}

          {step === 'day' && days.map((option) => {
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

      {/* ── Purchase footer — day step only ── */}
      {step === 'day' && (
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
      )}

    </SafeAreaView>
  );
}
