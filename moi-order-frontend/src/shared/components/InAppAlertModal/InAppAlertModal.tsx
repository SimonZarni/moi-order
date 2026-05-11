import React from 'react';
import { Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';

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
          <ScrollView style={styles.body} scrollEnabled={false}>
            <Text style={styles.title}>{alert.title}</Text>
            <Text style={styles.message}>{alert.message}</Text>
          </ScrollView>
          <View style={styles.footer}>
            <Pressable
              style={styles.dismissButton}
              onPress={onDismiss}
              accessibilityLabel="Dismiss alert"
              accessibilityRole="button"
            >
              <Text style={styles.dismissText}>Got it</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
