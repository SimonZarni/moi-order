import React from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useKycPendingScreen } from '../hooks/useKycPendingScreen';
import { styles } from './KycPendingScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { KYC_STATUS } from '../../../types/enums';
import { formatDateTime } from '../../../shared/utils/formatDate';

export function KycPendingScreen(): React.JSX.Element {
  const { application, isLoading, error, handleLogout } = useKycPendingScreen();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {isLoading && <ActivityIndicator color={colours.primary} style={styles.loader} />}
        {error !== null && <Text style={styles.errorBanner}>{error}</Text>}

        {application !== null && (
          <>
            <Text style={styles.title}>Application Status</Text>
            <View style={[styles.badge, getBadgeStyle(application.status)]}>
              <Text style={styles.badgeText}>{application.status_label}</Text>
            </View>

            <Text style={styles.businessName}>{application.business_name}</Text>

            {application.submitted_at !== null && (
              <Text style={styles.meta}>
                Submitted: {formatDateTime(application.submitted_at)}
              </Text>
            )}

            {application.status === KYC_STATUS.UnderReview && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Your application is under review. Estimated timeline: 1–2 business days.
                </Text>
              </View>
            )}

            {application.status === KYC_STATUS.Rejected && application.review_notes !== null && (
              <View style={styles.rejectedBox}>
                <Text style={styles.rejectedTitle}>Review Notes:</Text>
                <Text style={styles.rejectedNotes}>{application.review_notes}</Text>
              </View>
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
    [KYC_STATUS.Submitted]: { backgroundColor: colours.warning + '22' },
    [KYC_STATUS.UnderReview]: { backgroundColor: colours.warning + '22' },
    [KYC_STATUS.Approved]: { backgroundColor: colours.success + '22' },
    [KYC_STATUS.Rejected]: { backgroundColor: colours.error + '22' },
    [KYC_STATUS.Draft]: { backgroundColor: colours.medium + '22' },
  };
  return map[status] ?? {};
}
