import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsScreen } from '../hooks/useSettingsScreen';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import { styles } from './SettingsScreen.styles';
import { colours } from '../../../shared/theme/colours';
import type { Language, Theme, MenuView } from '../../../store/settingsStore';

interface SettingsScreenProps {
  onChangePassword: () => void;
  onOperatingHours: () => void;
}

export function SettingsScreen({ onChangePassword, onOperatingHours }: SettingsScreenProps): React.JSX.Element {
  const { language, theme, menuView, hasPassword, handleSetLanguage, handleSetTheme, handleSetMenuView } = useSettingsScreen();
  const t = useTranslation();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>{t('settings_title')}</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>{t('settings_preferences')}</Text>
        <View style={styles.card}>
          <SegmentRow label={t('settings_language')} options={[
            { value: 'en' as Language, label: t('settings_language_en') },
            { value: 'my' as Language, label: t('settings_language_my') },
          ]} value={language} onChange={handleSetLanguage} />
          {/* Theme toggle — hidden for now, feature code intact
          <View style={styles.divider} />
          <SegmentRow label={t('settings_theme')} options={[
            { value: 'light' as Theme, label: t('settings_theme_light') },
            { value: 'dark' as Theme, label: t('settings_theme_dark') },
          ]} value={theme} onChange={handleSetTheme} />
          */}
          {/* Menu view toggle — hidden for now, feature code intact
          <View style={styles.divider} />
          <SegmentRow label={t('settings_menu_view')} options={[
            { value: 'list' as MenuView, label: t('settings_menu_view_list') },
            { value: 'grid' as MenuView, label: t('settings_menu_view_grid') },
          ]} value={menuView} onChange={handleSetMenuView} />
          */}
        </View>

        {hasPassword && (
          <>
            <Text style={styles.sectionHeader}>{t('settings_account')}</Text>
            <View style={styles.card}>
              <NavRow label={t('settings_change_password')} onPress={onChangePassword} />
            </View>
          </>
        )}

        <Text style={styles.sectionHeader}>{t('settings_restaurant')}</Text>
        <View style={styles.card}>
          <NavRow label={t('settings_operating_hours')} onPress={onOperatingHours} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface SegmentOption<T> { value: T; label: string; }
interface SegmentRowProps<T> { label: string; options: SegmentOption<T>[]; value: T; onChange: (v: T) => void; }

function SegmentRow<T extends string>({ label, options, value, onChange }: SegmentRowProps<T>): React.JSX.Element {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <Pressable key={opt.value} style={[styles.chip, active && styles.chipActive]}
              onPress={() => onChange(opt.value)} accessibilityRole="button" accessibilityLabel={opt.label}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

interface NavRowProps { label: string; onPress: () => void; }

function NavRow({ label, onPress }: NavRowProps): React.JSX.Element {
  return (
    <Pressable style={({ pressed }) => [styles.navRow, pressed && { opacity: 0.7 }]}
      onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      <Text style={styles.navRowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={colours.textSubtle} />
    </Pressable>
  );
}
