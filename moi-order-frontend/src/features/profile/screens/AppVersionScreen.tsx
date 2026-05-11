import React from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppVersionScreen } from '@/features/profile/hooks/useAppVersionScreen';
import type { UpdateStatus } from '@/features/profile/hooks/useAppVersionScreen';
import { colours } from '@/shared/theme/colours';
import { styles } from './AppVersionScreen.styles';

interface StatusBadgeProps {
  status: UpdateStatus;
}

function StatusBadge({ status }: StatusBadgeProps): React.JSX.Element {
  const config = {
    up_to_date:       { icon: 'checkmark-circle' as const, label: 'Up to date',      bg: `${colours.success}18`, color: colours.success },
    update_available: { icon: 'arrow-up-circle' as const,  label: 'Update available', bg: `${colours.warning}18`, color: colours.warning },
    update_required:  { icon: 'alert-circle' as const,     label: 'Update required',  bg: '#ff4d4f18',            color: '#ff4d4f' },
    unknown:          { icon: 'help-circle' as const,      label: 'Unknown',          bg: `${colours.divider}`,   color: colours.textMuted },
  }[status];

  return (
    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
      <Ionicons name={config.icon} size={14} color={config.color} />
      <Text style={[styles.statusBadgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

export function AppVersionScreen(): React.JSX.Element {
  const {
    currentVersion,
    updateConfig,
    isLoading,
    updateStatus,
    storeUrl,
    handleOpenStore,
    handleBack,
  } = useAppVersionScreen();

  const platformLabel = Platform.OS === 'ios' ? 'App Store' : 'Google Play';
  const storeIcon     = Platform.OS === 'ios' ? 'logo-apple' : 'logo-google-playstore';
  const hasChangelog  = (updateConfig?.changelog?.length ?? 0) > 0;
  const nextVersion   = updateConfig?.next_version ?? null;
  const hasWhatsNew   = nextVersion !== null || hasChangelog;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={handleBack}
          accessibilityLabel="Back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={20} color={colours.textOnDark} />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>App Version</Text>
          <Text style={styles.headerSubtitle}>Moi Order</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Current version ───────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Current Version</Text>
        <View style={styles.card}>
          {isLoading ? (
            <ActivityIndicator color={colours.primary} style={{ paddingVertical: 16 }} />
          ) : (
            <View style={styles.versionHero}>
              <Text style={styles.versionNumber}>{currentVersion}</Text>
              <Text style={styles.versionLabel}>Installed on your device</Text>
              <StatusBadge status={updateStatus} />
            </View>
          )}
        </View>

        {/* ── Store button (always shown if URL exists) ─────────────────── */}
        {storeUrl !== null && (
          <>
            <Text style={styles.sectionLabel}>Get Updates</Text>
            <View style={styles.card}>
              <Pressable
                style={updateStatus === 'update_required' ? styles.btnPrimary : styles.btnOutlined}
                onPress={handleOpenStore}
                accessibilityLabel={`Open ${platformLabel}`}
                accessibilityRole="button"
              >
                <Ionicons
                  name={storeIcon as 'logo-apple'}
                  size={18}
                  color={updateStatus === 'update_required' ? colours.textOnDark : colours.primary}
                />
                <Text style={updateStatus === 'update_required' ? styles.btnPrimaryText : styles.btnOutlinedText}>
                  {updateStatus === 'up_to_date' ? `Open on ${platformLabel}` : `Update on ${platformLabel}`}
                </Text>
              </Pressable>
            </View>
          </>
        )}

        {/* ── What's coming ─────────────────────────────────────────────── */}
        {hasWhatsNew && (
          <>
            <Text style={styles.sectionLabel}>{"What's New"}</Text>
            <View style={styles.card}>
              {nextVersion !== null && (
                <Text style={styles.comingVersion}>Coming in v{nextVersion}</Text>
              )}
              {hasChangelog ? (
                updateConfig!.changelog.map((feature, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <View style={styles.changelogDivider} />}
                    <View style={styles.changelogRow}>
                      <View style={styles.changelogDot} />
                      <Text style={styles.changelogText}>{feature}</Text>
                    </View>
                  </React.Fragment>
                ))
              ) : (
                <Text style={styles.emptyText}>Details coming soon.</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
