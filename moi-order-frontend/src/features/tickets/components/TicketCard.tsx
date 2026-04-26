import React from 'react';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { formatPrice } from '@/shared/utils/formatCurrency';
import { Ticket } from '@/types/models';
import { styles } from './TicketCard.styles';

interface TicketCardProps {
  item: Ticket;
  onPress: (id: number) => void;
}

export function TicketCard({ item, onPress }: TicketCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.cardWrap, { opacity: pressed ? 0.88 : 1 }]}
      onPress={() => onPress(item.id)}
      accessibilityLabel={item.name}
      accessibilityRole="button"
    >
      <Image
        source={{ uri: item.cover_image_url ?? undefined }}
        style={styles.cardImage}
        contentFit="cover"
        cachePolicy="disk"
        transition={150}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardHighlight} numberOfLines={2}>{item.highlight_description}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardLocation}>{item.city}</Text>
          {item.starting_from_price !== undefined && (
            <Text style={styles.cardPrice}>From {formatPrice(item.starting_from_price)}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
