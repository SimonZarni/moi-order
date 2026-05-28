import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserAddress } from '@/types/models';
import { colours } from '@/shared/theme/colours';
import { styles } from './AddressCard.styles';

const LABEL_ICON: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  home:  'home-outline',
  work:  'briefcase-outline',
  other: 'location-outline',
};

interface Props {
  address: UserAddress;
  /** When provided, shows a checkmark border and radio indicator instead of action buttons. */
  selected?: boolean;
  onPress?: () => void;
  /** Manage mode: show Edit / Delete buttons. */
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AddressCard({ address, selected, onPress, onEdit, onDelete }: Props): React.JSX.Element {
  const iconName = LABEL_ICON[address.label] ?? 'location-outline';
  const lines = [address.building, address.floor, address.landmark].filter(Boolean);

  return (
    <Pressable
      style={[styles.card, selected === true && styles.cardSelected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${address.label_display} — ${address.address}`}
      accessibilityState={{ selected }}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={iconName} size={18} color={colours.primary} />
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.labelChip}>
            <Text style={styles.labelText}>{address.label_display.toUpperCase()}</Text>
          </View>
          {address.is_default && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>

        <Text style={styles.address} numberOfLines={2}>{address.address}</Text>
        {lines.length > 0 && (
          <Text style={styles.secondary} numberOfLines={1}>{lines.join(', ')}</Text>
        )}
      </View>

      {selected !== undefined ? (
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected && <View style={styles.radioDot} />}
        </View>
      ) : (
        <View style={styles.actions}>
          {onEdit !== undefined && (
            <Pressable
              style={styles.actionBtn}
              onPress={onEdit}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${address.label_display} address`}
            >
              <Text style={styles.actionEdit}>Edit</Text>
            </Pressable>
          )}
          {onDelete !== undefined && (
            <Pressable
              style={styles.actionBtn}
              onPress={onDelete}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${address.label_display} address`}
            >
              <Text style={styles.actionDelete}>Delete</Text>
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
}
