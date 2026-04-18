import { Locale } from '@/shared/store/localeStore';
import { DOCUMENT_LABELS } from '@/shared/constants/documentLabels';
import { DocumentType } from '@/types/enums';

export function localeName(
  item: { name_en: string; name_mm: string | null },
  locale: Locale,
): string {
  return locale === 'mm' && item.name_mm !== null ? item.name_mm : item.name_en;
}

export function localeLabel(
  item: { label: string; label_mm: string },
  locale: Locale,
): string {
  return locale === 'mm' ? item.label_mm : item.label;
}

export function localeDocumentLabel(docType: DocumentType, locale: Locale): string {
  const labels = DOCUMENT_LABELS[docType];
  return locale === 'mm' ? labels.mm : labels.en;
}
