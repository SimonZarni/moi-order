import React, { useCallback } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './Step2Documents.styles';
import { colours } from '../../../shared/theme/colours';
import { KYC_DOC_TYPE, type KycDocType } from '../../../types/enums';
import type { UploadFileRef } from '../../../api/kyc';
import type { ImagePickerAsset } from 'expo-image-picker';

interface DocCard {
  type: KycDocType;
  label: string;
  description: string;
}

const DOC_CARDS: DocCard[] = [
  { type: KYC_DOC_TYPE.NationalId, label: 'National ID', description: 'Front and back of your national ID card' },
  { type: KYC_DOC_TYPE.BusinessRegistration, label: 'Business Registration', description: 'Certificate of business registration' },
  { type: KYC_DOC_TYPE.BankBook, label: 'Bank Book', description: 'First page of your bank account book' },
  { type: KYC_DOC_TYPE.StorefrontPhoto, label: 'Storefront Photo', description: 'A clear photo of your restaurant exterior' },
];

interface Step2DocumentsProps {
  uploadedTypes: Set<KycDocType>;
  previewUris: Partial<Record<KycDocType, string>>;
  isLoading: boolean;
  onBack: () => void;
  onUpload: (type: KycDocType, file: UploadFileRef) => void;
  onSubmit: () => void;
}

export function Step2Documents({
  uploadedTypes,
  previewUris,
  isLoading,
  onBack,
  onUpload,
  onSubmit,
}: Step2DocumentsProps): React.JSX.Element {
  const buildFileRef = useCallback((asset: ImagePickerAsset): UploadFileRef => {
    const mimeType = asset.mimeType ?? 'image/jpeg';
    const ext = mimeType.split('/')[1] ?? 'jpg';
    const name = asset.fileName ?? `document.${ext}`;
    return { uri: asset.uri, name, type: mimeType };
  }, []);

  const handlePickImage = useCallback(
    (docType: KycDocType) => async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        onUpload(docType, buildFileRef(result.assets[0]));
      }
    },
    [onUpload, buildFileRef],
  );

  const allUploaded = DOC_CARDS.every((c) => uploadedTypes.has(c.type));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        style={styles.backRow}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Back to business info"
      >
        <Ionicons name="arrow-back" size={18} color={colours.primary} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Required Documents</Text>
      <Text style={styles.subtitle}>Upload all four documents to continue</Text>

      {DOC_CARDS.map((card) => {
        const uploaded = uploadedTypes.has(card.type);
        const previewUri = previewUris[card.type];
        return (
          <View key={card.type} style={[styles.card, uploaded && styles.cardUploaded]}>
            <View style={styles.cardHeader}>
              <Ionicons
                name={uploaded ? 'checkmark-circle' : 'document-outline'}
                size={24}
                color={uploaded ? colours.success : colours.medium}
              />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{card.label}</Text>
                <Text style={styles.cardDesc}>{card.description}</Text>
              </View>
            </View>

            {previewUri !== undefined && (
              <Image
                source={{ uri: previewUri }}
                style={styles.preview}
                resizeMode="contain"
                accessibilityLabel={`Preview of ${card.label}`}
              />
            )}

            <Pressable
              style={[styles.uploadButton, uploaded && styles.uploadButtonDone]}
              onPress={handlePickImage(card.type)}
              disabled={isLoading}
              accessibilityLabel={`Upload ${card.label}`}
              accessibilityRole="button"
            >
              <Text style={[styles.uploadButtonText, uploaded && styles.uploadButtonTextDone]}>
                {uploaded ? 'Re-upload' : 'Upload'}
              </Text>
            </Pressable>
          </View>
        );
      })}

      <Pressable
        style={[styles.submitButton, (!allUploaded || isLoading) && styles.submitButtonDisabled]}
        onPress={onSubmit}
        disabled={!allUploaded || isLoading}
        accessibilityLabel="Submit KYC application for review"
        accessibilityRole="button"
      >
        {isLoading
          ? <ActivityIndicator color={colours.white} />
          : <Text style={styles.submitButtonText}>Submit Application</Text>}
      </Pressable>
    </ScrollView>
  );
}
