import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Switch, Text, TextInput, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DocumentPickerField } from '@/shared/components/DocumentPickerField/DocumentPickerField';
import { ErrorBanner } from '@/shared/components/ErrorBanner/ErrorBanner';
import { useGenericServiceFormScreen } from '@/features/genericService/hooks/useGenericServiceFormScreen';
import { useLocale } from '@/shared/hooks/useLocale';
import { localeDocumentLabel } from '@/shared/utils/localeName';
import { DOCUMENT_TYPE, DocumentType } from '@/types/enums';
import { FieldSchemaItem } from '@/types/models';
import { colours } from '@/shared/theme/colours';
import { Locale } from '@/shared/store/localeStore';
import { styles } from './GenericServiceFormScreen.styles';

// ── Document type icon map ────────────────────────────────────────────────────

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const DOC_TYPE_ICON: Record<DocumentType, IoniconsName> = {
  [DOCUMENT_TYPE.PassportBioPage]:   'document-text',
  [DOCUMENT_TYPE.VisaPage]:          'id-card',
  [DOCUMENT_TYPE.OldSlip]:           'receipt',
  [DOCUMENT_TYPE.IdentityCardFront]: 'id-card',
  [DOCUMENT_TYPE.IdentityCardBack]:  'id-card',
  [DOCUMENT_TYPE.Tm30]:              'clipboard',
  [DOCUMENT_TYPE.UpperBodyPhoto]:    'person',
  [DOCUMENT_TYPE.AirplaneTicket]:    'airplane',
  [DOCUMENT_TYPE.PassportSizePhoto]: 'camera',
  [DOCUMENT_TYPE.TestPhoto]:         'image',
};

// ── Field renderer ────────────────────────────────────────────────────────────

interface FieldProps {
  field:           FieldSchemaItem;
  value:           string;
  fileSelected:    boolean;
  error:           string | undefined;
  onChange:        (key: string, value: string) => void;
  onPickFile:      (key: string) => void;
  locale:          Locale;
}

function DynamicField({ field, value, fileSelected, error, onChange, onPickFile, locale }: FieldProps): React.JSX.Element {
  const label = locale === 'mm' && field.label_mm ? field.label_mm : field.label_en;

  const renderInput = (): React.JSX.Element => {
    if (field.type === 'textarea') {
      return (
        <TextInput
          style={[styles.textInput, styles.textInputMultiline, error ? styles.textInputError : null]}
          value={value}
          onChangeText={(v) => onChange(field.key, v)}
          placeholder={label}
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={4}
          accessibilityLabel={label}
        />
      );
    }

    if (field.type === 'select' && field.options && field.options.length > 0) {
      return (
        <View style={styles.optionRow}>
          {field.options.map((opt) => (
            <Pressable
              key={opt}
              style={[styles.optionBtn, value === opt && styles.optionBtnSelected]}
              onPress={() => onChange(field.key, opt)}
              accessibilityLabel={opt}
              accessibilityRole="button"
            >
              <Text style={[styles.optionBtnText, value === opt && styles.optionBtnTextSelected]}>
                {opt}
              </Text>
            </Pressable>
          ))}
        </View>
      );
    }

    if (field.type === 'boolean') {
      return (
        <View style={styles.boolRow}>
          <Text style={styles.boolLabel}>{label}</Text>
          <Switch
            value={value === 'true'}
            onValueChange={(v) => onChange(field.key, v ? 'true' : 'false')}
            trackColor={{ true: colours.primary }}
            accessibilityLabel={label}
          />
        </View>
      );
    }

    if (field.type === 'file') {
      const docType = field.document_type as DocumentType | undefined;
      const docLabel = docType != null
        ? localeDocumentLabel(docType, locale)
        : label;
      const icon: IoniconsName = docType != null ? DOC_TYPE_ICON[docType] : 'cloud-upload-outline';
      return (
        <DocumentPickerField
          label={docLabel}
          icon={icon}
          onPress={() => onPickFile(field.key)}
          isUploaded={fileSelected}
          error={error}
          accessibilityLabel={`Upload ${docLabel}`}
        />
      );
    }

    const keyboardType = (() => {
      if (field.type === 'number') return 'numeric' as const;
      if (field.type === 'email')  return 'email-address' as const;
      if (field.type === 'phone')  return 'phone-pad' as const;
      return 'default' as const;
    })();

    return (
      <TextInput
        style={[styles.textInput, error ? styles.textInputError : null]}
        value={value}
        onChangeText={(v) => onChange(field.key, v)}
        placeholder={label}
        placeholderTextColor="#94a3b8"
        keyboardType={keyboardType}
        accessibilityLabel={label}
      />
    );
  };

  // DocumentPickerField renders its own label and error; skip wrapper for file fields
  if (field.type === 'file') {
    return <View style={styles.fieldGroup}>{renderInput()}</View>;
  }

  return (
    <View style={styles.fieldGroup}>
      {field.type !== 'boolean' && (
        <Text style={styles.fieldLabel}>
          {label}
          {field.required ? <Text style={styles.fieldRequired}> *</Text> : null}
        </Text>
      )}
      {renderInput()}
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function GenericServiceFormScreen(): React.JSX.Element {
  const {
    form,
    schema,
    hasSchema,
    serviceName,
    price,
    isLoadingSchema,
    isSubmitting,
    bannerError,
    handleChange,
    handlePickFile,
    handleSubmit,
    handleBack,
  } = useGenericServiceFormScreen();

  const { locale } = useLocale();
  const priceFormatted = `฿${price.toLocaleString('th-TH')}`;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={handleBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={20} color={colours.tertiary} />
          <Text style={styles.backLabel}>Other Services</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{serviceName}</Text>
        <View style={styles.headerPriceBadge}>
          <Text style={styles.headerPrice}>{priceFormatted}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {isLoadingSchema ? (
          <View style={StyleSheet.absoluteFillObject as object} >
            <ActivityIndicator color={colours.primary} style={{ marginTop: 80 }} />
          </View>
        ) : null}

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ErrorBanner message={bannerError} />

          <Text style={styles.sectionTitle}>Your Information</Text>

          {!isLoadingSchema && !hasSchema ? (
            <Text style={styles.emptySchemaText}>
              This service type is not yet configured. Please contact support.
            </Text>
          ) : null}

          {schema.map((field) => (
            <DynamicField
              key={field.key}
              field={field}
              value={form.fields[field.key] ?? ''}
              fileSelected={field.key in form.files}
              error={form.errors[field.key]}
              onChange={handleChange}
              onPickFile={handlePickFile}
              locale={locale}
            />
          ))}
        </ScrollView>

        <View style={styles.submitBar}>
          <Pressable
            style={[styles.submitBtn, (isSubmitting || !hasSchema) && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting || !hasSchema}
            accessibilityLabel={`Submit ${serviceName} — ${priceFormatted}`}
            accessibilityRole="button"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>{`Submit · ${priceFormatted}`}</Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
