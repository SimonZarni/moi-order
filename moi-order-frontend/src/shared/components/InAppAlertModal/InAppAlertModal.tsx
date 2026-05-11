import React from 'react';
import { Image, Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import type { AppConfigAlertItem } from '@/shared/api/appConfig';

import { styles } from './InAppAlertModal.styles';

// ----------------------------------------------------------------------

interface Props {
  alert: AppConfigAlertItem | null;
  onDismiss: () => void;
}

export function InAppAlertModal({ alert, onDismiss }: Props): React.JSX.Element | null {
  if (alert === null) return null;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {alert.image_url !== null && (
            <Image
              source={{ uri: alert.image_url }}
              style={styles.image}
              resizeMode="cover"
              accessibilityLabel="Alert image"
            />
          )}
          <View style={styles.body}>
            <View style={styles.header}>
              <Ionicons name="warning-outline" size={22} color={colours.warning} />
              <Text style={styles.title}>{alert.title}</Text>
            </View>
            <Text style={styles.message}>{alert.message}</Text>
            <Pressable
              style={styles.closeButton}
              onPress={onDismiss}
              accessibilityLabel="Close alert"
              accessibilityRole="button"
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
