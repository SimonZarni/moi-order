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

export type DatePickerStep = 'year' | 'month' | 'day';

// ─── Static data ──────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();

export const PICKER_YEARS: number[] = [
  CURRENT_YEAR - 2,
  CURRENT_YEAR - 1,
  CURRENT_YEAR,
  CURRENT_YEAR + 1,
  CURRENT_YEAR + 2,
];

export const PICKER_MONTHS: MonthOption[] = [
  { value: 1,  abbrev: 'Jan', fullName: 'January'   },
  { value: 2,  abbrev: 'Feb', fullName: 'February'  },
  { value: 3,  abbrev: 'Mar', fullName: 'March'     },
  { value: 4,  abbrev: 'Apr', fullName: 'April'     },
  { value: 5,  abbrev: 'May', fullName: 'May'       },
  { value: 6,  abbrev: 'Jun', fullName: 'June'      },
  { value: 7,  abbrev: 'Jul', fullName: 'July'      },
  { value: 8,  abbrev: 'Aug', fullName: 'August'    },
  { value: 9,  abbrev: 'Sep', fullName: 'September' },
  { value: 10, abbrev: 'Oct', fullName: 'October'   },
  { value: 11, abbrev: 'Nov', fullName: 'November'  },
  { value: 12, abbrev: 'Dec', fullName: 'December'  },
];

// ─── Day generation ────────────────────────────────────────────────────────────

function buildDayOptions(year: number, month: number): DateOption[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // new Date(year, month, 0) gives the last day of the chosen month (month is 1-indexed here).
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
  years:         number[];
  months:        MonthOption[];
  days:          DateOption[];
  selectedYear:  number | null;
  selectedMonth: number | null;
  selectedDate:  string | null;
  isSubmitting:  boolean;
  submitError:   ApiError | null;
  canPurchase:   boolean;
  handleSelectYear:  (year: number)  => void;
  handleSelectMonth: (month: number) => void;
  handleSelectDay:   (date: string)  => void;
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

  const [step,          setStep]          = useState<DatePickerStep>('year');
  const [selectedYear,  setSelectedYear]  = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDate,  setSelectedDate]  = useState<string | null>(null);

  const days = useMemo(
    () => (selectedYear !== null && selectedMonth !== null
      ? buildDayOptions(selectedYear, selectedMonth)
      : []),
    [selectedYear, selectedMonth],
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

  const handleSelectYear = useCallback((year: number): void => {
    setSelectedYear(year);
    setSelectedMonth(null);   // reset dependent state
    setSelectedDate(null);
    setStep('month');
  }, []);

  const handleSelectMonth = useCallback((month: number): void => {
    setSelectedMonth(month);
    setSelectedDate(null);    // reset dependent state
    setStep('day');
  }, []);

  const handleSelectDay = useCallback((date: string): void => {
    setSelectedDate(date);
    // Stay on day step — user confirms with Purchase button.
  }, []);

  const handlePurchase = useCallback((): void => {
    if (canPurchase) submitOrder();
  }, [canPurchase, submitOrder]);

  // Back behaviour: day → month → year → previous screen.
  const handleBack = useCallback((): void => {
    if (step === 'year')  { navigation.goBack(); return; }
    if (step === 'month') { setStep('year');      return; }
    setStep('month');
  }, [step, navigation]);

  return {
    step,
    years:  PICKER_YEARS,
    months: PICKER_MONTHS,
    days,
    selectedYear,
    selectedMonth,
    selectedDate,
    isSubmitting,
    submitError:  submitError ?? null,
    canPurchase,
    handleSelectYear,
    handleSelectMonth,
    handleSelectDay,
    handlePurchase,
    handleBack,
  };
}
