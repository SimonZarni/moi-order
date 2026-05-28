import React from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useKycPendingScreen } from '../hooks/useKycPendingScreen';
import { styles } from './KycPendingScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { KYC_STATUS } from '../../../types/enums';
import { formatDateTime } from '../../../shared/utils/formatDate';

export function KycPendingScreen(): React.JSX.Element {
  const {
    application,
    isLoading,
    error,
    handleLogout,
    handleResubmit,
    handleContactSupport,
  } = useKycPendingScreen();

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
            <Text style={styles.title}>Application Status</Text>

            <View style={[styles.badge, getBadgeStyle(application.status)]}>
              <Text style={[styles.badgeText, getBadgeTextStyle(application.status)]}>
                {application.status_label}
              </Text>
            </View>

            <Text style={styles.businessName}>{application.business_name}</Text>

            {application.submitted_at !== null && (
              <Text style={styles.meta}>
                Submitted: {formatDateTime(application.submitted_at)}
              </Text>
            )}

            {isPending && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Your application is under review. Our team will get back to you within 1–2 business days.
                </Text>
              </View>
            )}

            {isRejected && (
              <>
                {application.review_notes !== null && (
                  <View style={styles.rejectedBox}>
                    <Text style={styles.rejectedTitle}>Reason for rejection:</Text>
                    <Text style={styles.rejectedNotes}>{application.review_notes}</Text>
                  </View>
                )}

                <Text style={styles.rejectedHelp}>
                  You can correct the issues and resubmit, or contact our support team for assistance.
                </Text>

                <Pressable
                  style={styles.resubmitButton}
                  onPress={handleResubmit}
                  accessibilityLabel="Resubmit KYC application"
                  accessibilityRole="button"
                >
                  <Text style={styles.resubmitButtonText}>Resubmit Application</Text>
                </Pressable>

                <Pressable
                  style={styles.contactButton}
                  onPress={handleContactSupport}
                  accessibilityLabel="Contact support via email"
                  accessibilityRole="button"
                >
                  <Text style={styles.contactButtonText}>Contact Support</Text>
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
          <Text style={styles.logoutText}>Log Out</Text>
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
