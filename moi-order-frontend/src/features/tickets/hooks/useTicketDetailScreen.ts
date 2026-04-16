import { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTicketDetail } from './useTicketDetail';
import { RootStackParamList } from '@/types/navigation';
import { TicketVariant } from '@/types/models';
import { VariantSelections } from '../types';

type RouteParams = RouteProp<RootStackParamList, 'TicketDetail'>;

export interface UseTicketDetailScreenResult {
  ticket: ReturnType<typeof useTicketDetail>['ticket'];
  isLoading: boolean;
  isError: boolean;
  selections: VariantSelections;
  totalItems: number;
  totalPrice: number;
  canProceed: boolean;
  handleIncrement: (variantId: number) => void;
  handleDecrement: (variantId: number) => void;
  handlePayNow: () => void;
  handleBack: () => void;
}

const MAX_PER_VARIANT = 15;

export function useTicketDetailScreen(): UseTicketDetailScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { ticketId } = route.params;

  const { ticket, isLoading, isError } = useTicketDetail(ticketId);

  const [selections, setSelections] = useState<VariantSelections>({});

  const totalItems = useMemo(
    () => Object.values(selections).reduce((sum, qty) => sum + qty, 0),
    [selections],
  );

  const totalPrice = useMemo(() => {
    if (!ticket?.variants) return 0;
    return ticket.variants.reduce((sum, v: TicketVariant) => {
      return sum + v.price * (selections[v.id] ?? 0);
    }, 0);
  }, [ticket?.variants, selections]);

  const canProceed = totalItems > 0;

  const handleIncrement = useCallback((variantId: number): void => {
    setSelections((prev) => {
      const current = prev[variantId] ?? 0;
      if (current >= MAX_PER_VARIANT) return prev;
      return { ...prev, [variantId]: current + 1 };
    });
  }, []);

  const handleDecrement = useCallback((variantId: number): void => {
    setSelections((prev) => {
      const current = prev[variantId] ?? 0;
      if (current <= 0) return prev;
      const next = { ...prev, [variantId]: current - 1 };
      if (next[variantId] === 0) delete next[variantId];
      return next;
    });
  }, []);

  const handlePayNow = useCallback((): void => {
    const activeSelections: VariantSelections = Object.fromEntries(
      Object.entries(selections).filter(([, qty]) => qty > 0),
    );
    navigation.navigate('TicketDateSelection', {
      ticketId,
      selectionsJson: JSON.stringify(activeSelections),
    });
  }, [navigation, ticketId, selections]);

  const handleBack = useCallback((): void => { navigation.goBack(); }, [navigation]);

  return {
    ticket, isLoading, isError, selections,
    totalItems, totalPrice, canProceed,
    handleIncrement, handleDecrement, handlePayNow, handleBack,
  };
}
