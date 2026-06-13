import React from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useKycPendingScreen } from '../hooks/useKycPendingScreen';
import { styles } from './KycPendingScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { KYC_STATUS } from '../../../types/enums';
import { formatDateTime } from '../../../shared/utils/formatDate';
import { useTranslation } from '../../../shared/hooks/useTranslation';

export function KycPendingScreen(): React.JSX.Element {
  const {
    application,
    isLoading,
    error,
    handleLogout,
    handleResubmit,
    handleContactSupport,
  } = useKycPendingScreen();

  const t = useTranslation();
  const isRejected = application?.status === KYC_STATUS.Rejected;
  const isPending =
    application?.status === KYC_STATUS.Submitted ||
    application?.status === KYC_STATUS.UnderReview;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {isLoading && <ActivityIndicator color={colours.primary} style={styles.loader} />}
        {error !== null && <Text style={styles.errorBanner}>{error}</Text>}

        {application !== null && (
          <>
            <Text style={styles.title}>{t('kyc_pending_title')}</Text>

            <View style={[styles.badge, getBadgeStyle(application.status)]}>
              <Text style={[styles.badgeText, getBadgeTextStyle(application.status)]}>
                {application.status_label}
              </Text>
            </View>

            <Text style={styles.businessName}>{application.business_name}</Text>

            {application.submitted_at !== null && (
              <Text style={styles.meta}>
                {t('kyc_pending_submitted')} {formatDateTime(application.submitted_at)}
              </Text>
            )}

            {isPending && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>{t('kyc_pending_review_note')}</Text>
              </View>
            )}

            {isRejected && (
              <>
                {application.review_notes !== null && (
                  <View style={styles.rejectedBox}>
                    <Text style={styles.rejectedTitle}>{t('kyc_pending_rejection_title')}</Text>
                    <Text style={styles.rejectedNotes}>{application.review_notes}</Text>
                  </View>
                )}

                <Text style={styles.rejectedHelp}>{t('kyc_pending_rejection_help')}</Text>

                <Pressable
                  style={styles.resubmitButton}
                  onPress={handleResubmit}
                  accessibilityLabel="Resubmit KYC application"
                  accessibilityRole="button"
                >
                  <Text style={styles.resubmitButtonText}>{t('kyc_pending_resubmit')}</Text>
                </Pressable>

                <Pressable
                  style={styles.contactButton}
                  onPress={handleContactSupport}
                  accessibilityLabel="Contact support via email"
                  accessibilityRole="button"
                >
                  <Text style={styles.contactButtonText}>{t('kyc_pending_contact_support')}</Text>
                </Pressable>
              </>
            )}
          </>
        )}

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityLabel="Log out of merchant account"
          accessibilityRole="button"
        >
          <Text style={styles.logoutText}>{t('kyc_log_out')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function getBadgeStyle(status: string): object {
  const map: Record<string, object> = {
    [KYC_STATUS.Submitted]:   { backgroundColor: colours.warning + '22' },
    [KYC_STATUS.UnderReview]: { backgroundColor: colours.warning + '22' },
    [KYC_STATUS.Approved]:    { backgroundColor: colours.success + '22' },
    [KYC_STATUS.Rejected]:    { backgroundColor: colours.error + '22' },
    [KYC_STATUS.Draft]:       { backgroundColor: colours.medium + '22' },
  };
  return map[status] ?? {};
}

function getBadgeTextStyle(status: string): object {
  const map: Record<string, object> = {
    [KYC_STATUS.Submitted]:   { color: colours.warning },
    [KYC_STATUS.UnderReview]: { color: colours.warning },
    [KYC_STATUS.Approved]:    { color: colours.success },
    [KYC_STATUS.Rejected]:    { color: colours.error },
    [KYC_STATUS.Draft]:       { color: colours.medium },
  };
  return map[status] ?? {};
}
