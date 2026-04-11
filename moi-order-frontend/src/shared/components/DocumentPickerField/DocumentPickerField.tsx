import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles } from './DocumentPickerField.styles';

interface DocumentPickerFieldProps {
  label: string;
  icon: string;            // emoji shown before upload
  onPress: () => void;
  isUploaded: boolean;
  error?: string | undefined;
  accessibilityLabel: string;
  hint?: string | undefined;           // overrides default "Tap to select image"
  uploadedHint?: string | undefined;   // overrides default "Image selected — tap to change"
}

export function DocumentPickerField({
  label,
  icon,
  onPress,
  isUploaded,
  error,
  accessibilityLabel,
  hint,
  uploadedHint,
}: DocumentPickerFieldProps): React.JSX.Element {
  const hasError = error != null && error.length > 0;

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={[
          styles.picker,
          hasError ? styles.pickerError : null,
          isUploaded ? styles.pickerUploaded : null,
        ]}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
      >
        <View style={[styles.iconBox, isUploaded && styles.iconBoxUploaded]}>
          <Text style={styles.iconText}>{isUploaded ? '✓' : icon}</Text>
        </View>
        <View style={styles.textCol}>
          <Text style={styles.title}>{label}</Text>
          <Text style={[styles.hint, isUploaded && styles.hintUploaded]}>
            {isUploaded
              ? (uploadedHint ?? 'Image selected — tap to change')
              : (hint ?? 'Tap to select image')}
          </Text>
        </View>
      </Pressable>
      {hasError ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}
