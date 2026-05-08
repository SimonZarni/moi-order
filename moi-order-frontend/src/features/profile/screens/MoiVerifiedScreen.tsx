import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMoiVerifiedScreen } from '@/features/profile/hooks/useMoiVerifiedScreen';
import { VerifiedBadgeIcon } from '@/shared/components/VerifiedBadgeIcon';
import { useStrings } from '@/shared/i18n';
import { colours } from '@/shared/theme/colours';
import { styles } from './MoiVerifiedScreen.styles';

interface RequirementRowProps {
  label: string;
  done: boolean;
}

function RequirementRow({ label, done }: RequirementRowProps): React.JSX.Element {
  return (
    <View style={styles.reqRow}>
      <Text style={styles.reqLabel}>{label}</Text>
      <Ionicons
        name={done ? 'checkmark-circle' : 'ellipse-outline'}
        size={20}
        color={done ? colours.success : colours.textMuted}
      />
    </View>
  );
}

export function MoiVerifiedScreen(): React.JSX.Element {
  const { status, isLoading, handleBack } = useMoiVerifiedScreen();
  const s = useStrings();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityLabel={s.common.back} accessibilityRole="button">
          <Ionicons name="arrow-back" size={20} color={colours.textOnDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{s.verified.title}</Text>
          <Text style={styles.headerSubtitle}>{s.verified.subtitle}</Text>
        </View>
        <VerifiedBadgeIcon size={34} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {status?.is_verified && (
          <View style={styles.verifiedBanner}>
            <Ionicons name="checkmark-circle" size={22} color={colours.success} />
            <Text style={styles.verifiedBannerText}>{s.verified.youAreVerified}</Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>{s.verified.whyVerify}</Text>
        <View style={styles.card}>
          <View style={styles.advantageRow}>
            <Ionicons name="headset-outline" size={20} color={colours.primary} />
            <Text style={styles.advantageText}>{s.verified.prioritySupport}</Text>
          </View>
          <View style={styles.advantageRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colours.primary} />
            <Text style={styles.advantageText}>{s.verified.verifiedBadge}</Text>
          </View>
          <View style={styles.advantageRow}>
            <Ionicons name="flash-outline" size={20} color={colours.primary} />
            <Text style={styles.advantageText}>{s.verified.fasterProcessing}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>{s.verified.requirements}</Text>
        <View style={styles.card}>
          {isLoading ? (
            <ActivityIndicator color={colours.primary} style={{ paddingVertical: 16 }} />
          ) : (
            <>
              <RequirementRow
                label={`${s.verified.channels} (${status?.connected_channels ?? 0}/2)`}
                done={(status?.connected_channels ?? 0) >= 2}
              />
              <View style={styles.reqDivider} />
              <RequirementRow
                label={`${s.verified.payments} (${status?.successful_payments ?? 0}/3)`}
                done={(status?.successful_payments ?? 0) >= 3}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
