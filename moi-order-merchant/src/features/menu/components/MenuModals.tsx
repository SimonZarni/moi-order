import React, { useState, useCallback } from 'react';
import {
  View, Text, Pressable, Modal, TextInput, ScrollView,
  ActivityIndicator, Image, Switch, StyleProp, TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './MenuModals.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { PLATFORM_FEE_RATE } from '../../../shared/constants/config';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { AddItemForm, OptionGroupInput } from '../hooks/useMenuScreen';

// ── Grouped prop types ─────────────────────────────────────────────────────────

interface AddCatProps {
  show: boolean; name: string;
  onChange: (v: string) => void; onConfirm: () => void; onCancel: () => void;
}

interface RenameProps {
  id: number | null; name: string; isSaving: boolean;
  onChange: (v: string) => void; onConfirm: () => void; onCancel: () => void;
}

interface DeleteCatProps {
  id: number | null; name: string;
  onConfirm: () => void; onCancel: () => void;
}

interface AddItemProps {
  categoryId: number | null; form: AddItemForm; isSaving: boolean;
  onFieldChange: (field: 'name' | 'description' | 'price' | 'original_price', value: string) => void;
  onPickPhoto: () => void;
  onAddOptionGroup: () => void;
  onRemoveOptionGroup: (i: number) => void;
  onOptionGroupChange: (gi: number, field: 'name' | 'is_required' | 'min_selections' | 'max_selections', value: string | boolean | number) => void;
  onAddOption: (gi: number) => void;
  onRemoveOption: (gi: number, oi: number) => void;
  onOptionChange: (gi: number, oi: number, field: 'name' | 'additional_price_cents', value: string | number) => void;
  onClose: () => void; onSubmit: () => void;
}

interface MenuModalsProps {
  addCat: AddCatProps;
  rename: RenameProps;
  deleteModal: DeleteCatProps;
  addItem: AddItemProps;
}

// ── Main component ─────────────────────────────────────────────────────────────

export function MenuModals({ addCat, rename, deleteModal, addItem }: MenuModalsProps): React.JSX.Element {
  const t = useTranslation();

  return (
    <>
      {/* Add category */}
      <Modal visible={addCat.show} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>{t('menu_new_category_title')}</Text>
            <TextInput style={styles.input} placeholder={t('menu_category_name_placeholder')} placeholderTextColor={colours.textSubtle} value={addCat.name} onChangeText={addCat.onChange} autoFocus returnKeyType="done" onSubmitEditing={addCat.onConfirm} accessibilityLabel="Category name" />
            <View style={styles.actions}>
              <Pressable style={styles.cancelBtn} onPress={addCat.onCancel} accessibilityLabel="Cancel" accessibilityRole="button"><Text style={styles.cancelText}>{t('common_cancel')}</Text></Pressable>
              <Pressable style={styles.confirmBtn} onPress={addCat.onConfirm} accessibilityLabel="Add category" accessibilityRole="button"><Text style={styles.confirmText}>{t('common_add')}</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rename category */}
      <Modal visible={rename.id !== null} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>{t('menu_rename_category_title')}</Text>
            <TextInput style={styles.input} placeholder={t('menu_category_name_placeholder')} placeholderTextColor={colours.textSubtle} value={rename.name} onChangeText={rename.onChange} autoFocus returnKeyType="done" onSubmitEditing={rename.onConfirm} accessibilityLabel="Category name" />
            <View style={styles.actions}>
              <Pressable style={styles.cancelBtn} onPress={rename.onCancel} accessibilityLabel="Cancel" accessibilityRole="button"><Text style={styles.cancelText}>{t('common_cancel')}</Text></Pressable>
              <Pressable style={[styles.confirmBtn, rename.isSaving && styles.disabled]} onPress={rename.onConfirm} disabled={rename.isSaving} accessibilityLabel="Save name" accessibilityRole="button">
                {rename.isSaving ? <ActivityIndicator size="small" color={colours.surface} /> : <Text style={styles.confirmText}>{t('common_save')}</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete category */}
      <Modal visible={deleteModal.id !== null} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>{t('menu_delete_category_title')}</Text>
            <Text style={styles.deleteBody}>{`Delete "${deleteModal.name}"? All items will also be removed. This cannot be undone.`}</Text>
            <View style={styles.actions}>
              <Pressable style={styles.cancelBtn} onPress={deleteModal.onCancel} accessibilityLabel="Cancel" accessibilityRole="button"><Text style={styles.cancelText}>{t('common_cancel')}</Text></Pressable>
              <Pressable style={styles.deleteBtn} onPress={deleteModal.onConfirm} accessibilityLabel="Confirm delete" accessibilityRole="button"><Text style={styles.deleteBtnText}>{t('common_delete')}</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add item */}
      <Modal visible={addItem.categoryId !== null} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.scrollWrap}>
            <ScrollView contentContainerStyle={styles.scrollCardContent} keyboardShouldPersistTaps="handled">
              <ItemForm t={t} form={addItem.form} isSaving={addItem.isSaving}
                onFieldChange={addItem.onFieldChange} onPickPhoto={addItem.onPickPhoto}
                onAddOptionGroup={addItem.onAddOptionGroup} onRemoveOptionGroup={addItem.onRemoveOptionGroup}
                onOptionGroupChange={addItem.onOptionGroupChange} onAddOption={addItem.onAddOption}
                onRemoveOption={addItem.onRemoveOption} onOptionChange={addItem.onOptionChange}
                onCancel={addItem.onClose} onSubmit={addItem.onSubmit}
                submitLabel={t('menu_add_item')}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

