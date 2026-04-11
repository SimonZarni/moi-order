import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { formatCurrency } from '@/shared/utils/formatCurrency';
import { ServiceType } from '@/types/models';
import { styles } from './ServiceTypeCard.styles';

interface Props {
  type: ServiceType;
  onPress: (type: ServiceType) => void;
}

export function ServiceTypeCard({ type, onPress }: Props): React.JSX.Element {
  const handlePress = (): void => {
    onPress(type);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
      onPress={handlePress}
      accessibilityLabel={`Select ${type.name_en} — ${formatCurrency(type.price)}`}
      accessibilityRole="button"
    >
      <View style={styles.content}>
        <Text style={styles.nameEn}>{type.name_en}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceCurrency}>฿</Text>
          <Text style={styles.priceAmount}>
            {type.price.toLocaleString('th-TH')}
          </Text>
        </View>
      </View>
      <View style={styles.chevron}>
        <Text style={styles.chevronText}>›</Text>
      </View>
    </Pressable>
  );
}
