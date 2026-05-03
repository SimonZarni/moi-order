import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMoiVerifiedScreen } from '@/features/profile/hooks/useMoiVerifiedScreen';
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

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name="arrow-back" size={20} color={colours.textOnDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Become Moi Verified</Text>
          <Text style={styles.headerSubtitle}>Unlock your full account potential</Text>
        </View>
        <Text style={styles.headerEmoji}>😊</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {status?.is_verified && (
          <View style={styles.verifiedBanner}>
            <Ionicons name="checkmark-circle" size={22} color={colours.success} />
            <Text style={styles.verifiedBannerText}>You are Moi Verified!</Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>Why get verified?</Text>
        <View style={styles.card}>
          <View style={styles.advantageRow}>
            <Ionicons name="headset-outline" size={20} color={colours.primary} />
            <Text style={styles.advantageText}>Priority support from our customer team</Text>
          </View>
          <View style={styles.advantageRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colours.primary} />
            <Text style={styles.advantageText}>Verified badge displayed on your profile</Text>
          </View>
          <View style={styles.advantageRow}>
            <Ionicons name="flash-outline" size={20} color={colours.primary} />
            <Text style={styles.advantageText}>Faster processing for all service submissions</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Requirements</Text>
        <View style={styles.card}>
          {isLoading ? (
            <ActivityIndicator color={colours.primary} style={{ paddingVertical: 16 }} />
          ) : (
            <>
              <RequirementRow
                label="Connected to at least one sign-in channel"
                done={status?.connected_channel ?? false}
              />
              <View style={styles.reqDivider} />
              <RequirementRow
                label="Uploaded a Passport document"
                done={status?.passport_uploaded ?? false}
              />
              <View style={styles.reqDivider} />
              <RequirementRow
                label="Uploaded a 90-Day Report slip"
                done={status?.ninety_day_uploaded ?? false}
              />
              <View style={styles.reqDivider} />
              <RequirementRow
                label="Uploaded a document in My Docs"
                done={status?.my_docs_uploaded ?? false}
              />
              <View style={styles.reqDivider} />
              <RequirementRow
                label="Completed at least one order or payment"
                done={status?.successful_payment ?? false}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
