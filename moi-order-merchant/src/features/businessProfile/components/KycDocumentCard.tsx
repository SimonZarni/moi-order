import React from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './KycDocumentCard.styles';
import { colours } from '../../../shared/theme/colours';
import { KYC_DOC_TYPE } from '../../../types/enums';
import type { KycDocument } from '../../../types/models';
import type { KycDocType } from '../../../types/enums';
import { formatDate } from '../../../shared/utils/formatDate';

interface KycDocumentCardProps {
  docType: KycDocType;
  docTypeLabel: string;
  document: KycDocument | undefined;
  isUploading: boolean;
  onReplace: (type: KycDocType) => void;
}

const DOC_ICONS: Record<KycDocType, keyof typeof Ionicons.glyphMap> = {
  [KYC_DOC_TYPE.NationalId]:           'card-outline',
  [KYC_DOC_TYPE.BusinessRegistration]: 'document-text-outline',
  [KYC_DOC_TYPE.BankBook]:             'wallet-outline',
  [KYC_DOC_TYPE.StorefrontPhoto]:      'storefront-outline',
};

export function KycDocumentCard({
  docType,
  docTypeLabel,
  document,
  isUploading,
  onReplace,
}: KycDocumentCardProps): React.JSX.Element {
  const handleView = (): void => {
    if (document) {
      void Linking.openURL(document.url);
    }
  };

  const handleReplace = (): void => {
    onReplace(docType);
  };

  const icon = DOC_ICONS[docType] ?? 'document-outline';

  return (
    <View style={styles.card}>
      <View style={styles.preview}>
        {document !== undefined ? (
          <Pressable onPress={handleView} accessibilityLabel={`View ${docTypeLabel}`} accessibilityRole="button">
            <Image source={{ uri: document.url }} style={styles.thumbnail} resizeMode="cover" />
            <View style={styles.viewOverlay}>
              <Ionicons name="eye-outline" size={18} color={colours.white} />
            </View>
          </Pressable>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name={icon} size={28} color={colours.textSubtle} />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.docLabel} numberOfLines={1}>{docTypeLabel}</Text>
        {document !== undefined ? (
          <Text style={styles.uploadDate}>{formatDate(document.created_at)}</Text>
        ) : (
          <Text style={styles.missingText}>Not uploaded</Text>
        )}
      </View>

      <Pressable
        onPress={handleReplace}
        disabled={isUploading}
        style={[styles.replaceBtn, document === undefined && styles.replaceBtnEmpty]}
        accessibilityLabel={`${document !== undefined ? 'Replace' : 'Upload'} ${docTypeLabel}`}
        accessibilityRole="button"
      >
        {isUploading ? (
          <ActivityIndicator size="small" color={colours.primary} />
        ) : (
          <>
            <Ionicons
              name={document !== undefined ? 'cloud-upload-outline' : 'add-circle-outline'}
              size={14}
              color={document !== undefined ? colours.primary : colours.textMuted}
            />
            <Text style={[styles.replaceBtnText, document === undefined && styles.replaceBtnTextEmpty]}>
              {document !== undefined ? 'Replace' : 'Upload'}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}
