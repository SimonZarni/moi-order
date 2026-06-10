import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBecomeMerchantScreen, UseBecomeMerchantScreenResult } from '@/features/merchant-application/hooks/useBecomeMerchantScreen';
import { useStrings, AppStrings } from '@/shared/i18n';
import { colours } from '@/shared/theme/colours';
import { KYC_APPLICATION_STATUS } from '@/types/enums';
import { styles } from './BecomeMerchantScreen.styles';

interface CardProps extends UseBecomeMerchantScreenResult {
  s: AppStrings;
}

function IntroCard({ s, applyError, isApplying, handleApply }: CardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{s.merchant.introTitle}</Text>
      <Text style={styles.cardBody}>{s.merchant.introBody}</Text>

      <View style={{ marginTop: 12 }}>
        <View style={styles.benefitRow}>
          <Ionicons name="people-outline" size={20} color={colours.primary} />
          <Text style={styles.benefitText}>{s.merchant.benefitReach}</Text>
        </View>
        <View style={styles.benefitRow}>
          <Ionicons name="grid-outline" size={20} color={colours.primary} />
          <Text style={styles.benefitText}>{s.merchant.benefitDashboard}</Text>
        </View>
        <View style={styles.benefitRow}>
          <Ionicons name="cash-outline" size={20} color={colours.primary} />
          <Text style={styles.benefitText}>{s.merchant.benefitPayouts}</Text>
        </View>
      </View>

      {applyError !== null && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{applyError}</Text>
        </View>
      )}

      <Pressable
        style={[styles.primaryBtn, isApplying && styles.btnDisabled]}
        onPress={handleApply}
        disabled={isApplying}
        accessibilityLabel={s.merchant.applyButton}
        accessibilityRole="button"
      >
        {isApplying
          ? <ActivityIndicator color={colours.white} />
          : <Text style={styles.primaryBtnText}>{s.merchant.applyButton}</Text>}
      </Pressable>
    </View>
  );
}

function DraftCard({ s, application, cancelError, isCancelling, hasDownloadLink, handleCancel, handleDownloadApp }: CardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.statusBadge}>
        <Text style={styles.statusBadgeText}>{application?.status_label}</Text>
      </View>
      <Text style={styles.cardTitle}>{s.merchant.draftTitle}</Text>
      <Text style={styles.cardBody}>{s.merchant.draftBody}</Text>

      {hasDownloadLink && (
        <Pressable style={styles.secondaryBtn} onPress={handleDownloadApp} accessibilityLabel={s.merchant.downloadApp} accessibilityRole="button">
          <Text style={styles.secondaryBtnText}>{s.merchant.downloadApp}</Text>
        </Pressable>
      )}

      {cancelError !== null && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{cancelError}</Text>
        </View>
      )}

      <Pressable
        style={[styles.destructiveBtn, isCancelling && styles.btnDisabled]}
        onPress={handleCancel}
        disabled={isCancelling}
        accessibilityLabel={s.merchant.cancelButton}
        accessibilityRole="button"
      >
        {isCancelling
          ? <ActivityIndicator color={colours.destructive} />
          : <Text style={styles.destructiveBtnText}>{s.merchant.cancelButton}</Text>}
      </Pressable>
    </View>
  );
}

function UnderReviewCard({ s, application }: CardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.statusBadge}>
        <Text style={styles.statusBadgeText}>{application?.status_label}</Text>
      </View>
      <Text style={styles.cardTitle}>{s.merchant.underReviewTitle}</Text>
      <Text style={styles.cardBody}>{s.merchant.underReviewBody}</Text>
    </View>
  );
}

function ApprovedCard({ s, application, hasDownloadLink, handleDownloadApp }: CardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.statusBadge}>
        <Text style={styles.statusBadgeText}>{application?.status_label}</Text>
      </View>
      <Text style={styles.cardTitle}>{s.merchant.approvedTitle}</Text>
      <Text style={styles.cardBody}>{s.merchant.approvedBody}</Text>

      {hasDownloadLink && (
        <Pressable style={styles.primaryBtn} onPress={handleDownloadApp} accessibilityLabel={s.merchant.openAppButton} accessibilityRole="button">
          <Text style={styles.primaryBtnText}>{s.merchant.openAppButton}</Text>
        </Pressable>
      )}
    </View>
  );
}

function RejectedCard({ s, application, applyError, isApplying, handleApply }: CardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.statusBadge}>
        <Text style={styles.statusBadgeText}>{application?.status_label}</Text>
      </View>
      <Text style={styles.cardTitle}>{s.merchant.rejectedTitle}</Text>
      <Text style={styles.cardBody}>{s.merchant.rejectedBody}</Text>

      {application?.review_notes !== null && application?.review_notes !== undefined && (
        <>
          <Text style={styles.notesLabel}>{s.merchant.reviewNotes}</Text>
          <Text style={styles.notesBody}>{application.review_notes}</Text>
        </>
      )}

      {applyError !== null && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{applyError}</Text>
        </View>
      )}

      <Pressable
        style={[styles.primaryBtn, isApplying && styles.btnDisabled]}
        onPress={handleApply}
        disabled={isApplying}
        accessibilityLabel={s.merchant.applyAgainButton}
        accessibilityRole="button"
      >
        {isApplying
          ? <ActivityIndicator color={colours.white} />
          : <Text style={styles.primaryBtnText}>{s.merchant.applyAgainButton}</Text>}
      </Pressable>
    </View>
  );
}

function ApplicationCard(props: CardProps): React.JSX.Element {
  const { application } = props;

  if (application === null || application === undefined) return <IntroCard {...props} />;
  if (application.status === KYC_APPLICATION_STATUS.Draft) return <DraftCard {...props} />;
  if (application.status === KYC_APPLICATION_STATUS.Approved) return <ApprovedCard {...props} />;
  if (application.status === KYC_APPLICATION_STATUS.Rejected) return <RejectedCard {...props} />;
  return <UnderReviewCard {...props} />;
}

export function BecomeMerchantScreen(): React.JSX.Element {
  const result = useBecomeMerchantScreen();
  const s = useStrings();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={result.handleBack} accessibilityLabel={s.common.back} accessibilityRole="button">
          <Ionicons name="arrow-back" size={20} color={colours.textOnDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{s.merchant.title}</Text>
          <Text style={styles.headerSubtitle}>{s.merchant.subtitle}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {result.isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colours.primary} />
          </View>
        ) : (
          <ApplicationCard {...result} s={s} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
