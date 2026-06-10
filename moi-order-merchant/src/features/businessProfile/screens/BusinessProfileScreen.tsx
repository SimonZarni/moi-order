import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBusinessProfileScreen } from '../hooks/useBusinessProfileScreen';
import { BusinessInfoSection } from '../components/BusinessInfoSection';
import { KycDocumentCard } from '../components/KycDocumentCard';
import { RestaurantInfoCard } from '../components/RestaurantInfoCard';
import { styles } from './BusinessProfileScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { KYC_DOC_TYPE } from '../../../types/enums';
import type { KycDocType } from '../../../types/enums';

const DOC_TYPES: Array<{ type: KycDocType; label: string }> = [
  { type: KYC_DOC_TYPE.NationalId,           label: 'National ID' },
  { type: KYC_DOC_TYPE.BusinessRegistration, label: 'Business Registration' },
  { type: KYC_DOC_TYPE.BankBook,             label: 'Bank Book' },
  { type: KYC_DOC_TYPE.StorefrontPhoto,      label: 'Storefront Photo' },
];

interface BusinessProfileScreenProps {
  onBack?: () => void;
}

export function BusinessProfileScreen({ onBack }: BusinessProfileScreenProps): React.JSX.Element {
  const {
    profile, isLoading, isError,
    isEditingPhone, phoneValue, phoneError, isSavingPhone,
    handleStartEditPhone, handleCancelEditPhone, handleChangePhone, handleSavePhone,
    handleUploadDocument, uploadingDocType,
    handleBack,
  } = useBusinessProfileScreen();

  const goBack = onBack ?? handleBack;
  const showBackBtn = Platform.OS !== 'web';

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colours.primary} /></View>;
  }

  if (isError || profile === null) {
    return <View style={styles.centered}><Text style={styles.errorText}>Failed to load profile.</Text></View>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {showBackBtn && (
        <View style={styles.header}>
          <Pressable onPress={goBack} style={styles.backBtn} accessibilityLabel="Go back" accessibilityRole="button">
            <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
          </Pressable>
          <Text style={styles.headerTitle}>Business Profile</Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Account section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.accountCard}>
            <Text style={styles.accountName}>{profile.user.name}</Text>
            <Text style={styles.accountDetail}>{profile.user.email}</Text>
            {profile.user.phone !== null && (
              <Text style={styles.accountDetail}>{profile.user.phone}</Text>
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
            <Text style={styles.sectionLabel}>Verification Documents</Text>
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
