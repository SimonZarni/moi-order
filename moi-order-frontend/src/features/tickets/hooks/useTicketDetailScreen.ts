import { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTicketDetail } from './useTicketDetail';
import { RootStackParamList } from '@/types/navigation';
import { TicketVariant } from '@/types/models';
import { PersonTypeSelections, SelectionItem } from '../types';

type RouteParams = RouteProp<RootStackParamList, 'TicketDetail'>;

export interface UseTicketDetailScreenResult {
  ticket: ReturnType<typeof useTicketDetail>['ticket'];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  selections: PersonTypeSelections;
  totalItems: number;
  totalPrice: number;
  canProceed: boolean;
  handleIncrement: (variantId: number, personType: 'adult' | 'child') => void;
  handleDecrement: (variantId: number, personType: 'adult' | 'child') => void;
  handleRefresh: () => void;
  handlePayNow: () => void;
  handleBack: () => void;
}

const MAX_PER_VARIANT = 15;

export function useTicketDetailScreen(): UseTicketDetailScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { ticketId } = route.params;

  const { ticket, isLoading, isRefreshing, isError, refetch } = useTicketDetail(ticketId);

  const [selections, setSelections] = useState<PersonTypeSelections>({});

  const totalItems = useMemo(
    () => Object.values(selections).reduce((sum, { adult, child }) => sum + adult + child, 0),
    [selections],
  );

  const totalPrice = useMemo(() => {
    if (!ticket?.variants) return 0;
    return ticket.variants.reduce((sum, v: TicketVariant) => {
      const adultQty = selections[v.id]?.adult ?? 0;
      const childQty = selections[v.id]?.child ?? 0;
      const childPrice = v.child_price ?? v.adult_price;
      return sum + v.adult_price * adultQty + childPrice * childQty;
    }, 0);
  }, [ticket?.variants, selections]);

  const canProceed = totalItems > 0;

  const handleIncrement = useCallback((variantId: number, personType: 'adult' | 'child'): void => {
    setSelections((prev) => {
      const current = prev[variantId] ?? { adult: 0, child: 0 };
      if (current[personType] >= MAX_PER_VARIANT) return prev;
      return { ...prev, [variantId]: { ...current, [personType]: current[personType] + 1 } };
    });
  }, []);

  const handleDecrement = useCallback((variantId: number, personType: 'adult' | 'child'): void => {
    setSelections((prev) => {
      const current = prev[variantId] ?? { adult: 0, child: 0 };
      if (current[personType] <= 0) return prev;
      const updated = { ...current, [personType]: current[personType] - 1 };
      if (updated.adult === 0 && updated.child === 0) {
        const next = { ...prev };
        delete next[variantId];
        return next;
      }
      return { ...prev, [variantId]: updated };
    });
  }, []);

  const handlePayNow = useCallback((): void => {
    if (!ticket?.variants) return;
    const items: SelectionItem[] = [];
    for (const [variantIdStr, { adult, child }] of Object.entries(selections)) {
      const variantId = Number(variantIdStr);
      const variant   = ticket.variants.find((v) => v.id === variantId);
      const hasSplit  = variant?.child_price != null;
      if (hasSplit) {
        if (adult > 0) items.push({ ticket_variant_id: variantId, quantity: adult, person_type: 'adult' });
        if (child > 0) items.push({ ticket_variant_id: variantId, quantity: child, person_type: 'child' });
      } else {
        if (adult > 0) items.push({ ticket_variant_id: variantId, quantity: adult, person_type: 'general' });
      }
    }
    navigation.navigate('TicketDateSelection', {
      ticketId,
      selectionsJson: JSON.stringify(items),
    });
  }, [navigation, ticketId, selections, ticket?.variants]);

  const handleRefresh = useCallback((): void => { refetch(); }, [refetch]);
  const handleBack    = useCallback((): void => { navigation.goBack(); }, [navigation]);

  return {
    ticket, isLoading, isRefreshing, isError, selections,
    totalItems, totalPrice, canProceed,
    handleIncrement, handleDecrement, handleRefresh, handlePayNow, handleBack,
  };
}
