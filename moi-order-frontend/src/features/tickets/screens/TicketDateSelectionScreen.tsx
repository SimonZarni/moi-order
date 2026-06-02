import React from 'react';

import { DatePickerStepLayout } from '../components/DatePickerStepLayout';
import { useTicketDateSelectionScreen } from '../hooks/useTicketDateSelectionScreen';

/**
 * Entry point for the 3-step date picker: year → month → day → purchase.
 * All layout and logic are delegated to DatePickerStepLayout + useTicketDateSelectionScreen.
 */
export function TicketDateSelectionScreen(): React.JSX.Element {
  const {
    step, years, months, days,
    selectedYear, selectedMonth, selectedDate,
    isSubmitting, submitError, canPurchase,
    handleSelectYear, handleSelectMonth, handleSelectDay,
    handlePurchase, handleBack,
  } = useTicketDateSelectionScreen();

  return (
    <DatePickerStepLayout
      step={step}
      years={years}
      months={months}
      days={days}
      selectedYear={selectedYear}
      selectedMonth={selectedMonth}
      selectedDate={selectedDate}
      isSubmitting={isSubmitting}
      submitError={submitError}
      canPurchase={canPurchase}
      onSelectYear={handleSelectYear}
      onSelectMonth={handleSelectMonth}
      onSelectDay={handleSelectDay}
      onPurchase={handlePurchase}
      onBack={handleBack}
    />
  );
}
