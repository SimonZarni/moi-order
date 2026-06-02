import React from 'react';

import { DatePickerStepLayout } from '../components/DatePickerStepLayout';
import { useTicketDateSelectionScreen } from '../hooks/useTicketDateSelectionScreen';

/**
 * Entry point for the 2-step date picker: month → day → purchase.
 * All layout and logic are delegated to DatePickerStepLayout + useTicketDateSelectionScreen.
 */
export function TicketDateSelectionScreen(): React.JSX.Element {
  const {
    step, months, days,
    selectedMonth, selectedDate,
    isSubmitting, submitError, canPurchase,
    handleSelectMonth, handleSelectDay,
    handlePurchase, handleBack,
  } = useTicketDateSelectionScreen();

  return (
    <DatePickerStepLayout
      step={step}
      months={months}
      days={days}
      selectedMonth={selectedMonth}
      selectedDate={selectedDate}
      isSubmitting={isSubmitting}
      submitError={submitError}
      canPurchase={canPurchase}
      onSelectMonth={handleSelectMonth}
      onSelectDay={handleSelectDay}
      onPurchase={handlePurchase}
      onBack={handleBack}
    />
  );
}
