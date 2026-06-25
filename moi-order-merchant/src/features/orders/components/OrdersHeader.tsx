import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './OrdersHeader.styles';
import { colours } from '../../../shared/theme/colours';
import { useTranslation } from '../../../shared/hooks/useTranslation';

interface OrdersHeaderProps {
  pending: number;
  isActionsOpen: boolean;
  onPendingPress: () => void;
  onToggle: () => void;
  onClose: () => void;
  onCancelled?: () => void;
  onExport: () => void;
}

export function OrdersHeader({ pending, isActionsOpen, onPendingPress, onToggle, onClose, onCancelled, onExport }: OrdersHeaderProps): React.JSX.Element {
  const t = useTranslation();

  return (
    <>
      {isActionsOpen && (
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close menu" />
      )}

      <View style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.title}>{t('orders_title')}</Text>
          {pending > 0 && (
            <Pressable
              style={styles.pendingPill}
              onPress={onPendingPress}
              accessibilityRole="button"
              accessibilityLabel={`${pending} pending orders`}
            >
              <View style={styles.pendingDot} />
              <Text style={styles.pendingText}>{pending} {t('orders_pending_count')}</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.overflowWrapper}>
          <Pressable
            style={styles.overflowBtn}
            onPress={onToggle}
            accessibilityRole="button"
            accessibilityLabel="More actions"
          >
            <Ionicons name="ellipsis-vertical" size={18} color={colours.textMuted} />
          </Pressable>

          {isActionsOpen && (
            <View style={styles.dropdown}>
              <Pressable
                style={styles.dropdownItem}
                onPress={() => { onClose(); onCancelled?.(); }}
                accessibilityRole="button"
                accessibilityLabel="View cancelled orders"
              >
                <Ionicons name="close-circle-outline" size={15} color={colours.error} />
                <Text style={[styles.dropdownText, { color: colours.error }]}>{t('orders_cancelled_orders')}</Text>
              </Pressable>

              {Platform.OS === 'web' && (
                <>
                  <View style={styles.dropdownDivider} />
                  <Pressable
                    style={styles.dropdownItem}
                    onPress={() => { onClose(); onExport(); }}
                    accessibilityRole="button"
                    accessibilityLabel="Export orders as CSV"
                  >
                    <Ionicons name="download-outline" size={15} color={colours.textOnLight} />
                    <Text style={styles.dropdownText}>{t('common_export_csv')}</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </>
  );
}
