import React from 'react';
import { View, Text, FlatList, SectionList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrdersScreen } from '../hooks/useOrdersScreen';
import { OrderCard } from '../components/OrderCard';
import { styles } from './OrdersScreen.styles';
import { colours } from '../../../shared/theme/colours';
import type { FoodOrder } from '../../../types/models';

type Section = { title: string; data: FoodOrder[] };

interface OrdersScreenProps {
  onSelectOrder?: (orderId: number) => void;
}

export function OrdersScreen({ onSelectOrder }: OrdersScreenProps): React.JSX.Element {
  const { newOrders, inProgressOrders, doneOrders, isLoading, handleUpdateStatus } = useOrdersScreen();

  const sections: Section[] = [
    { title: 'New Orders', data: newOrders },
    { title: 'In Progress', data: inProgressOrders },
    { title: 'Completed & Cancelled', data: doneOrders },
  ].filter((s) => s.data.length > 0);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onUpdateStatus={handleUpdateStatus}
            onPress={onSelectOrder !== undefined ? () => onSelectOrder(item.id) : undefined}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Ionicons name="receipt-outline" size={40} color={colours.medium} />
            <Text style={styles.empty}>No orders yet</Text>
          </View>
        }
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
}
