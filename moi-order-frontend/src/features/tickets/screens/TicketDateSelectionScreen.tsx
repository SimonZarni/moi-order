import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTicketDateSelectionScreen, DateOption } from '@/features/tickets/hooks/useTicketDateSelectionScreen';
import { styles } from './TicketDateSelectionScreen.styles';

export function TicketDateSelectionScreen(): React.JSX.Element {
  const {
    dates, selectedDate, isSubmitting, submitError, canPurchase,
    handleSelectDate, handlePurchase, handleBack,
  } = useTicketDateSelectionScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.hero}>
        <View style={styles.orbLarge} />
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityLabel="Go back" accessibilityRole="button">
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <Text style={styles.heroEyebrow}>Select Date</Text>
        <Text style={styles.heroTitle}>When are you visiting?</Text>
        <Text style={styles.heroSubtitle}>Available for the next 7 days</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>Choose a day</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.dateGrid}>
          {dates.map((option: DateOption) => {
            const isSelected = option.date === selectedDate;
            const parts = option.label.split(' ');
            return (
              <Pressable
                key={option.date}
                style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                onPress={() => handleSelectDate(option.date)}
                accessibilityLabel={`Select ${option.label}`}
                accessibilityRole="button"
              >
                <Text style={[styles.dateDayLabel, isSelected && styles.dateDayLabelSelected]}>
                  {parts[0]}
                </Text>
                <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
                  {parts[1]}
                </Text>
                <Text style={[styles.dateMonth, isSelected && styles.dateMonthSelected]}>
                  {parts[2]}
                </Text>
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

      <View style={styles.footer}>
        <Pressable
          style={[styles.purchaseBtn, !canPurchase && styles.purchaseBtnDisabled]}
          onPress={handlePurchase}
          disabled={!canPurchase}
          accessibilityLabel="Purchase tickets"
          accessibilityRole="button"
        >
          {isSubmitting
            ? <ActivityIndicator color="white" />
            : <Text style={styles.purchaseBtnText}>Purchase</Text>
          }
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
