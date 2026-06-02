import { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';

import { createTicketOrder } from '@/shared/api/ticketOrders';
import { RootStackParamList } from '@/types/navigation';
import { navigateAfterTicketOrder } from '@/shared/utils/navigateAfterOrder';
import { ApiError, TicketOrder } from '@/types/models';
import { DateOption, MonthOption, SelectionItem } from '../types';

type RouteParams = RouteProp<RootStackParamList, 'TicketDateSelection'>;

export type DatePickerStep = 'month' | 'day';

// ─── Dynamic month generation (next 3 months from today) ──────────────────────

function buildNextThreeMonths(): MonthOption[] {
  const today = new Date();
  const options: MonthOption[] = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    options.push({
      value:    d.getMonth() + 1,                                          // 1–12
      year:     d.getFullYear(),
      abbrev:   d.toLocaleDateString('en-GB', { month: 'short' }),         // "Jun"
      fullName: d.toLocaleDateString('en-GB', { month: 'long'  }),         // "June"
    });
  }
  return options;
}

// Computed once per app session — months don't change within a session.
export const PICKER_MONTHS: MonthOption[] = buildNextThreeMonths();

// ─── Day generation ────────────────────────────────────────────────────────────

function buildDayOptions(year: number, month: number): DateOption[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // new Date(year, month, 0) gives the last day of the chosen month (month is 1-indexed).
  const daysInMonth = new Date(year, month, 0).getDate();
  const options: DateOption[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const d   = new Date(year, month - 1, day);
    const y   = d.getFullYear();
    const m   = String(d.getMonth() + 1).padStart(2, '0');
    const dd  = String(d.getDate()).padStart(2, '0');
    const iso = `${y}-${m}-${dd}`;
    const label = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    options.push({ date: iso, label, isToday: d.getTime() === today.getTime() });
  }

  return options;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export interface UseTicketDateSelectionScreenResult {
  step:          DatePickerStep;
  months:        MonthOption[];
  days:          DateOption[];
  selectedMonth: MonthOption | null;
  selectedDate:  string | null;
  isSubmitting:  boolean;
  submitError:   ApiError | null;
  canPurchase:   boolean;
  handleSelectMonth: (month: MonthOption) => void;
  handleSelectDay:   (date: string)       => void;
  handlePurchase:    () => void;
  handleBack:        () => void;
}

export function useTicketDateSelectionScreen(): UseTicketDateSelectionScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { ticketId, selectionsJson } = route.params;

  const items: SelectionItem[] = useMemo(
    () => JSON.parse(selectionsJson) as SelectionItem[],
    [selectionsJson],
  );

  const [step,          setStep]          = useState<DatePickerStep>('month');
  const [selectedMonth, setSelectedMonth] = useState<MonthOption | null>(null);
  const [selectedDate,  setSelectedDate]  = useState<string | null>(null);

  const days = useMemo(
    () => selectedMonth !== null
      ? buildDayOptions(selectedMonth.year, selectedMonth.value)
      : [],
    [selectedMonth],
  );

  const { mutate: submitOrder, isPending: isSubmitting, error: submitError } = useMutation<
    TicketOrder,
    ApiError
  >({
    mutationFn: () => createTicketOrder({
      ticket_id:       ticketId,
      visit_date:      selectedDate!,
      idempotency_key: Crypto.randomUUID(),
      items,
    }),
    onSuccess: (order) => {
      navigateAfterTicketOrder(navigation, order);
    },
  });

  const canPurchase = selectedDate !== null && !isSubmitting;

  const handleSelectMonth = useCallback((month: MonthOption): void => {
    setSelectedMonth(month);
    setSelectedDate(null);   // reset dependent state
    setStep('day');
  }, []);

  const handleSelectDay = useCallback((date: string): void => {
    setSelectedDate(date);
    // Stay on day step — user confirms with Purchase button.
  }, []);

  const handlePurchase = useCallback((): void => {
    if (canPurchase) submitOrder();
  }, [canPurchase, submitOrder]);

  // Back behaviour: day → month → previous screen.
  const handleBack = useCallback((): void => {
    if (step === 'month') { navigation.goBack(); return; }
    setStep('month');
  }, [step, navigation]);

  return {
    step,
    months: PICKER_MONTHS,
    days,
    selectedMonth,
    selectedDate,
    isSubmitting,
    submitError:  submitError ?? null,
    canPurchase,
    handleSelectMonth,
    handleSelectDay,
    handlePurchase,
    handleBack,
  };
}
