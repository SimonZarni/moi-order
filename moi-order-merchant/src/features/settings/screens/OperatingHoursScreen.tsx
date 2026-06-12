import React from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Switch, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOperatingHoursScreen } from '../hooks/useOperatingHoursScreen';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import { styles } from './OperatingHoursScreen.styles';
import { colours } from '../../../shared/theme/colours';

interface OperatingHoursScreenProps {
  onBack: () => void;
}

const DAY_KEYS = [
  'hours_day_sun', 'hours_day_mon', 'hours_day_tue', 'hours_day_wed',
  'hours_day_thu', 'hours_day_fri', 'hours_day_sat',
] as const;

export function OperatingHoursScreen({ onBack }: OperatingHoursScreenProps): React.JSX.Element {
  const { isLoading, isSaving, hoursInput, error, handleHourChange, handleHourToggle, handleSave, handleClearError } = useOperatingHoursScreen();
  const t = useTranslation();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colours.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Pressable style={styles.backBtn} onPress={onBack} accessibilityRole="button" accessibilityLabel="Back to settings">
          <Ionicons name="chevron-back" size={16} color={colours.primary} />
          <Text style={styles.backBtnText}>{t('common_back_to_settings')}</Text>
        </Pressable>

        <Text style={styles.title}>{t('hours_title')}</Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.colDay]}>{''}</Text>
          <Text style={[styles.headerCell, styles.colTime, { textAlign: 'center' }]}>{t('hours_opens')}</Text>
          <Text style={[styles.headerCell, styles.colTime, { textAlign: 'center' }]}>{t('hours_closes')}</Text>
          <Text style={[styles.headerCell, styles.colToggle]}>{t('hours_open')}</Text>
        </View>

        {hoursInput.map((h) => (
          <View key={h.day_of_week} style={styles.row}>
            <Text style={styles.dayLabel}>{t(DAY_KEYS[h.day_of_week])}</Text>
            {h.is_closed ? (
              <Text style={styles.closedLabel}>{t('hours_closed')}</Text>
            ) : (
              <>
                <TextInput
                  style={styles.timeInput}
                  value={h.opens_at ?? ''}
                  onChangeText={(v) => handleHourChange(h.day_of_week, 'opens_at', v)}
                  placeholder="09:00"
                  placeholderTextColor={colours.textSubtle}
                  accessibilityLabel={`Opening time for day ${h.day_of_week}`}
                />
                <TextInput
                  style={styles.timeInput}
                  value={h.closes_at ?? ''}
                  onChangeText={(v) => handleHourChange(h.day_of_week, 'closes_at', v)}
                  placeholder="22:00"
                  placeholderTextColor={colours.textSubtle}
                  accessibilityLabel={`Closing time for day ${h.day_of_week}`}
                />
              </>
            )}
            <View style={styles.toggleCell}>
              <Switch
                value={!h.is_closed}
                onValueChange={(v) => handleHourToggle(h.day_of_week, !v)}
                trackColor={{ false: colours.surfaceMuted, true: colours.primary + '66' }}
                thumbColor={!h.is_closed ? colours.primary : colours.medium}
                accessibilityLabel={`Toggle open for day ${h.day_of_week}`}
              />
            </View>
          </View>
        ))}

        {error !== null && (
          <Pressable style={styles.errorBanner} onPress={handleClearError} accessibilityRole="button" accessibilityLabel="Dismiss error">
            <Text style={styles.errorText}>{error}</Text>
          </Pressable>
        )}

        <Pressable style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
          onPress={handleSave} disabled={isSaving} accessibilityRole="button" accessibilityLabel="Save operating hours">
          <Text style={styles.saveBtnText}>{isSaving ? t('common_saving') : t('common_save')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