// ── Item form ──────────────────────────────────────────────────────────────────

interface ItemFormProps {
  t: ReturnType<typeof useTranslation>;
  form: AddItemForm; isSaving: boolean;
  onFieldChange: AddItemProps['onFieldChange'];
  onPickPhoto: () => void;
  onAddOptionGroup: () => void;
  onRemoveOptionGroup: (i: number) => void;
  onOptionGroupChange: AddItemProps['onOptionGroupChange'];
  onAddOption: (gi: number) => void;
  onRemoveOption: (gi: number, oi: number) => void;
  onOptionChange: AddItemProps['onOptionChange'];
  onCancel: () => void; onSubmit: () => void; submitLabel: string;
}

function ItemForm({ t, form, isSaving, onFieldChange, onPickPhoto, onAddOptionGroup, onRemoveOptionGroup, onOptionGroupChange, onAddOption, onRemoveOption, onOptionChange, onCancel, onSubmit, submitLabel }: ItemFormProps): React.JSX.Element {
  const FEE = 1 + PLATFORM_FEE_RATE;
  const priceCents    = form.price.trim() && !isNaN(parseFloat(form.price)) ? Math.round(parseFloat(form.price) * 100 * FEE) : null;
  const origCents     = form.original_price.trim() && !isNaN(parseFloat(form.original_price)) ? Math.round(parseFloat(form.original_price) * 100 * FEE) : null;
  const discountCents = origCents !== null && priceCents !== null ? Math.max(0, origCents - priceCents) : 0;

  return (
    <>
      <Text style={styles.title}>{t('menu_new_item_title')}</Text>
      <TextInput style={styles.input} placeholder={t('menu_item_name_placeholder')} placeholderTextColor={colours.textSubtle} value={form.name} onChangeText={(v) => onFieldChange('name', v)} accessibilityLabel="Item name" />
      <TextInput style={[styles.input, styles.inputMultiline]} placeholder={t('menu_item_desc_placeholder')} placeholderTextColor={colours.textSubtle} value={form.description} onChangeText={(v) => onFieldChange('description', v)} multiline accessibilityLabel="Item description" />
      <View style={styles.priceRow}>
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>{t('menu_price_label')} (your take)</Text>
          <TextInput style={styles.input} placeholder="100.00" placeholderTextColor={colours.textSubtle} value={form.price} onChangeText={(v) => onFieldChange('price', v)} keyboardType="decimal-pad" accessibilityLabel="Item price" />
          {priceCents !== null && <Text style={styles.priceHint}>Customer: {formatPrice(priceCents)}</Text>}
        </View>
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>{t('menu_original_price_label')}</Text>
          <TextInput style={styles.input} placeholder={t('common_optional')} placeholderTextColor={colours.textSubtle} value={form.original_price} onChangeText={(v) => onFieldChange('original_price', v)} keyboardType="decimal-pad" accessibilityLabel="Original price" />
          {origCents !== null && <Text style={styles.priceHint}>Customer: {formatPrice(origCents)}</Text>}
        </View>
      </View>
      {discountCents > 0 && <Text style={styles.discountBadge}>✓ Discount: {formatPrice(discountCents)} off</Text>}

      <PhotoPreview photo={form.photo} onPick={onPickPhoto} t={t} />

      <View style={styles.divider} />
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>{t('menu_options_title')}</Text>
        <Pressable style={styles.addGroupBtn} onPress={onAddOptionGroup} accessibilityRole="button" accessibilityLabel="Add option group">
          <Ionicons name="add-circle-outline" size={14} color={colours.primary} />
          <Text style={styles.addGroupBtnText}>{t('menu_add_group')}</Text>
        </Pressable>
      </View>
      <Text style={styles.sectionHint}>e.g. Group: "Protein" → Options: Pork (+15 ฿), Beef (+20 ฿)</Text>

      {form.option_groups.map((group: OptionGroupInput, gi: number) => (
        <View key={gi} style={styles.optionGroupCard}>
          <View style={styles.optionGroupHeader}>
            <TextInput style={[styles.input, styles.inputFlex]} placeholder={t('menu_group_name_placeholder')} placeholderTextColor={colours.textSubtle} value={group.name} onChangeText={(v) => onOptionGroupChange(gi, 'name', v)} accessibilityLabel={`Option group ${gi + 1} name`} />
            <Pressable style={styles.removePad} onPress={() => onRemoveOptionGroup(gi)} accessibilityRole="button" accessibilityLabel="Remove group"><Ionicons name="trash-outline" size={15} color={colours.error} /></Pressable>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.toggleRow}><Text style={styles.toggleLabel}>{t('menu_required')}</Text><Switch value={group.is_required} onValueChange={(v) => onOptionGroupChange(gi, 'is_required', v)} trackColor={{ false: colours.divider, true: colours.primary + '66' }} thumbColor={group.is_required ? colours.primary : colours.medium} /></View>
            <View style={styles.toggleRow}><Text style={styles.toggleLabel}>{t('menu_min')}</Text><NumericInput style={styles.numInput} value={group.min_selections} min={0} max={10} fallback={0} onChange={(n) => onOptionGroupChange(gi, 'min_selections', n)} accessibilityLabel={`Min selections ${gi + 1}`} /></View>
            <View style={styles.toggleRow}><Text style={styles.toggleLabel}>{t('menu_max')}</Text><NumericInput style={styles.numInput} value={group.max_selections} min={1} max={10} fallback={1} onChange={(n) => onOptionGroupChange(gi, 'max_selections', n)} accessibilityLabel={`Max selections ${gi + 1}`} /></View>
          </View>
          {group.options.map((opt, oi: number) => (
            <View key={oi} style={styles.optionRow}>
              <TextInput style={[styles.input, styles.inputFlex2]} placeholder={t('menu_option_name_placeholder')} placeholderTextColor={colours.textSubtle} value={opt.name} onChangeText={(v) => onOptionChange(gi, oi, 'name', v)} accessibilityLabel={`Option ${oi + 1} name`} />
              <TextInput style={[styles.input, styles.inputFlex1, styles.inputML]} placeholder="+0" placeholderTextColor={colours.textSubtle} value={opt.additional_price_cents === 0 ? '' : String(opt.additional_price_cents / 100)} onChangeText={(v) => onOptionChange(gi, oi, 'additional_price_cents', Math.round(parseFloat(v || '0') * 100))} keyboardType="decimal-pad" accessibilityLabel={`Option ${oi + 1} price`} />
              <Pressable style={styles.removePad} onPress={() => onRemoveOption(gi, oi)} accessibilityRole="button" accessibilityLabel="Remove option"><Ionicons name="close-circle-outline" size={15} color={colours.error} /></Pressable>
            </View>
          ))}
          <Pressable style={styles.addOptionBtn} onPress={() => onAddOption(gi)} accessibilityRole="button" accessibilityLabel="Add option">
            <Ionicons name="add-outline" size={13} color={colours.primary} />
            <Text style={styles.addOptionBtnText}>{t('menu_add_option')}</Text>
          </Pressable>
        </View>
      ))}

      <View style={styles.actions}>
        <Pressable style={styles.cancelBtn} onPress={onCancel} accessibilityLabel="Cancel" accessibilityRole="button"><Text style={styles.cancelText}>{t('common_cancel')}</Text></Pressable>
        <Pressable style={[styles.confirmBtn, (isSaving || !form.name.trim() || !form.price.trim()) && styles.disabled]} onPress={onSubmit} disabled={isSaving || !form.name.trim() || !form.price.trim()} accessibilityLabel={submitLabel} accessibilityRole="button">
          {isSaving ? <ActivityIndicator size="small" color={colours.surface} /> : <Text style={styles.confirmText}>{submitLabel}</Text>}
        </Pressable>
      </View>
    </>
  );
}

