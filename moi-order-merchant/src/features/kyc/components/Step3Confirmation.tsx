import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './Step3Confirmation.styles';
import { colours } from '../../../shared/theme/colours';
import { useTranslation } from '../../../shared/hooks/useTranslation';

interface Step3ConfirmationProps {
  onLogout: () => void;
}

export function Step3Confirmation({ onLogout }: Step3ConfirmationProps): React.JSX.Element {
  const t = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={80} color={colours.primary} />
      </View>
      <Text style={styles.title}>{t('kyc_step3_title')}</Text>
      <Text style={styles.body}>{t('kyc_step3_body')}</Text>
      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={16} color={colours.primary} />
        <Text style={styles.infoText}>{t('kyc_step3_info')}</Text>
      </View>
      <Pressable
        style={styles.logoutButton}
        onPress={onLogout}
        accessibilityLabel="Log out of the application"
        accessibilityRole="button"
      >
        <Text style={styles.logoutText}>{t('kyc_log_out')}</Text>
      </Pressable>
    </View>
  );
}
