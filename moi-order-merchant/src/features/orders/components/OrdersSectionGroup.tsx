import React from 'react';
import { View, Text } from 'react-native';
import { OrderCard } from './OrderCard';
import { styles } from './OrdersSectionGroup.styles';
import { colours } from '../../../shared/theme/colours';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { OrderSection } from '../hooks/useOrdersScreen';
import type { FoodOrder } from '../../../types/models';

const SECTION_ACCENT: Record<string, string> = {
  'New Orders':          colours.warning,
  'In Progress':         colours.primary,
  'Completed':           colours.success,
  'Cancelled & Expired': colours.error,
};

const SECTION_LABEL_KEY: Record<string, string> = {
  'New Orders':  'orders_section_new',
  'In Progress': 'orders_section_in_progress',
  'Completed':   'orders_section_done',
};

interface OrdersSectionGroupProps {
  section: OrderSection;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
  onStartPreparing: (orderId: string) => void;
  onSelectOrder?: (orderId: string) => void;
}

export function OrdersSectionGroup({ section, onUpdateStatus, onStartPreparing, onSelectOrder }: OrdersSectionGroupProps): React.JSX.Element {
  const t = useTranslation();
  const accent    = SECTION_ACCENT[section.title] ?? colours.primary;
  const labelKey  = SECTION_LABEL_KEY[section.title];
  const label     = labelKey ? t(labelKey as Parameters<typeof t>[0]) : section.title;

  return (
    <View style={styles.container}>
      <View style={[styles.accentBar, { backgroundColor: accent }]} />
      <View style={styles.header}>
        <View style={[styles.headerDot, { backgroundColor: accent }]} />
        <Text style={styles.headerTitle}>{label}</Text>
        <View style={[styles.headerBadge, { backgroundColor: accent + '18', borderColor: accent + '44' }]}>
          <Text style={[styles.headerCount, { color: accent }]}>{section.data.length}</Text>
        </View>
      </View>
      {section.data.map((item: FoodOrder) => (
        <OrderCard
          key={item.id}
          order={item}
          variant="light"
          onUpdateStatus={onUpdateStatus}
          onStartPreparing={onStartPreparing}
          onPress={onSelectOrder !== undefined ? () => onSelectOrder(item.id) : undefined}
        />
      ))}
    </View>
  );
}
