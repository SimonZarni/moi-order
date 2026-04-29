import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { formatDate } from '@/shared/utils/formatDate';
import { colours } from '@/shared/theme/colours';
import { Document } from '@/types/models';
import { styles } from './DocumentCard.styles';

interface Props {
  document: Document;
  onDelete: (doc: Document) => void;
  isDeleting: boolean;
}

function subtypeLabel(subtype: string | null): string {
  if (!subtype) return 'Document';
  return subtype
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function extractedRows(data: Record<string, string | null>): Array<{ label: string; value: string }> {
  const skip = new Set(['full_name']);
  return Object.entries(data)
    .filter(([key, val]) => val !== null && val !== '' && !skip.has(key))
    .slice(0, 5)
    .map(([key, val]) => ({
      label: key.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      value: String(val),
    }));
}

export function DocumentCard({ document: doc, onDelete, isDeleting }: Props): React.JSX.Element {
  const rows = extractedRows(doc.extracted_data ?? {});
  const name = doc.extracted_data?.['full_name'] ?? null;

  return (
    <View style={styles.card}>
      {!doc.is_valid_type && (
        <View style={styles.warningBanner}>
          <Ionicons name="warning-outline" size={14} color={colours.secondary} />
          <Text style={styles.warningText}>{doc.validation_message ?? 'Document type mismatch'}</Text>
        </View>
      )}

      <View style={styles.cardBody}>
        <Image
          source={{ uri: doc.file_url }}
          style={styles.thumbnail}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <Text style={styles.subtypeLabel}>{subtypeLabel(doc.subtype)}</Text>
            <Pressable
              style={styles.deleteBtn}
              onPress={() => onDelete(doc)}
              disabled={isDeleting}
              accessibilityLabel="Delete document"
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={16} color={colours.danger} />
            </Pressable>
          </View>

          {name !== null && <Text style={styles.nameText}>{name}</Text>}

          {doc.expiry_date !== null && (
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={12} color={colours.textMuted} />
              <Text style={styles.dateLabel}>Expires</Text>
              <Text style={styles.dateValue}>{formatDate(doc.expiry_date)}</Text>
            </View>
          )}
          {doc.extension_date !== null && (
            <View style={styles.dateRow}>
              <Ionicons name="refresh-outline" size={12} color={colours.primary} />
              <Text style={styles.dateLabel}>Next report</Text>
              <Text style={[styles.dateValue, styles.dateValueAccent]}>{formatDate(doc.extension_date)}</Text>
            </View>
          )}

          {rows.map((row) => (
            <View key={row.label} style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>{row.label}</Text>
              <Text style={styles.fieldValue} numberOfLines={1}>{row.value}</Text>
            </View>
          ))}

          <Text style={styles.uploadedAt}>
            Uploaded {formatDate(doc.created_at)}
          </Text>
        </View>
      </View>
    </View>
  );
}
