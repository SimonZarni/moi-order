import React from 'react';

import { DatePickerStepLayout } from '../components/DatePickerStepLayout';
import { useTicketDateSelectionScreen } from '../hooks/useTicketDateSelectionScreen';

/**
 * Single-page date picker: month selector at top, day grid below, purchase footer.
 * All layout and logic are delegated to DatePickerStepLayout + useTicketDateSelectionScreen.
 */
export function TicketDateSelectionScreen(): React.JSX.Element {
  const {
    months, days,
    selectedMonth, selectedDate,
    isSubmitting, submitError, canPurchase,
    handleSelectMonth, handleSelectDay,
    handlePurchase, handleBack,
  } = useTicketDateSelectionScreen();

  return (
    <DatePickerStepLayout
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
