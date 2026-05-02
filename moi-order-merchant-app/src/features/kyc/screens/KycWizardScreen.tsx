import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useKycWizard } from '../hooks/useKycWizard';
import { Step1BusinessInfo } from '../components/Step1BusinessInfo';
import { Step2Documents } from '../components/Step2Documents';
import { Step3Confirmation } from '../components/Step3Confirmation';
import { styles } from './KycWizardScreen.styles';
import { useAuthStore } from '../../../store/authStore';

export function KycWizardScreen(): React.JSX.Element {
  const logout = useAuthStore((s) => s.logout);
  const {
    currentStep, step1Data, uploadedTypes, previewUris, isLoading, error,
    handleBack, handleStep1Submit, handleDocUpload, handleSubmitKyc,
  } = useKycWizard();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.stepIndicator}>
        {([1, 2, 3] as const).map((step) => (
          <View key={step} style={[styles.stepDot, currentStep >= step && styles.stepDotActive]}>
            <Text style={[styles.stepDotText, currentStep >= step && styles.stepDotTextActive]}>
              {step}
            </Text>
          </View>
        ))}
      </View>

      {error !== null && <Text style={styles.errorBanner}>{error}</Text>}

      {currentStep === 1 && (
        <Step1BusinessInfo
          initialData={step1Data}
          isLoading={isLoading}
          onSubmit={handleStep1Submit}
        />
      )}
      {currentStep === 2 && (
        <Step2Documents
          uploadedTypes={uploadedTypes}
          previewUris={previewUris}
          isLoading={isLoading}
          onBack={handleBack}
          onUpload={handleDocUpload}
          onSubmit={handleSubmitKyc}
        />
      )}
      {currentStep === 3 && <Step3Confirmation onLogout={logout} />}
    </SafeAreaView>
  );
}
