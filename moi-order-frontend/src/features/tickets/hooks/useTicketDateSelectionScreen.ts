import { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';

import { createTicketOrder } from '@/shared/api/ticketOrders';
import { RootStackParamList } from '@/types/navigation';
import { ApiError, TicketOrder } from '@/types/models';
import { VariantSelections } from '../types';

type RouteParams = RouteProp<RootStackParamList, 'TicketDateSelection'>;

export interface DateOption {
  date: string;   // "YYYY-MM-DD"
  label: string;  // "Thu 17 Apr"
  isToday: boolean;
}

export interface UseTicketDateSelectionScreenResult {
  dates: DateOption[];
  selectedDate: string | null;
  isSubmitting: boolean;
  submitError: ApiError | null;
  canPurchase: boolean;
  handleSelectDate: (date: string) => void;
  handlePurchase: () => void;
  handleBack: () => void;
}

function buildDateOptions(): DateOption[] {
  const options: DateOption[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    options.push({
      date: iso,
      label: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      isToday: i === 0,
    });
  }
  return options;
}

export function useTicketDateSelectionScreen(): UseTicketDateSelectionScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { ticketId, selectionsJson } = route.params;

  const selections: VariantSelections = useMemo(
    () => JSON.parse(selectionsJson) as VariantSelections,
    [selectionsJson],
  );

  const dates = useMemo(() => buildDateOptions(), []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { mutate: submitOrder, isPending: isSubmitting, error: submitError } = useMutation<
    TicketOrder,
    ApiError
  >({
    mutationFn: () => createTicketOrder({
      ticket_id:       ticketId,
      visit_date:      selectedDate!,
      idempotency_key: Crypto.randomUUID(),
      items: Object.entries(selections).map(([variantId, quantity]) => ({
        ticket_variant_id: Number(variantId),
        quantity,
      })),
    }),
    onSuccess: (order) => {
      navigation.navigate('Payment', { kind: 'ticket_order', ticketOrderId: order.id });
    },
  });

  const canPurchase = selectedDate !== null && !isSubmitting;

  const handleSelectDate = useCallback((date: string): void => {
    setSelectedDate(date);
  }, []);

  const handlePurchase = useCallback((): void => {
    if (canPurchase) submitOrder();
  }, [canPurchase, submitOrder]);

  const handleBack = useCallback((): void => { navigation.goBack(); }, [navigation]);

  return {
    dates, selectedDate, isSubmitting,
    submitError: submitError ?? null,
    canPurchase,
    handleSelectDate, handlePurchase, handleBack,
  };
}
