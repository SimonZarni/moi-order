import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { useLocale } from '@/shared/hooks/useLocale';
import { localeName } from '@/shared/utils/localeName';
import { ServiceType } from '@/types/models';
import { styles } from './ServiceTypeCard.styles';

interface Props {
  type: ServiceType;
  onPress: (type: ServiceType) => void;
}

export function ServiceTypeCard({ type, onPress }: Props): React.JSX.Element {
  const { locale } = useLocale();
  const displayName = localeName(type, locale);

  const handlePress = (): void => {
    onPress(type);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
      onPress={handlePress}
      accessibilityLabel={`Select ${displayName} — ${formatCurrency(type.price)}`}
      accessibilityRole="button"
    >
      <View style={styles.content}>
        <Text style={styles.nameEn}>{displayName}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceCurrency}>฿</Text>
          <Text style={styles.priceAmount}>
            {type.price.toLocaleString('th-TH')}
          </Text>
        </View>
      </View>
      <View style={styles.chevron}>
        <Ionicons name="chevron-forward" size={18} color={colours.textMuted} />
      </View>
    </Pressable>
  );
}
