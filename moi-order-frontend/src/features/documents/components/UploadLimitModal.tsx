import React from 'react';
import { Modal, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { styles } from './UploadLimitModal.styles';

interface Props {
  visible:          boolean;
  monthlyRemaining: number;
  onUpload:         () => void;
  onCancel:         () => void;
}

export function UploadLimitModal({ visible, monthlyRemaining, onUpload, onCancel }: Props): React.JSX.Element {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel} accessibilityLabel="Close modal">
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.iconWrap}>
                <Ionicons name="cloud-upload-outline" size={32} color={colours.primary} />
              </View>

              <Text style={styles.title}>Daily Section Limit Reached</Text>
              <Text style={styles.body}>
                {"You've used today's 5-upload limit for this section.\n\n"}
                <Text style={styles.highlight}>{monthlyRemaining} upload{monthlyRemaining === 1 ? '' : 's'}</Text>
                {' remaining this month across all sections.'}
              </Text>

              <View style={styles.actions}>
                <Pressable
                  style={[styles.btn, styles.cancelBtn]}
                  onPress={onCancel}
                  accessibilityLabel="Cancel upload"
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[styles.btn, styles.uploadBtn]}
                  onPress={onUpload}
                  accessibilityLabel="Upload anyway"
                  accessibilityRole="button"
                >
                  <Text style={styles.uploadBtnText}>Upload</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
