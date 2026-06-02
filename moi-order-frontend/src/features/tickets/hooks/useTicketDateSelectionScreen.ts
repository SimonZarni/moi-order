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

// ─── Dynamic month generation (next 3 months from today) ──────────────────────

function buildNextThreeMonths(): MonthOption[] {
  const today = new Date();
  const options: MonthOption[] = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    options.push({
      value:    d.getMonth() + 1,
      year:     d.getFullYear(),
      abbrev:   d.toLocaleDateString('en-GB', { month: 'short' }),
      fullName: d.toLocaleDateString('en-GB', { month: 'long'  }),
    });
  }
  return options;
}

export const PICKER_MONTHS: MonthOption[] = buildNextThreeMonths();

// ─── Day generation ────────────────────────────────────────────────────────────

function buildDayOptions(year: number, month: number): DateOption[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  const [selectedMonth, setSelectedMonth] = useState<MonthOption | null>(null);
  const [selectedDate,  setSelectedDate]  = useState<string | null>(null);

  // Auto-select the current month on first render.
  const [initialized] = useState<MonthOption>(() => PICKER_MONTHS[0]!);
  const resolvedMonth = selectedMonth ?? initialized;

  const days = useMemo(
    () => buildDayOptions(resolvedMonth.year, resolvedMonth.value),
    [resolvedMonth],
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
    setSelectedDate(null);  // reset day when month changes
  }, []);

  const handleSelectDay = useCallback((date: string): void => {
    setSelectedDate(date);
  }, []);

  const handlePurchase = useCallback((): void => {
    if (canPurchase) submitOrder();
  }, [canPurchase, submitOrder]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return {
    months:        PICKER_MONTHS,
    days,
    selectedMonth: resolvedMonth,
    selectedDate,
    isSubmitting,
    submitError:   submitError ?? null,
    canPurchase,
    handleSelectMonth,
    handleSelectDay,
    handlePurchase,
    handleBack,
  };
}
