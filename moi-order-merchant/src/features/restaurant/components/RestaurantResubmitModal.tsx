import React from 'react';
import { View, Text, Pressable, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './RestaurantResubmitModal.styles';
import { colours } from '../../../shared/theme/colours';
import { KYC_DOC_TYPE } from '../../../types/enums';
import type { KycDocType } from '../../../types/enums';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { ResubmitForm } from '../hooks/useRestaurantScreen';

interface RestaurantResubmitModalProps {
  visible: boolean;
  resubmitForm: ResubmitForm;
  isSaving: boolean;
  isUsingExistingDocs: boolean;
  onClose: () => void;
  onFieldChange: (field: 'business_name' | 'business_address', value: string) => void;
  onSubmitForm: () => void;
  onPickDoc: (docType: KycDocType) => Promise<void>;
  onUseExistingDocs: () => void;
  onFinalSubmit: () => void;
}

const DOC_TYPES: Array<{ type: KycDocType; labelKey: 'kyc_doc_national_id' | 'kyc_doc_business_reg' | 'kyc_doc_bank_book' | 'kyc_doc_storefront' }> = [
  { type: KYC_DOC_TYPE.NationalId,           labelKey: 'kyc_doc_national_id' },
  { type: KYC_DOC_TYPE.BusinessRegistration, labelKey: 'kyc_doc_business_reg' },
  { type: KYC_DOC_TYPE.BankBook,             labelKey: 'kyc_doc_bank_book' },
  { type: KYC_DOC_TYPE.StorefrontPhoto,      labelKey: 'kyc_doc_storefront' },
];

export function RestaurantResubmitModal({
  visible, resubmitForm, isSaving, isUsingExistingDocs,
  onClose, onFieldChange, onSubmitForm, onPickDoc, onUseExistingDocs, onFinalSubmit,
}: RestaurantResubmitModalProps): React.JSX.Element {
  const t = useTranslation();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {resubmitForm.step === 'done' ? t('restaurant_request_submitted') : t('restaurant_change_name_address')}
            </Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close">
              <Ionicons name="close" size={22} color={colours.textOnDark} />
            </Pressable>
          </View>

          {resubmitForm.step === 'form' && (
            <View style={styles.body}>
              <Text style={styles.note}>{t('restaurant_modal_form_note')}</Text>
              <Text style={styles.label}>{t('restaurant_new_name_label')}</Text>
              <TextInput style={styles.input} value={resubmitForm.business_name} onChangeText={(v) => onFieldChange('business_name', v)} placeholder={t('restaurant_name_label')} placeholderTextColor="rgba(255,255,255,0.3)" accessibilityLabel="New restaurant name" />
              <Text style={styles.label}>{t('restaurant_new_address_label')}</Text>
              <TextInput style={[styles.input, styles.inputMultiline]} value={resubmitForm.business_address} onChangeText={(v) => onFieldChange('business_address', v)} placeholder={t('restaurant_address_label')} placeholderTextColor="rgba(255,255,255,0.3)" multiline accessibilityLabel="New address" />
              <Pressable style={[styles.primaryBtn, isSaving && styles.disabled]} onPress={onSubmitForm} disabled={isSaving} accessibilityRole="button" accessibilityLabel="Next">
                <Text style={styles.primaryBtnText}>{isSaving ? t('restaurant_creating') : t('restaurant_next_upload_docs')}</Text>
              </Pressable>
            </View>
          )}

          {resubmitForm.step === 'docs' && (
            <ScrollView style={styles.docsScroll} contentContainerStyle={styles.docsBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.note}>{t('restaurant_modal_docs_note')}</Text>
              <Pressable style={styles.useExistingBtn} onPress={onUseExistingDocs} disabled={isUsingExistingDocs} accessibilityRole="button" accessibilityLabel="Use same documents">
                {isUsingExistingDocs ? <ActivityIndicator size="small" color={colours.primary} /> : <Ionicons name="copy-outline" size={15} color={colours.primary} />}
                <Text style={styles.useExistingText}>{isUsingExistingDocs ? t('restaurant_copying') : t('restaurant_use_same_docs')}</Text>
              </Pressable>
              <View style={styles.orRow}>
                <View style={styles.orLine} /><Text style={styles.orText}>{t('restaurant_or_upload_new')}</Text><View style={styles.orLine} />
              </View>
              {DOC_TYPES.map(({ type, labelKey }) => {
                const uploaded = resubmitForm.uploadedDocTypes.includes(type);
                return (
                  <View key={type} style={styles.docRow}>
                    <Ionicons name={uploaded ? 'checkmark-circle' : 'ellipse-outline'} size={17} color={uploaded ? colours.success : colours.textSubtle} />
                    <Text style={styles.docLabel}>{t(labelKey)}</Text>
                    {uploaded && <Text style={styles.docReady}>{t('restaurant_doc_ready')}</Text>}
                    <Pressable style={styles.docBtn} onPress={() => { void onPickDoc(type); }} accessibilityRole="button" accessibilityLabel={`${uploaded ? 'Replace' : 'Upload'} document`}>
                      <Text style={styles.docBtnText}>{uploaded ? t('common_replace') : t('common_upload')}</Text>
                    </Pressable>
                  </View>
                );
              })}
              <Text style={styles.docProgress}>{resubmitForm.uploadedDocTypes.length}/{DOC_TYPES.length} documents ready</Text>
              <Pressable style={[styles.primaryBtn, (isSaving || resubmitForm.uploadedDocTypes.length < DOC_TYPES.length) && styles.disabled]} onPress={onFinalSubmit} disabled={isSaving || resubmitForm.uploadedDocTypes.length < DOC_TYPES.length} accessibilityRole="button" accessibilityLabel="Submit">
                <Text style={styles.primaryBtnText}>{isSaving ? t('restaurant_submitting') : t('restaurant_submit_review')}</Text>
              </Pressable>
            </ScrollView>
          )}

          {resubmitForm.step === 'done' && (
            <View style={styles.body}>
              <Ionicons name="checkmark-circle" size={48} color={colours.success} style={styles.doneIcon} />
              <Text style={[styles.note, styles.noteCenter]}>{t('restaurant_submitted_note')}</Text>
              <Pressable style={styles.primaryBtn} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close">
                <Text style={styles.primaryBtnText}>{t('common_done')}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
