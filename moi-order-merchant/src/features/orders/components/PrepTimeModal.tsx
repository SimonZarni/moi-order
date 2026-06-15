import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { styles } from './PrepTimeModal.styles';
import { useTranslation } from '../../../shared/hooks/useTranslation';

const PRESETS = [10, 15, 20, 30, 45, 60] as const;

interface PrepTimeModalProps {
  visible: boolean;
  selectedMinutes: number;
  onSelectMinutes: (minutes: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PrepTimeModal({ visible, selectedMinutes, onSelectMinutes, onConfirm, onCancel }: PrepTimeModalProps): React.JSX.Element {
  const t = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel} accessibilityRole="button" accessibilityLabel="Close">
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()} accessibilityRole="none">
          <Text style={styles.title}>{t('prep_time_modal_title')}</Text>
          <Text style={styles.subtitle}>{t('prep_time_modal_subtitle')}</Text>

          <View style={styles.presets}>
            {PRESETS.map((min) => {
              const active = selectedMinutes === min;
              return (
                <Pressable
                  key={min}
                  style={[styles.preset, active && styles.presetActive]}
                  onPress={() => onSelectMinutes(min)}
                  accessibilityRole="button"
                  accessibilityLabel={`${min} minutes`}
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.presetText, active && styles.presetTextActive]}>
                    {min} min
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable style={styles.confirmBtn} onPress={onConfirm} accessibilityRole="button" accessibilityLabel={t('prep_time_modal_confirm')}>
            <Text style={styles.confirmBtnText}>{t('prep_time_modal_confirm')}</Text>
          </Pressable>

          <Pressable style={styles.cancelBtn} onPress={onCancel} accessibilityRole="button" accessibilityLabel={t('common_cancel')}>
            <Text style={styles.cancelBtnText}>{t('common_cancel')}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
