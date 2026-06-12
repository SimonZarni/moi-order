import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { styles } from './Step1BusinessInfo.styles';
import { colours } from '../../../shared/theme/colours';

const PRESET_TYPES = ['Restaurant', 'Cafe', 'Food Stall'] as const;
const BUSINESS_TYPES = [...PRESET_TYPES, 'Other'] as const;

interface Step1Data {
  business_name: string;
  business_type: string;
  business_address: string;
  business_phone: string;
}

interface Step1BusinessInfoProps {
  initialData: Step1Data;
  isLoading: boolean;
  onSubmit: (data: Step1Data) => void;
}

export function Step1BusinessInfo({
  initialData,
  isLoading,
  onSubmit,
}: Step1BusinessInfoProps): React.JSX.Element {
  const isInitialPreset = (PRESET_TYPES as readonly string[]).includes(initialData.business_type);

  const [businessName, setBusinessName] = useState(initialData.business_name);
  const [selectedChip, setSelectedChip] = useState<string>(
    isInitialPreset ? initialData.business_type : 'Other',
  );
  const [otherTypeText, setOtherTypeText] = useState(
    isInitialPreset ? '' : initialData.business_type,
  );
  const [businessAddress, setBusinessAddress] = useState(initialData.business_address);
  const [businessPhone, setBusinessPhone] = useState(initialData.business_phone);

  const isOtherSelected = selectedChip === 'Other';

  const handleChipPress = useCallback((type: string) => {
    setSelectedChip(type);
    if (type !== 'Other') setOtherTypeText('');
  }, []);

  const handleSubmit = useCallback(() => {
    const businessType = isOtherSelected
      ? (otherTypeText.trim() || 'Other')
      : selectedChip;
    onSubmit({
      business_name: businessName.trim(),
      business_type: businessType,
      business_address: businessAddress.trim(),
      business_phone: businessPhone.trim(),
    });
  }, [businessName, selectedChip, isOtherSelected, otherTypeText, businessAddress, businessPhone, onSubmit]);

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionTitle}>Business Information</Text>

      <Text style={styles.label}>Business Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Your restaurant name"
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={businessName}
        onChangeText={setBusinessName}
        accessibilityLabel="Business name"
      />

      <Text style={styles.label}>Business Type</Text>
      <View style={styles.typeRow}>
        {BUSINESS_TYPES.map((type) => (
          <Pressable
            key={type}
            style={[styles.typeChip, selectedChip === type && styles.typeChipSelected]}
            onPress={() => handleChipPress(type)}
            accessibilityLabel={`Select business type: ${type}`}
            accessibilityRole="button"
          >
            <Text style={[styles.typeChipText, selectedChip === type && styles.typeChipTextSelected]}>
              {type}
            </Text>
          </Pressable>
        ))}
      </View>
      {isOtherSelected && (
        <TextInput
          style={styles.input}
          placeholder="Describe your business type"
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={otherTypeText}
          onChangeText={setOtherTypeText}
          accessibilityLabel="Other business type description"
        />
      )}

      <Text style={styles.label}>Business Address</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Full address of your business"
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={businessAddress}
        onChangeText={setBusinessAddress}
        multiline
        numberOfLines={3}
        accessibilityLabel="Business address"
      />

      <Text style={styles.label}>Business Phone <Text style={styles.labelOptional}>(optional)</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. +959 123 456 789"
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={businessPhone}
        onChangeText={setBusinessPhone}
        keyboardType="phone-pad"
        autoComplete="tel"
        accessibilityLabel="Business phone number"
      />

      <Pressable
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
        accessibilityLabel="Continue to document upload"
        accessibilityRole="button"
      >
        {isLoading
          ? <ActivityIndicator color={colours.backgroundDark} />
          : <Text style={styles.buttonText}>Continue</Text>}
      </Pressable>
    </ScrollView>
  );
}