// ── Numeric stepper ────────────────────────────────────────────────────────────

interface NumericInputProps { value: number; min: number; max: number; fallback: number; style: StyleProp<TextStyle>; onChange: (n: number) => void; accessibilityLabel: string; }
function NumericInput({ value, min, max, fallback, style, onChange, accessibilityLabel }: NumericInputProps): React.JSX.Element {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <TextInput style={style} value={draft !== null ? draft : String(value)} onFocus={() => setDraft(String(value))} onChangeText={setDraft}
      onBlur={() => { const p = parseInt(draft ?? '', 10); setDraft(null); onChange(isNaN(p) ? fallback : Math.min(max, Math.max(min, p))); }}
      selectTextOnFocus keyboardType="number-pad" accessibilityLabel={accessibilityLabel} />
  );
}

// ── Photo preview ──────────────────────────────────────────────────────────────

interface PhotoPreviewProps { photo: AddItemForm['photo']; onPick: () => void; t: ReturnType<typeof useTranslation>; }
function PhotoPreview({ photo, onPick, t }: PhotoPreviewProps): React.JSX.Element {
  const [loadError, setLoadError] = useState(false);
  const handleError = useCallback(() => setLoadError(true), []);
  const uri = photo !== null ? photo.uri : null;

  if (uri === null) {
    return (
      <Pressable style={[styles.cancelBtn, styles.photoPickerBtn]} onPress={onPick} accessibilityRole="button" accessibilityLabel="Add photo">
        <Ionicons name="image-outline" size={15} color={colours.primary} />
        <Text style={[styles.cancelText, styles.photoPickerText]}>{t('menu_tap_upload_photo')}</Text>
      </Pressable>
    );
  }
  return (
    <View style={styles.photoWrap}>
      {loadError
        ? <Pressable style={[styles.photoImg, styles.photoError]} onPress={onPick} accessibilityRole="button" accessibilityLabel="Photo unavailable, tap to upload"><Ionicons name="image-outline" size={28} color={colours.medium} /><Text style={styles.photoErrorText}>{t('menu_tap_upload_photo')}</Text></Pressable>
        : <Image source={{ uri }} style={styles.photoImg} resizeMode="cover" accessibilityLabel="Item photo" onError={handleError} />
      }
      {photo !== null && !loadError && <View style={styles.newBadge}><Text style={styles.newBadgeText}>{t('menu_photo_badge_new')}</Text></View>}
      {!loadError && <Pressable style={styles.changePhotoBtn} onPress={onPick} accessibilityRole="button" accessibilityLabel="Change photo"><Ionicons name="image-outline" size={14} color={colours.primary} /><Text style={styles.changeBtnText}>{t('menu_change_photo')}</Text></Pressable>}
    </View>
  );
}
