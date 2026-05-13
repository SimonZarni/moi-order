import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import ImageViewing from 'react-native-image-viewing';

import { formatDateDMY, formatDate } from '@/shared/utils/formatDate';
import { colours } from '@/shared/theme/colours';
import { DOCUMENT_TYPE } from '@/types/enums';
import { Document } from '@/types/models';
import { styles } from './DocumentCard.styles';

interface Props {
  document: Document;
  onDelete: (doc: Document) => void;
  isDeleting: boolean;
}

interface AlertLevel {
  level: 'green' | 'yellow' | 'red';
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

function getDaysRemaining(dateIso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateIso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getAlertLevel(daysRemaining: number): AlertLevel | null {
  if (daysRemaining > 20) return null;
  if (daysRemaining > 10) {
    return { level: 'green',  icon: 'checkmark-circle-outline', label: `Due in ${daysRemaining} days` };
  }
  if (daysRemaining > 7) {
    return { level: 'yellow', icon: 'warning-outline',          label: `Due in ${daysRemaining} days — prepare soon` };
  }
  if (daysRemaining >= 0) {
    return { level: 'red',    icon: 'alert-circle-outline',     label: daysRemaining === 0 ? 'Due TODAY — submit now!' : `Due in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} — urgent!` };
  }
  const overdue = Math.abs(daysRemaining);
  return { level: 'red', icon: 'alert-circle-outline', label: `${overdue} day${overdue === 1 ? '' : 's'} overdue — resubmit now!` };
}

function subtypeLabel(subtype: string | null): string {
  if (!subtype) return 'Document';
  return subtype.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const DATE_KEY_RE = /date/i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Keys to promote as the primary bold identifier for student_id documents,
// checked in priority order (Claude's open-ended extraction may use any of these).
const STUDENT_ID_KEYS = ['student_id', 'student_id_number', 'id_number', 'card_number'] as const;

// Display-label overrides for specific extracted_data keys.
const LABEL_OVERRIDES: Record<string, string> = {
  student_id:        'Student Id',
  student_id_number: 'Student Id',
};

function extractedRows(
  data:      Record<string, string | null>,
  extraSkip: ReadonlySet<string> = new Set(),
): Array<{ label: string; value: string }> {
  // Handled explicitly in JSX — skip to avoid duplicates
  const skip = new Set([
    'full_name', 'type', 'country_code', 'passport_number',
    'date_of_birth', 'expiry_date', 'issue_date',
    'previous_report_date', 'next_report_date',
    ...extraSkip,
  ]);
  return Object.entries(data)
    .filter(([key, val]) => val !== null && val !== '' && !skip.has(key))
    .slice(0, 6)
    .map(([key, val]) => {
      const raw = String(val);
      const value = ISO_DATE_RE.test(raw) || DATE_KEY_RE.test(key)
        ? (() => { try { return formatDateDMY(raw); } catch { return raw; } })()
        : raw;
      return {
        label: LABEL_OVERRIDES[key] ?? key.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        value,
      };
    });
}

const ALERT_COLOURS = {
  green:  { bg: '#edfdf5', border: '#6ee7b7', text: '#065f46', icon: '#059669' },
  yellow: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', icon: '#d97706' },
  red:    { bg: '#fff1f2', border: '#fca5a5', text: '#991b1b', icon: '#dc2626' },
};

export function DocumentCard({ document: doc, onDelete, isDeleting }: Props): React.JSX.Element {
  const [viewerOpen, setViewerOpen] = useState(false);

  const alert = useMemo((): AlertLevel | null => {
    if (doc.type !== DOCUMENT_TYPE.NinetyDayReport || doc.extension_date === null) return null;
    return getAlertLevel(getDaysRemaining(doc.extension_date));
  }, [doc.type, doc.extension_date]);

  // For student_id documents, find whichever key Claude used for the card number
  // so we can display it prominently and exclude it from the generic field rows.
  const studentIdKey = doc.subtype === 'student_id'
    ? (STUDENT_ID_KEYS.find(k => (doc.extracted_data?.[k] ?? null) !== null) ?? null)
    : null;

  const rows = extractedRows(
    doc.extracted_data ?? {},
    studentIdKey !== null ? new Set([studentIdKey]) : new Set(),
  );
  const name = doc.extracted_data?.['full_name'] ?? null;

  return (
    <View style={styles.card}>
      {doc.file_url !== null && (
        <ImageViewing
          images={[{ uri: doc.file_url }]}
          imageIndex={0}
          visible={viewerOpen}
          onRequestClose={() => setViewerOpen(false)}
          swipeToCloseEnabled
          doubleTapToZoomEnabled
        />
      )}

      {doc.is_admin_created && (
        <View style={styles.adminBanner}>
          <Ionicons name="shield-checkmark-outline" size={13} color="#1d4ed8" />
          <Text style={styles.adminBannerText}>Added by Admin</Text>
        </View>
      )}

      {!doc.is_valid_type && (
        <View style={styles.warningBanner}>
          <Ionicons name="warning-outline" size={14} color={colours.secondary} />
          <Text style={styles.warningText}>{doc.validation_message ?? 'Document type mismatch'}</Text>
        </View>
      )}

      {alert !== null && (
        <View style={[styles.alertBanner, { backgroundColor: ALERT_COLOURS[alert.level].bg, borderBottomColor: ALERT_COLOURS[alert.level].border }]}>
          <Ionicons name={alert.icon} size={14} color={ALERT_COLOURS[alert.level].icon} />
          <Text style={[styles.alertText, { color: ALERT_COLOURS[alert.level].text }]}>{alert.label}</Text>
        </View>
      )}

      <View style={styles.cardBody}>
        {doc.file_url !== null ? (
          <Pressable onPress={() => setViewerOpen(true)} accessibilityLabel="View document image" accessibilityRole="button">
            <Image source={{ uri: doc.file_url }} style={styles.thumbnail} contentFit="cover" transition={200} />
            <View style={styles.thumbnailOverlay}>
              <Ionicons name="expand-outline" size={14} color="#fff" />
            </View>
          </Pressable>
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Ionicons name="document-outline" size={24} color={colours.textMuted} />
          </View>
        )}

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

          {/* Student Id — card number displayed prominently, second-largest after name */}
          {studentIdKey !== null && doc.extracted_data?.[studentIdKey] != null && (
            <Text style={styles.passportNumber}>
              {doc.extracted_data[studentIdKey] as string}
            </Text>
          )}

          {/* Passport bio page — number (bold), type, country, DOB — expiry stays last */}
          {doc.subtype === 'bio_page' && (
            <>
              {doc.extracted_data?.['passport_number'] != null && (
                <Text style={styles.passportNumber}>
                  {doc.extracted_data['passport_number'] as string}
                </Text>
              )}
              {doc.extracted_data?.['type'] != null && (
                <View style={styles.dateRow}>
                  <Ionicons name="document-outline" size={12} color={colours.textMuted} />
                  <Text style={styles.dateLabel}>Type</Text>
                  <Text style={styles.dateValue}>{doc.extracted_data['type'] as string}</Text>
                </View>
              )}
              {doc.extracted_data?.['country_code'] != null && (
                <View style={styles.dateRow}>
                  <Ionicons name="flag-outline" size={12} color={colours.textMuted} />
                  <Text style={styles.dateLabel}>Country</Text>
                  <Text style={styles.dateValue}>{doc.extracted_data['country_code'] as string}</Text>
                </View>
              )}
              {doc.extracted_data?.['date_of_birth'] != null && (
                <View style={styles.dateRow}>
                  <Ionicons name="person-outline" size={12} color={colours.textMuted} />
                  <Text style={styles.dateLabel}>Date of birth</Text>
                  <Text style={styles.dateValue}>{formatDateDMY(doc.extracted_data['date_of_birth'] as string)}</Text>
                </View>
              )}
            </>
          )}

          {doc.subtype === 'visa_page' && doc.extracted_data?.['issue_date'] != null && (
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={12} color={colours.textMuted} />
              <Text style={styles.dateLabel}>Issued</Text>
              <Text style={styles.dateValue}>{formatDateDMY(doc.extracted_data['issue_date'] as string)}</Text>
            </View>
          )}
          {doc.expiry_date !== null && (
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={12} color={colours.textMuted} />
              <Text style={styles.dateLabel}>Expires</Text>
              <Text style={styles.dateValue}>{formatDateDMY(doc.expiry_date)}</Text>
            </View>
          )}
          {doc.type === DOCUMENT_TYPE.NinetyDayReport && doc.extracted_data?.['previous_report_date'] != null && (
            <View style={styles.dateRow}>
              <Ionicons name="checkmark-circle-outline" size={12} color={colours.medium} />
              <Text style={styles.dateLabel}>Submitted</Text>
              <Text style={styles.dateValue}>{formatDateDMY(doc.extracted_data['previous_report_date'] as string)}</Text>
            </View>
          )}
          {doc.extension_date !== null && (
            <View style={styles.dateRow}>
              <Ionicons name="refresh-outline" size={12} color={colours.primary} />
              <Text style={styles.dateLabel}>Next report</Text>
              <Text style={[styles.dateValue, styles.dateValueAccent]}>{formatDateDMY(doc.extension_date)}</Text>
            </View>
          )}

          {rows.map((row) => (
            <View key={row.label} style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>{row.label}</Text>
              <Text style={styles.fieldValue} numberOfLines={1}>{row.value}</Text>
            </View>
          ))}

          <Text style={styles.uploadedAt}>Uploaded {formatDate(doc.created_at)}</Text>
        </View>
      </View>
    </View>
  );
}
