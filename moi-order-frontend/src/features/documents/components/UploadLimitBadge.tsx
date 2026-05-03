import React, { useCallback, useState } from 'react';
import { Modal, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { UploadStats } from '@/types/models';
import { DocumentType } from '@/types/enums';
import { colours } from '@/shared/theme/colours';
import { styles } from './UploadLimitBadge.styles';

interface Props {
  stats:       UploadStats | undefined;
  sectionType: DocumentType;
}

export function UploadLimitBadge({ stats, sectionType }: Props): React.JSX.Element | null {
  const [showInfo, setShowInfo] = useState(false);

  const handleInfoPress = useCallback((): void => {
    setShowInfo(true);
  }, []);

  const handleDismiss = useCallback((): void => {
    setShowInfo(false);
  }, []);

  if (!stats || stats.is_privileged) return null;

  const section  = stats.sections[sectionType as keyof typeof stats.sections];
  const todayUsed  = section?.today_used ?? 0;
  const dailyLimit = section?.daily_limit ?? 5;
  const isAtLimit  = todayUsed >= dailyLimit;

  return (
    <View style={styles.row}>
      <Text style={[styles.label, isAtLimit && styles.labelRed]}>
        {'Uploads used '}
        <Text style={[styles.count, isAtLimit && styles.countRed]}>
          [{todayUsed}/{dailyLimit}]
        </Text>
      </Text>

      <Pressable
        onPress={handleInfoPress}
        accessibilityLabel="Upload limit information"
        accessibilityRole="button"
        style={styles.infoBtn}
      >
        <Ionicons
          name="information-circle-outline"
          size={16}
          color={isAtLimit ? colours.danger : colours.textMuted}
        />
      </Pressable>

      <Modal
        visible={showInfo}
        transparent
        animationType="fade"
        onRequestClose={handleDismiss}
      >
        <TouchableWithoutFeedback onPress={handleDismiss} accessibilityLabel="Close info">
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>Uploads reset monthly on the 1st</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
