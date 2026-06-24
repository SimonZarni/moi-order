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
  onEditSessionMenu: (openingHourId: number, label: string) => void;
}

const DAY_KEYS = [
  'hours_day_sun', 'hours_day_mon', 'hours_day_tue', 'hours_day_wed',
  'hours_day_thu', 'hours_day_fri', 'hours_day_sat',
] as const;

const MAX_SESSIONS = 4;

export function OperatingHoursScreen({ onBack, onEditSessionMenu }: OperatingHoursScreenProps): React.JSX.Element {
  const {
    isLoading, isSaving, hoursInput, error, getSessionHour,
    handleToggleClosed, handleSessionChange, handleAddSession, handleRemoveSession,
    handleToggleSessionMenu, handleSave, handleClearError,
  } = useOperatingHoursScreen();
  const t = useTranslation();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.centered}>
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

        {hoursInput.map((day) => (
          <View key={day.day_of_week} style={styles.dayCard}>
            {/* Day header row */}
            <View style={styles.dayHeader}>
              <Text style={styles.dayName}>{t(DAY_KEYS[day.day_of_week])}</Text>
              <View style={styles.dayHeaderRight}>
                {day.is_closed
                  ? <Text style={styles.closedBadge}>{t('hours_closed')}</Text>
                  : null
                }
                <Switch
                  value={!day.is_closed}
                  onValueChange={(v) => handleToggleClosed(day.day_of_week, !v)}
                  trackColor={{ false: colours.surfaceMuted, true: colours.primary + '66' }}
                  thumbColor={!day.is_closed ? colours.primary : colours.medium}
                  accessibilityLabel={`Toggle open for ${t(DAY_KEYS[day.day_of_week])}`}
                />
              </View>
            </View>

            {!day.is_closed && (
              <View style={styles.sessionsContainer}>
                {day.sessions.map((session, index) => (
                  <View key={index} style={styles.sessionRow}>
                    <View style={styles.sessionLabel}>
                      <Text style={styles.sessionLabelText}>
                        {t('hours_session')} {index + 1}
                      </Text>
                    </View>
                    <View style={styles.sessionInputs}>
                      <TextInput
                        style={styles.timeInput}
                        value={session.opens_at}
                        onChangeText={(v) => handleSessionChange(day.day_of_week, index, 'opens_at', v)}
                        placeholder="09:00"
                        placeholderTextColor={colours.textSubtle}
                        accessibilityLabel={`Session ${index + 1} open time for ${t(DAY_KEYS[day.day_of_week])}`}
                      />
                      <Text style={styles.timeSep}>→</Text>
                      <TextInput
                        style={styles.timeInput}
                        value={session.closes_at}
                        onChangeText={(v) => handleSessionChange(day.day_of_week, index, 'closes_at', v)}
                        placeholder="22:00"
                        placeholderTextColor={colours.textSubtle}
                        accessibilityLabel={`Session ${index + 1} close time for ${t(DAY_KEYS[day.day_of_week])}`}
                      />
                      {index > 0 && (
                        <Pressable
                          style={styles.removeBtn}
                          onPress={() => handleRemoveSession(day.day_of_week, index)}
                          accessibilityRole="button"
                          accessibilityLabel={`Remove session ${index + 1}`}
                        >
                          <Ionicons name="remove-circle-outline" size={20} color={colours.error} />
                        </Pressable>
                      )}
                    </View>
                    {(() => {
                      const serverSession = getSessionHour(day.day_of_week, index);
                      const label = `${session.opens_at}–${session.closes_at} ${t(DAY_KEYS[day.day_of_week])}`;
                      const hasItems = (serverSession?.session_menu_items_count ?? 0) > 0;
                      const toggleOn = hasItems && (serverSession?.session_menu_enabled ?? false);

                      return (
                        <View style={styles.sessionMenuRow}>
                          {/* On/Off toggle — only interactive when saved + has items */}
                          <View style={styles.sessionMenuToggleRow}>
                            <Ionicons
                              name="restaurant-outline"
                              size={14}
                              color={serverSession && hasItems ? colours.primary : colours.textSubtle}
                            />
                            <Text style={[styles.sessionMenuToggleLabel, !serverSession && styles.sessionMenuToggleLabelDisabled]}>
                              Session Menu
                            </Text>
                            <Switch
                              value={toggleOn}
                              onValueChange={(v) => { if (serverSession && hasItems) handleToggleSessionMenu(serverSession.id, v); }}
                              disabled={!serverSession || !hasItems}
                              trackColor={{ false: colours.surfaceMuted, true: colours.primary + '66' }}
                              thumbColor={toggleOn ? colours.primary : colours.medium}
                              accessibilityLabel={`Session menu on/off for ${label}`}
                            />
                          </View>

                          {/* Contextual hint */}
                          {!serverSession && (
                            <Text style={styles.sessionMenuToggleDisabledHint}>
                              Save operating hours first to manage this session's menu
                            </Text>
                          )}
                          {serverSession && !hasItems && (
                            <Text style={styles.sessionMenuToggleDisabledHint}>
                              Add menu items to this session to enable
                            </Text>
                          )}
                          {serverSession && hasItems && !toggleOn && (
                            <Text style={styles.sessionMenuToggleDisabledHint}>
                              Off — customers see the default menu during this slot
                            </Text>
                          )}

                          {/* Edit session menu button */}
                          <Pressable
                            style={[styles.editMenuBtn, !serverSession && styles.editMenuBtnDisabled]}
                            onPress={() => serverSession && onEditSessionMenu(serverSession.id, label)}
                            disabled={!serverSession}
                            accessibilityRole="button"
                            accessibilityLabel={serverSession ? `Edit session menu for ${label}` : 'Save hours first'}
                          >
                            <Ionicons
                              name="pencil-outline"
                              size={14}
                              color={serverSession ? colours.primary : colours.textSubtle}
                            />
                            <Text style={[styles.editMenuBtnText, !serverSession && styles.editMenuBtnTextDisabled]}>
                              {t('hours_edit_session_menu')}
                            </Text>
                            {serverSession && serverSession.session_menu_categories_count > 0 && (
                              <Text style={styles.editMenuCount}>
                                ({serverSession.session_menu_categories_count} {t('hours_session_menu_count')})
                              </Text>
                            )}
                          </Pressable>
                        </View>
                      );
                    })()}
                  </View>
                ))}

                {day.sessions.length < MAX_SESSIONS && (
                  <Pressable
                    style={styles.addSessionBtn}
                    onPress={() => handleAddSession(day.day_of_week)}
                    accessibilityRole="button"
                    accessibilityLabel={`Add session for ${t(DAY_KEYS[day.day_of_week])}`}
                  >
                    <Ionicons name="add-circle-outline" size={16} color={colours.primary} />
                    <Text style={styles.addSessionText}>{t('hours_add_session')}</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        ))}

        {error !== null && (
          <Pressable style={styles.errorBanner} onPress={handleClearError} accessibilityRole="button" accessibilityLabel="Dismiss error">
            <Text style={styles.errorText}>{error}</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={isSaving}
          accessibilityRole="button"
          accessibilityLabel="Save operating hours"
        >
          <Text style={styles.saveBtnText}>{isSaving ? t('common_saving') : t('common_save')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
