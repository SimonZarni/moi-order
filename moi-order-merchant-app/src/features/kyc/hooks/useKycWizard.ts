import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { KycStackParamList } from '../../../types/navigation';
import type { KycDocType } from '../../../types/enums';
import type { UploadFileRef } from '../../../api/kyc';
import {
  upsertKycApplication,
  uploadKycDocument,
  submitKycApplication,
} from '../../../api/kyc';
import { extractApiError } from '../../../api/client';

type WizardStep = 1 | 2 | 3;

interface Step1Data {
  business_name: string;
  business_type: string;
  business_address: string;
}

interface UseKycWizardResult {
  currentStep: WizardStep;
  step1Data: Step1Data;
  uploadedTypes: Set<KycDocType>;
  isLoading: boolean;
  error: string | null;
  handleStep1Submit: (data: Step1Data) => Promise<void>;
  handleDocUpload: (type: KycDocType, file: UploadFileRef) => Promise<void>;
  handleSubmitKyc: () => Promise<void>;
}

type Nav = NativeStackNavigationProp<KycStackParamList, 'KycWizard'>;

export function useKycWizard(): UseKycWizardResult {
  const navigation = useNavigation<Nav>();

  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [step1Data, setStep1Data] = useState<Step1Data>({
    business_name: '',
    business_type: '',
    business_address: '',
  });
  const [uploadedTypes, setUploadedTypes] = useState<Set<KycDocType>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStep1Submit = useCallback(async (data: Step1Data) => {
    setIsLoading(true);
    setError(null);
    try {
      await upsertKycApplication(data);
      setStep1Data(data);
      setCurrentStep(2);
    } catch (e) {
      setError(extractApiError(e).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDocUpload = useCallback(
    async (type: KycDocType, file: UploadFileRef) => {
      setIsLoading(true);
      setError(null);
      try {
        await uploadKycDocument(type, file);
        setUploadedTypes((prev) => new Set([...prev, type]));
      } catch (e) {
        setError(extractApiError(e).message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const handleSubmitKyc = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await submitKycApplication();
      setCurrentStep(3);
      navigation.replace('KycPending');
    } catch (e) {
      setError(extractApiError(e).message);
    } finally {
      setIsLoading(false);
    }
  }, [navigation]);

  return {
    currentStep,
    step1Data,
    uploadedTypes,
    isLoading,
    error,
    handleStep1Submit,
    handleDocUpload,
    handleSubmitKyc,
  };
}
