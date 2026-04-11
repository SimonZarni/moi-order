import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { styles } from './FormField.styles';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  accessibilityLabel: string;
  error?: string | undefined;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  returnKeyType?: TextInputProps['returnKeyType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  secureTextEntry?: boolean;
  onSubmitEditing?: () => void;
  // Slot for trailing elements inside the input row (e.g. show/hide password toggle)
  rightElement?: React.ReactNode;
}

export function FormField({
  label,
  value,
  onChangeText,
  accessibilityLabel,
  error,
  placeholder,
  keyboardType,
  returnKeyType,
  autoCapitalize,
  autoComplete,
  secureTextEntry,
  onSubmitEditing,
  rightElement,
}: FormFieldProps): React.JSX.Element {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error != null && error.length > 0 ? styles.inputWrapperError : null]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          secureTextEntry={secureTextEntry}
          onSubmitEditing={onSubmitEditing}
          accessibilityLabel={accessibilityLabel}
        />
        {rightElement}
      </View>
      {error != null && error.length > 0 ? (
        <Text style={styles.fieldError}>{error}</Text>
      ) : null}
    </View>
  );
}
