import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBusinessProfileScreen } from '../hooks/useBusinessProfileScreen';
import { BusinessInfoSection } from '../components/BusinessInfoSection';
import { KycDocumentCard } from '../components/KycDocumentCard';
import { RestaurantInfoCard } from '../components/RestaurantInfoCard';
import { EmailVerificationScreen } from './EmailVerificationScreen';
import { styles } from './BusinessProfileScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { KYC_DOC_TYPE } from '../../../types/enums';
import { useAuthStore } from '../../../store/authStore';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { KycDocType } from '../../../types/enums';

interface BusinessProfileScreenProps {
  onBack?: () => void;
}

export function BusinessProfileScreen({ onBack }: BusinessProfileScreenProps): React.JSX.Element {
  const {
    profile, isLoading, isError,
    isEditingPhone, phoneValue, phoneError, isSavingPhone,
    handleStartEditPhone, handleCancelEditPhone, handleChangePhone, handleSavePhone,
    isEditingEmail, emailValue, emailError, isSavingEmail,
    handleStartEditEmail, handleCancelEditEmail, handleChangeEmail, handleSaveEmail,
    handleUploadDocument, uploadingDocType, docUploadError,
    handleBack,
  } = useBusinessProfileScreen();

  const t = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [showVerify, setShowVerify] = useState(false);

  const DOC_TYPES: Array<{ type: KycDocType; label: string }> = [
    { type: KYC_DOC_TYPE.NationalId,           label: t('kyc_doc_national_id') },
    { type: KYC_DOC_TYPE.BusinessRegistration, label: t('kyc_doc_business_reg') },
    { type: KYC_DOC_TYPE.BankBook,             label: t('kyc_doc_bank_book') },
    { type: KYC_DOC_TYPE.StorefrontPhoto,      label: t('kyc_doc_storefront') },
  ];

  const goBack = onBack ?? handleBack;
  const showBackBtn = Platform.OS !== 'web';
  const emailUnverified = user !== null && !!user.email && !user.email_verified;

  if (showVerify && user !== null && user.email !== null) {
    return (
      <EmailVerificationScreen
        email={user.email}
        onBack={() => setShowVerify(false)}
        onDone={() => setShowVerify(false)}
      />
    );
  }

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colours.primary} /></View>;
  }

  if (isError || profile === null) {
    return <View style={styles.centered}><Text style={styles.errorText}>{t('biz_failed_load')}</Text></View>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {showBackBtn && (
        <View style={styles.header}>
          <Pressable onPress={goBack} style={styles.backBtn} accessibilityLabel="Go back" accessibilityRole="button">
            <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
          </Pressable>
          <Text style={styles.headerTitle}>{t('biz_title')}</Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Unverified email banner */}
        {emailUnverified && (
          <Pressable
            style={styles.unverifiedBanner}
            onPress={() => setShowVerify(true)}
            accessibilityLabel="Verify your email address"
            accessibilityRole="button"
          >
            <Ionicons name="warning-outline" size={18} color="#f59e0b" />
            <View style={styles.unverifiedBannerBody}>
              <Text style={styles.unverifiedBannerTitle}>{t('biz_email_not_verified')}</Text>
              <Text style={styles.unverifiedBannerSub}>{t('biz_tap_to_verify')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#78350f" />
          </Pressable>
        )}

        {/* Account section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('biz_account')}</Text>
          <View style={styles.accountCard}>
            <View style={styles.accountRow}>
              <Text style={styles.accountName}>{profile.user.name}</Text>
              {emailUnverified ? (
                <View style={styles.unverifiedBadge}>
                  <Text style={styles.unverifiedBadgeText}>{t('biz_unverified')}</Text>
                </View>
              ) : (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={colours.primary} />
                  <Text style={styles.verifiedBadgeText}>{t('biz_verified')}</Text>
                </View>
              )}
            </View>

            {/* Email — inline editable */}
            {isEditingEmail ? (
              <>
                <View style={styles.emailEditRow}>
                  <TextInput
                    style={[styles.emailInput, emailError !== undefined && styles.emailInputError]}
                    value={emailValue}
                    onChangeText={handleChangeEmail}
                    placeholder="you@email.com"
                    placeholderTextColor={colours.textSubtle}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus
                    accessibilityLabel="Email address input"
                  />
                  {isSavingEmail ? (
                    <ActivityIndicator size="small" color={colours.primary} style={styles.emailAction} />
                  ) : (
                    <>
                      <Pressable
                        onPress={handleSaveEmail}
                        style={styles.emailAction}
                        accessibilityLabel="Save email"
                        accessibilityRole="button"
                      >
                        <Ionicons name="checkmark-circle" size={22} color={colours.primary} />
                      </Pressable>
                      <Pressable
                        onPress={handleCancelEditEmail}
                        style={styles.emailAction}
                        accessibilityLabel="Cancel email edit"
                        accessibilityRole="button"
                      >
                        <Ionicons name="close-circle-outline" size={22} color={colours.textMuted} />
                      </Pressable>
                    </>
                  )}
                </View>
                {emailError !== undefined && (
                  <Text style={styles.emailFieldError}>{emailError}</Text>
                )}
              </>
            ) : profile.user.email !== null ? (
              <View style={styles.accountDetailRow}>
                <Text style={styles.accountDetail}>{profile.user.email}</Text>
                <Pressable
                  onPress={handleStartEditEmail}
                  style={styles.editPencil}
                  accessibilityLabel="Edit email address"
                  accessibilityRole="button"
                >
                  <Ionicons name="pencil-outline" size={14} color={colours.primary} />
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={handleStartEditEmail}
                style={styles.addEmailPrompt}
                accessibilityLabel="Add email address"
                accessibilityRole="button"
              >
                <Ionicons name="add-circle-outline" size={14} color={colours.primary} />
                <Text style={styles.addEmailPromptText}>{t('biz_add_email')}</Text>
              </Pressable>
            )}

            {profile.user.phone !== null && (
              <Text style={styles.accountDetail}>{profile.user.phone}</Text>
            )}
            {emailUnverified && (
              <Pressable
                style={styles.verifyBtn}
                onPress={() => setShowVerify(true)}
                accessibilityLabel="Verify email and set password"
                accessibilityRole="button"
              >
                <Ionicons name="shield-checkmark-outline" size={14} color={colours.primary} />
                <Text style={styles.verifyBtnText}>{t('biz_verify_email_password')}</Text>
              </Pressable>
            )}
          </View>
        </View>

        {profile.kyc !== null && (
          <BusinessInfoSection
            kyc={profile.kyc}
            isEditingPhone={isEditingPhone}
            phoneValue={phoneValue}
            phoneError={phoneError}
            isSaving={isSavingPhone}
            onStartEdit={handleStartEditPhone}
            onCancelEdit={handleCancelEditPhone}
            onChangePhone={handleChangePhone}
            onSave={handleSavePhone}
          />
        )}

        {profile.kyc !== null && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('biz_verification_docs')}</Text>
            {docUploadError !== null && (
              <Text style={styles.docUploadError}>{docUploadError}</Text>
            )}
            {DOC_TYPES.map(({ type, label }) => (
              <KycDocumentCard
                key={type}
                docType={type}
                docTypeLabel={label}
                document={profile.kyc?.documents.find((d) => d.type === type)}
                isUploading={uploadingDocType === type}
                onReplace={handleUploadDocument}
              />
            ))}
          </View>
        )}

        {profile.restaurant !== null && (
          <RestaurantInfoCard restaurant={profile.restaurant} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
