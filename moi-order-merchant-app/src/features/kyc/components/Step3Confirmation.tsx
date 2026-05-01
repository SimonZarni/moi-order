import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './Step3Confirmation.styles';
import { colours } from '../../../shared/theme/colours';

interface Step3ConfirmationProps {
  onLogout: () => void;
}

export function Step3Confirmation({ onLogout }: Step3ConfirmationProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={80} color={colours.primary} />
      </View>
      <Text style={styles.title}>Application Submitted!</Text>
      <Text style={styles.body}>
        Your application is under review. We will notify you within 1–2 business
        days once the verification is complete.
      </Text>
      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={16} color={colours.primary} />
        <Text style={styles.infoText}>
          You will receive an email notification when your account is approved.
        </Text>
      </View>
      <Pressable
        style={styles.logoutButton}
        onPress={onLogout}
        accessibilityLabel="Log out of the application"
        accessibilityRole="button"
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </View>
  );
}
