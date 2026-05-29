import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { AddressFormValues } from '../types';
import { useAddEditAddressScreen } from '../hooks/useAddEditAddressScreen';
import { styles } from './AddEditAddressScreen.styles';

const LABELS: Array<{ value: AddressFormValues['label']; display: string }> = [
  { value: 'home',  display: 'Home'  },
  { value: 'work',  display: 'Work'  },
  { value: 'other', display: 'Other' },
];

export function AddEditAddressScreen(): React.JSX.Element {
  const {
    isEdit, values, errors, isSaving, hasCoordinates,
    setField, clearCoordinates, handleOpenMap, handleSave, handleBack,
  } = useAddEditAddressScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
        </Pressable>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Address' : 'Add Address'}</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          {/* Label pills */}
          <Text style={styles.sectionLabel}>LABEL</Text>
          <View style={styles.pillRow}>
            {LABELS.map((l) => (
              <Pressable
                key={l.value}
                style={[styles.pill, values.label === l.value && styles.pillActive]}
                onPress={() => setField('label', l.value)}
                accessibilityRole="radio"
                accessibilityLabel={l.display}
                accessibilityState={{ checked: values.label === l.value }}
              >
                <Text style={[styles.pillText, values.label === l.value && styles.pillTextActive]}>
                  {l.display}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Contact name */}
          <Text style={styles.sectionLabel}>CONTACT NAME <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, Boolean(errors.contactName) && styles.inputError]}
            value={values.contactName}
            onChangeText={(v) => setField('contactName', v)}
            placeholder="e.g. John Smith"
            placeholderTextColor={colours.textMuted}
            maxLength={255}
            autoCapitalize="words"
            accessibilityLabel="Contact name"
          />
          {errors.contactName !== undefined && (
            <Text style={styles.errorText}>{errors.contactName}</Text>
          )}

          {/* Contact phone */}
          <Text style={styles.sectionLabel}>CONTACT PHONE <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, Boolean(errors.contactPhone) && styles.inputError]}
            value={values.contactPhone}
            onChangeText={(v) => setField('contactPhone', v)}
            placeholder="e.g. +66 81 234 5678"
            placeholderTextColor={colours.textMuted}
            maxLength={50}
            keyboardType="phone-pad"
            accessibilityLabel="Contact phone number"
          />
          {errors.contactPhone !== undefined && (
            <Text style={styles.errorText}>{errors.contactPhone}</Text>
          )}

          {/* Street address */}
          <Text style={styles.sectionLabel}>ADDRESS <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, Boolean(errors.address) && styles.inputError]}
            value={values.address}
            onChangeText={(v) => setField('address', v)}
            placeholder="เช่น 123 ถนนสุขุมวิท แขวงคลองเตย"
            placeholderTextColor={colours.textMuted}
            maxLength={500}
            accessibilityLabel="Street address"
          />
          {errors.address !== undefined && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}

          {/* Map pin button */}
          <Pressable
            style={styles.mapBtn}
            onPress={handleOpenMap}
            accessibilityRole="button"
            accessibilityLabel="Pin on map for accurate location"
          >
            <Ionicons name="location-outline" size={18} color={colours.primary} />
            <Text style={styles.mapBtnText}>Pin location on map</Text>
            <Ionicons name="chevron-forward" size={16} color={colours.textMuted} />
          </Pressable>

          {hasCoordinates && (
            <View style={styles.coordBadge}>
              <Ionicons name="location" size={14} color={colours.success} />
              <Text style={styles.coordText}>Location pinned</Text>
              <Pressable onPress={clearCoordinates} accessibilityRole="button" accessibilityLabel="Clear pinned location">
                <Ionicons name="close-circle" size={16} color={colours.textMuted} />
              </Pressable>
            </View>
          )}

          {/* Building / Unit */}
          <Text style={styles.sectionLabel}>BUILDING / UNIT</Text>
          <TextInput
            style={styles.input}
            value={values.building}
            onChangeText={(v) => setField('building', v)}
            placeholder="e.g. Building A, Unit 302"
            placeholderTextColor={colours.textMuted}
            maxLength={255}
            accessibilityLabel="Building or unit"
          />

          {/* Floor */}
          <Text style={styles.sectionLabel}>FLOOR</Text>
          <TextInput
            style={styles.input}
            value={values.floor}
            onChangeText={(v) => setField('floor', v)}
            placeholder="e.g. 3rd floor"
            placeholderTextColor={colours.textMuted}
            maxLength={100}
            accessibilityLabel="Floor"
          />

          {/* Landmark */}
          <Text style={styles.sectionLabel}>LANDMARK</Text>
          <TextInput
            style={styles.input}
            value={values.landmark}
            onChangeText={(v) => setField('landmark', v)}
            placeholder="เช่น ใกล้ 7-Eleven"
            placeholderTextColor={colours.textMuted}
            maxLength={255}
            accessibilityLabel="Landmark"
          />

          {/* Province */}
          <Text style={styles.sectionLabel}>PROVINCE / CITY <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, Boolean(errors.province) && styles.inputError]}
            value={values.province}
            onChangeText={(v) => setField('province', v)}
            placeholder="เช่น กรุงเทพมหานคร, เชียงใหม่"
            placeholderTextColor={colours.textMuted}
            maxLength={100}
            accessibilityLabel="Province or city"
          />
          {errors.province !== undefined && (
            <Text style={styles.errorText}>{errors.province}</Text>
          )}

          {/* Default toggle */}
          <Pressable
            style={styles.defaultRow}
            onPress={() => setField('isDefault', !values.isDefault)}
            accessibilityRole="checkbox"
            accessibilityLabel="Set as default address"
            accessibilityState={{ checked: values.isDefault }}
          >
            <View style={[styles.checkbox, values.isDefault && styles.checkboxActive]}>
              {values.isDefault && <Ionicons name="checkmark" size={14} color={colours.white} />}
            </View>
            <Text style={styles.defaultLabel}>Set as default address</Text>
          </Pressable>

          {/* Save */}
          <Pressable
            style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={isSaving}
            accessibilityRole="button"
            accessibilityLabel={isEdit ? 'Update address' : 'Save address'}
          >
            <Text style={styles.saveBtnText}>{isSaving ? 'Saving…' : 'Save Address'}</Text>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
